const client = require('../lib/client');
// import our seed data:
const scores = require('./scores.js'); 
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (
                        first_name, 
                        last_name, 
                        email, 
                        hash
                      )
                      VALUES (
                        $1, 
                        $2, 
                        $3, 
                        $4
                      )
                      RETURNING  
                        *;
                  `,
        [user.first_name, user.last_name, user.email, user.hash]);
      })
    );
    
    const user = users[0].rows[0];

    await Promise.all(
      scores.map(score => {
        return client.query(`
                    INSERT INTO scores (total_scores, nature_scores, owner_id)
                    VALUES ($1, $2, $3);
                `,
        [score.total_scores, score.nature_scores, user.id]);
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
