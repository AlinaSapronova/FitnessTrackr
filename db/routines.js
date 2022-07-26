const client = require("./client");
const {attachActivitiesToRoutines} = require("./activities");

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

      
// JOIN routine_activities ON routine_activities."activityId" = activities.id
// JOIN username AS "creatorName"
// ON routines.creatorId = routines.user(id)
//routine_activities.count
//routine_activities.duration,
//routine_activities."routineId"
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
  const {rows: [isPublic]} = await client.query(`
  SELECT "isPublic"
  FROM routines;
  `,
  );
  return isPublic;
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

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
