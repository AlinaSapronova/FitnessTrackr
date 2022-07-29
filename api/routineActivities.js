const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");
const {updateRoutineActivity,getRoutineActivityById,  destroyRoutineActivity,destroyRoutine, getRoutineById} = require("../db")


// PATCH /api/routine_activities/:routineActivityId


router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
      const id = req.params.routineActivityId;
      const {count,duration } = req.body;
  

    try {   
         const routine = await getRoutineActivityById(id);
           if (routine.creatorId != req.user.id) {
        res.status(403);
        next({
          name: "UserExists",
          message: `User ${req.user.username} is not allowed to update In the evening`,
        });
      }
     
      const updatedRoutineActivities = await updateRoutineActivity(id,count,duration);
      console.log("ghvsfghksvdkcghvdsgcvFFFFF", updatedRoutineActivities)
      if(updatedRoutineActivities){
       res.send(updatedRoutineActivities);
      }
    else {
        
        next({
            name: "UserErrror",
            message: `User ${req.user.username} is not allowed to update In the evening`,
               });
    }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });






// DELETE /api/routine_activities/:routineActivityId


router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    try {
      const id = req.params.routineActivityId;
      const routineActivity = await getRoutineActivityById(id);
      const routines = await getRoutineById(routineActivity.id)
      // console.log(routine, "THIS IS ROUTINE")
      if (routines.creatorId != req.user.id) {
        res.status(403);
        next({
          name: "Error",
          message: `User ${req.user.username} is not allowed to delete In the afternoon`,
        });
      }else{
      const deletedRoutineActivity = await destroyRoutineActivity(routineActivity.id);
      console.log(deletedRoutineActivity, "THIS IS DELTED ROUTINE")
      res.send(routineActivity);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });




module.exports = router;
