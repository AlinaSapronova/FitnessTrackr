const express = require('express');
const { getAllRoutines, getRoutineById, createRoutine } = require('../db');
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
    const newRoutines = {};
    try {
      const existRoutine = await getRoutineById({id: req.params.creatorId});
      if (existRoutine) {
        next({
          name: "Activity exists",
          message: `An activity with name ${creatorId} already exists`,
        });
      } else {
        newRoutines.name = name;
        newRoutines.goal = goal;
        const createdRoutines = await createRoutine(newRoutines);
        res.send(createdRoutines);
      }
    } catch (error) {
      next(error);
    }
  });
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
