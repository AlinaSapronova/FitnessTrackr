const client = require("./client");
const {attachActivitiesToRoutines} = require("./activities");
const {getUserByUsername} = require('./');

async function createRoutine({ creatorId, isPublic, name, goal }) {

  const {
    rows
  } = await client.query(
    `
    INSERT INTO routines("creatorId", "isPublic", name, goal ) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
  `,
    [creatorId, isPublic, name, goal ]
  );
  return rows[0];

}

async function getRoutineById(id) {
  const { rows :[routine] } = await client.query(`
  SELECT *
  FROM routines
  WHERE id=$1;
`, [id]);
return routine;
  
}


async function getRoutinesWithoutActivities() {
  const { rows } = await client.query(`
  SELECT *
  FROM routines;
`);
return rows;

}

async function getAllRoutines() {
  try{
  const {rows} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
  `);
  return attachActivitiesToRoutines(rows);
  }catch(error) {
    console.error("getAllRoutines errors")
    throw error
  } 
}

async function getAllPublicRoutines() {
  try{
    const {rows} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id
        WHERE routines."isPublic" = true;
    `);
    return attachActivitiesToRoutines(rows);
    }catch(error) {
      console.error("getAllRoutines errors")
      throw error
    } 
}


async function getAllRoutinesByUser({ username }) {
  try{
    const {rows:routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id
        WHERE username = $1
    `, [username]);
    return attachActivitiesToRoutines(routines);
    }catch(error) {
      console.error("getAllRoutines errors")
      throw error
    } 

}

async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows:routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id
        WHERE username = $1 AND routines."isPublic" = true;
    `, [username]);
    return attachActivitiesToRoutines(routines);
    }catch(error) {
      console.error("getAllRoutines errors")
      throw error
    } 
}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const {rows:routines} = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id
        JOIN routine_activities ON routine_activities."routineId" = routines.id
        WHERE routine_activities."activityId" = ${id} AND routines."isPublic" = true;
    `,);
    return attachActivitiesToRoutines(routines);
    }catch(error) {
      console.error("getAllRoutines errors")
      throw error
    } 
  
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
 try{ 
const{rows:[routine]} =
    await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    return routine
   } catch (error) {
      console.log("There is an error in updateRoutine");
       throw error;
 }
}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
