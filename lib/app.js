const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent'); 




const { mungeTriviaFunc } = require('./munges.js'); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


app.get('/trivias', async(req, res) => {
  try {
    // const difficulty = req.query.search; 
    const triviaData = await request.get('https://opentdb.com/api.php?amount=5&category=9&difficulty=hard&type=boolean'); 
    const mungedTriviaData = mungeTriviaFunc(triviaData.body); 
    res.json(mungedTriviaData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.get('/zombies', async(req, res) => {
  try {
    // const difficulty = req.query.search; 
    const triviaData = await request.get('https://opentdb.com/api.php?amount=8&category=9&difficulty=easy&type=boolean'); 
    const mungedTriviaData = mungeTriviaFunc(triviaData.body); 
    res.json(mungedTriviaData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/aliens', async(req, res) => {
  try {
    // const difficulty = req.query.search; 
    const triviaData = await request.get('https://opentdb.com/api.php?amount=8&category=18&difficulty=medium&type=boolean'); 
    const mungedTriviaData = mungeTriviaFunc(triviaData.body); 
    res.json(mungedTriviaData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/werewolves', async(req, res) => {
  try {
    // const difficulty = req.query.search; 
    const triviaData = await request.get('https://opentdb.com/api.php?amount=8&category=20&difficulty=hard&type=boolean'); 
    const mungedTriviaData = mungeTriviaFunc(triviaData.body); 
    res.json(mungedTriviaData);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/userscores', async(req, res) => {
  try {
    const data = await client.query(`
        SELECT * FROM scores 
        WHERE scores.id = userId 
      `); 
    res.json(data.rows); 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  
}); 

app.get('/api/allscores', async(req, res) => {
  try {
    const data = await client.query(`
        SELECT * FROM scores 
      `); 
    res.json(data.rows); 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  
}); 



app.post('/api/leaderboard', async(req, res) => {
  try {
    const data = await client.query(`
        INSERT INTO
          leaderboard (high_scores)
        VALUES
          ($1)
        RETURNING 
          * 
    `, [req.body.high_scores])
    ; 
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.post('/api/scores', async(req, res) => {
  try {
    const data = await client.query(`
        INSERT INTO
          scores (display_name, total_scores, owner_id)
        VALUES
          ($1, $2, $3)
        RETURNING 
          * 
    `, [req.body.display_name, req.body.total_scores, req.userId])
    ; 
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});





app.put('/api/scores/:id', async(req, res) => {
  try {
    const data = await client.query(`
        UPDATE 
          scores
        SET 
          total_scores = $1
        WHERE 
          id=$3
        RETURNING 
          * 
     `, 
    [req.body.total_scores])
    ; 
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.delete('/api/scores/:id', async(req, res) => {
  try {
    const data = await client.query(`DELETE 
      FROM 
        scores
      WHERE
        id=$1 
      `,
    [req.params.id]
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
