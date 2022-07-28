const express = require('express');
const { getAllRoutines, createRoutine } = require('../db');
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

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
