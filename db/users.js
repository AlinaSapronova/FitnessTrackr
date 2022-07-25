const client = require("./client");

const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.log("CreateUsers errors");
    throw error;
  }
}

//get user - this hsould be able to verify the password against the hashed password.
async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  try {
    const {rows}= await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, isValid]
    );
    return rows;

  } catch (error) {
    console.log("error getUser");
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT id, username,
    FROM users,
    WHERE id = ${userId} 
    `)

    // user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}



async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    )

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
