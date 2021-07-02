const client = require('../lib/client');
// import our seed data:
const trivia = require('./trivia.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
    
    const user = users[0].rows[0];

    await Promise.all(
      trivia.map(t => {
        return client.query(`
                    INSERT INTO trivia (category, difficulty, question, correct_answer, incorrect_answers, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [t.category, t.difficulty, t.question, t.correct_answer, t.incorrect_answers, user.id]);
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
