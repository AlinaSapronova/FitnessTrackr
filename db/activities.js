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

async function attachActivitiesToRoutines(routines) {}




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
