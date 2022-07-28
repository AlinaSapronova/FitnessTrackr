const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
//npm run test:watch api

const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getAllPublicRoutines
} = require("../db");




// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next)=>{
    const id = req.params.activityId
    // console.log(id)
    try{
        const routinesOfPublic= await getAllPublicRoutines({id})
        const activity = await getActivityById(id)
        if(!activity){
            next({
                    name: "RoutineDoesNotExist",
                    message: `Activity ${id} not found`
            })
            }
        if(routinesOfPublic){    
            res.send(routinesOfPublic)
        }
        }catch(error){
        next(error)
    }
})

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities

router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const newActivity = {};
  try {
    const existActivity = await getActivityByName(name);
    if (existActivity) {
      next({
        name: "Activity exists",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      newActivity.name = name;
      newActivity.description = description;
      const activitiesCreated = await createActivity(newActivity);
      res.send(activitiesCreated);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

router.patch("/:activityId", async (req, res, next) => {
  const id = req.params.activityId;
  const { name, description } = req.body;
  try {
    const originalActivity = await getActivityById(id);
    if (!originalActivity) {
      next({
        name: "ActivityExists",
        message: `Activity ${id} not found`,
      });
      return;
    }

    const nameOfActivity = await getActivityByName(name);
    if (nameOfActivity) {
      next({
        name: "ActivityExists",
        message: `An activity with name ${name} already exists`,
      });
    }
    const updatedActivity = await updateActivity({name, description, id});
    if (updatedActivity) {
      res.send(updatedActivity);
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "Activity 10000 not found",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
}
});

module.exports = router;
