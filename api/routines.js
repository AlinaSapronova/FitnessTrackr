const express = require("express");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutineActivitiesByRoutine,
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
router.post("/:activityId", async (req, res, next) => {
  const id = req.params.routineId;
  const { activityId, count, duration } = req.body;
  try {
    const originalActivity = await getRoutineActivitiesByRoutine(id);
    if (!originalActivity) {
      next({
        name: "RoutineActivityExists",
        message: `a RoutineActivity by that routine${id}, activity${id}, combo already exists`,
      });
      return;
    }

    const nameOfActivity = await getRoutineById(id);
    if (nameOfActivity) {
      next({
        name: "ActivityExists",
        message: `An activity with name ${id} already exists`,
      });
    }
    const createdActivity = await addActivityToRoutine({
      activityId,
      count,
      duration,
      id,
    });
    if (createdActivity) {
      res.send(createdActivity);
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
