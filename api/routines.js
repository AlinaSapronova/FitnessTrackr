const express = require("express");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutineActivitiesByRoutine,
  getRoutineActivityById,
  addActivityToRoutine,
  destroyRoutine,
} = require("../db");
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});
// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  
  try {
    const { name, goal } = req.body;
    const createdRoutines = await createRoutine({
      creatorId: req.user.id,
      name,
      goal,
      isPublic: req.body.isPublic,
    });
    if (createdRoutines) {
      res.send(createdRoutines);
    }
  } catch (error) {
    next(error);
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineId;
    const { name, goal, isPublic } = req.body;
    const routine = await getRoutineById(req.params.routineId);
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UserExists",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
      });
    }
    const updatedRoutine = await updateRoutine({
      id: id,
      isPublic,
      name,
      goal,
    });
    res.send(updatedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId

router.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineId;
    const routine = await getRoutineById(id);
    // console.log(routine, "THIS IS ROUTINE")
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "Error",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }else{
    const deletedRoutine = await destroyRoutine(routine.id);
    console.log(deletedRoutine, "THIS IS DELTED ROUTINE")
    res.send(routine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
    const {routineId} = req.params;
    // const createdRoutine = id.creatorid
    const {activityId, count, duration } = req.body;
    try {
      const originalRoutine = await getRoutineActivityById(activityId);
      if(originalRoutine){
        next({
            name: "Duplicate",
            message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          });
      }
      else{
      const createRoutines = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration
      });
      res.send(createRoutines)
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
