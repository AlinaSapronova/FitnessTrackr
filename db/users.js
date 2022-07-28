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
      RETURNING  username, id;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.error("CreateUsers errors");
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  if (passwordsMatch) {
  delete user.password;
  return user;
  } 
  else if(!passwordsMatch) {
    return ;
  }
  else {
    throw console.log("Thers an error in GetUser");
  }
  
}

async function getUserById(userId) {
 // eslint-disable-next-line no-useless-catch
 try{
  const {rows:[user] } = await client.query(`
  SELECT id, username
  FROM users
  WHERE id=$1
  `,[userId]);
  return user;
 }catch(error){
  console.error('Error getUserById')
  throw error;
  }
}




async function getUserByUsername(username) {
  // eslint-disable-next-line no-useless-catch
  try{
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );
    return user;
    }catch(error){
      console.error('Error getUserByUsername')
      throw error;
      }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
