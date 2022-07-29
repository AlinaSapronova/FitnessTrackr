const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  destroyRoutineActivity,
  getRoutineById,
  canEditRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId

///this particular patch works when refreshed and often breaks, but does have a pass.
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { duration, count } = req.body;
  const id = req.params.routineActivityId;
  const routineActivity = await getRoutineActivityById(id);
  const routine = await getRoutineById(routineActivity.routineId);

  // const id = routineActivity.id;
  try {
    console.log("routineActivityghvfghv", routineActivity);
    if (!routineActivity) {
      res.status(403);
      next({
        name: "NotFound",
        message: `No Routine Activity can be displayed`,
      });
    } else {
      if (req.user.id !== routine.creatorId) {
        next({
          error:"Error",
          name: "Unauthorized",
          message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        });
      } else {
        const updatedRoutineActivities = await updateRoutineActivity({
          id,
          duration,
          count,
        });
        res.send(updatedRoutineActivities)
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineActivityId;

    const routine_Activity = await canEditRoutineActivity(id, req.user.id);
    if (routine_Activity) {
      const deletedRoutineActivity = await destroyRoutineActivity(id);
      console.log(deletedRoutineActivity, "THIS IS DELTED ROUTINE");
      res.send({
        success: true,
        ...deletedRoutineActivity,
      });
    } else {
      res.status(403);
      next({
        name: "Error",
        message: `User ${req.user.username} is not allowed to delete In the afternoon`,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
