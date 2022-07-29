const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  destroyRoutineActivity,
  getRoutineById,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId

router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { duration, count } = req.body;
  const routineActivity = await getRoutineActivityById(
    req.params.routineActivityId
  );
  const routines = await getRoutineById(routineActivity.id);
  const routineId = routineActivity.routineId;
  const activityId = routineActivity.activityId;
  const id = routineActivity.id;
  try {
    const updatedRoutineActivities = await updateRoutineActivity({
      id,
      routineId,
      activityId,
      duration,
      count,
    });
    if (routines.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UserExists",
        message: `User ${req.user.username} is not allowed to update ${routines.name}`,
      });
    } else if (updatedRoutineActivities) {
      console.log(updatedRoutineActivities, "THIS IS UPDATED ROUTINE");
      res.send({ count, duration });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// try {
//   const updatedRoutineActivities = await updateRoutineActivity({
//     id: id,
//     routineId,
//     activityId,
//     duration,
//     count,
//   });
//   console.log("ghvsfghksvdkcghvdsgcvFFFFF", updatedRoutineActivities);
//     const routine = await getRoutineActivityById(id);
//     if (routine.creatorId != req.user.id) {
//       res.status(403);
//       next({
//         name: "UserExists",
//         message: `User ${req.user.username} is not allowed to update In the evening`,
//       });
//     }else if(updatedRoutineActivities){
//       console.log(updatedRoutineActivities, "THIS IS UPDATED ROUTINE")
//     res.send({ count, duration })
//     }
// } catch ({ name, message }) {
//   next({ name, message });
// }
// });

// DELETE /api/routine_activities/:routineActivityId

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const id = req.params.routineActivityId;
    const routineActivity = await getRoutineActivityById(id);
    const routines = await getRoutineById(routineActivity.id);
    // console.log(routine, "THIS IS ROUTINE")
    if (routines.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "Error",
        message: `User ${req.user.username} is not allowed to delete In the afternoon`,
      });
    } else {
      const deletedRoutineActivity = await destroyRoutineActivity(
        routineActivity.id
      );
      console.log(deletedRoutineActivity, "THIS IS DELTED ROUTINE");
      res.send(routineActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
