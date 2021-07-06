const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );
                CREATE TABLE leaderboard (
                  id SERIAL PRIMARY KEY, 
                  high_scores INTEGER NOT NULL
                );
                CREATE TABLE scores (
                    id SERIAL PRIMARY KEY, 
                    total_scores INTEGER NOT NULL, 
                    nature_scores INTEGER NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id), 
                    leaderboard_id INTEGER NOT NULL REFERENCES leaderboard(id)
                );

        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
