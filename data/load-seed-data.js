const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// import our seed data:
const scores = require('./scores.js'); 
const leaderboardData = require('./leaderboard.js'); 
const usersData = require('./users.js');


run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (
                        email, 
                        hash
                      )
                      VALUES (
                        $1, 
                        $2
                      )
                      RETURNING  
                        *;
                  `,
        [user.email, user.hash]);
      })
    );
    
    const user = users[0].rows[0];

    const leaderboards = await Promise.all(
      leaderboardData.map(board => {
        return client.query(`
                    INSERT INTO 
                      leaderboard (high_scores)
                    VALUES 
                      ($1)
                    RETURNING  
                      *;
                `,
        [board.high_scores]);
      })
    );
    
    const leaderboard = leaderboards[0].rows[0]; 

    await Promise.all(
      scores.map(score => {
        return client.query(`
                    INSERT INTO 
                      scores (total_scores, nature_scores, owner_Id, leaderboard_id)
                    VALUES 
                      ($1, $2, $3, $4)
                    RETURNING  
                      *;
                `,
        [score.total_scores, score.nature_scores, user.id, leaderboard.id]);
      })
    );

  
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
