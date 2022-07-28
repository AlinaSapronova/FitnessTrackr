const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");

const {
     getPublicRoutinesByActivity,
  } = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next)=>{
    try{

    }catch(error){
        next(error)
    }
})
// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
