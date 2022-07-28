const client = require("./client");

async function addActivityToRoutine({routineId,activityId,count,duration,}) {
  try{
  const {rows:[routine_activities]} = await client.query(`
  INSERT INTO routine_activities(
  "routineId",
  "activityId",
  count,
  duration)
  VALUES ($1,$2,$3,$4)
  RETURNING *`
  ,[ routineId,activityId, count,duration]
  );
  return routine_activities;
  }catch(error) {
    console.error("Add Activity To Routine errors")
    throw error
  }

}

async function getRoutineActivityById(id) {
  const { rows :[routine_activities] } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE id=${id};
`,);
return routine_activities;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows} = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE "routineId"= ${id}
`);
return rows;
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
 try{ 
const{rows:[routine_activities]} =
    await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    return routine_activities
   } catch (error) {
      console.log("There is an error in updateRoutineActivity");
       throw error;
 }
}

async function destroyRoutineActivity(id){ 
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      ` DELETE FROM routine_activities 
        WHERE id = ${id}
        RETURNING *;
    `
    );
    return routineActivity;
  } catch (error) {
    console.log("throw error")
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    const {rows:[routineActivity]} = await client.query(`
    SELECT *
    FROM routine_activities
    JOIN routines ON routine_activities."routineId" = routines.id
    WHERE routine_activities."activityId" = ${routineActivityId} AND routines."creatorId" = ${userId}
    `);
   return routineActivity;

  }catch(error) {
    console.error("Errors in Edit Routine_activites")
    throw error
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
