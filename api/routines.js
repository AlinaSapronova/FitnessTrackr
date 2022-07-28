const express = require('express');
const { getAllRoutines, createRoutine, getRoutineById, updateRoutine } = require('../db');
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
    const { name, goal } = req.body;
    try {
        const createdRoutines = await createRoutine({
            creatorId: req.user.id, name, goal, 
            isPublic: req.body.isPublic});
        if(createdRoutines){
            res.send(createdRoutines)
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
        const routine = await getRoutineById(req.params.routineId)
        if(routine.creatorId != req.user.id){
            res.status(403)
            next({
          name: "UserExists",
          message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        })
        }
        const updatedRoutine = await updateRoutine({id: id, isPublic, name, goal});
        res.send(updatedRoutine)
    } catch ({ name, message }) {
      next({ name, message });
  }
  });

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
