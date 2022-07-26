const client = require("./client");

// database functions
async function createActivity({ name, description }) {

    const {
      rows
    } = await client.query(
      `
      INSERT INTO activities(name, description) 
      VALUES($1, $2)
      RETURNING *;
    `,
      [name, description]
    );
    return rows[0];

    // const tagList = await createTags(tags);

    // return await addTagsToPost(post.id, tagList);
  // return the new activity
}

async function getAllActivities() {
  
    const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);

    // const posts = await Promise.all(
    //   postIds.map((post) => getPostById(post.id))
    // );

    return rows;
  // select and return an array of all activities
}

async function getActivityById(id) {
  const { rows  } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=$1;
`, [id]);
return rows[0];
}


async function getActivityByName(name) {
  try{
  const {rows:[activity]} = await client.query(`
  SELECT *
  FROM activities
  WHERE name=$1;
`,[name]);
return activity;
  }catch(error){
    console.log("Error at getActivityByName")
    throw error
  }
}


  async function attachActivitiesToRoutines(routines) {
    // no side effects
    const routinesToReturn = [...routines];
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map(routine => routine.id);
    if (!routineIds?.length) return [];
    
    try {
      // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
      const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities 
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${ binds });
      `, routineIds);
  
      // loop over the routines
      for(const routine of routinesToReturn) {
        // filter the activities to only include those that have this routineId
        const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
        // attach the activities to each single routine
        routine.activities = activitiesToAdd;
      }
      return routinesToReturn;
    } catch (error) {
      console.error("errors in Attach Activities To Routines")
      throw error;
    }
  }





async function updateActivity({ ...fields}) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
 try{ 
const{rows:[activity]} =
    await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=$1
      RETURNING *;
    `,
      Object.values(fields)
    );
    return activity
   } catch (error) {
      console.log("There is an error in updateActivity");
       throw error;
 }
}





module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
