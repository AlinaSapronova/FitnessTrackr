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
return rows[id];
}


async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {}




async function updateActivity({ id, name, description }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
const rows =
  await client.query(
    `
    UPDATE activities
    SET ${name, description}
    WHERE id=$1    
    RETURNING *;
  ` ,[id, name, description]
   );
  return rows;
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
