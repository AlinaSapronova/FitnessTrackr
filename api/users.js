/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");

const jwt = require("jsonwebtoken");


const {
    getUserByUsername, createUser, getUser, getPublicRoutinesByUser, getAllRoutinesByUser
  } = require("../db");

// POST /api/users/register

router.post("/register", async (req, res, next) => {
    const {username, password}  = req.body;
    try{
        const _user = await getUserByUsername(username)
        if (_user) {
            next({
              name: "UserExistsError",
              message: `User ${username} is already taken.`,
            });
        }
        if(password.length < 8){
            next({message: "Password Too Short!", name: `Password needs adjustment`})
        }
        const user = await createUser({username, password});
        const token = jwt.sign({id: user.id, username}, process.env.JWT_SECRET)
        res.send({message: "Thank you for signing up!", token, user})
    }catch({name,message}){
        next({name, message})
    }
});


// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
if (!username || !password) {
  next({
    name: "MissingCredentialsError",
    message: "Please supply both a username and password",
  });
}
try {
  const user = await getUser({username,password});
   if(!user){
    next({
      name: "IncorrectCredentialsError",
      message: "Username or password is incorrect",
    });
  }else {
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET);
    res.send({ message: "you're logged in!", token, user });
  }
} catch (error) {
  console.log(error);
  next(error);
}
});
// GET /api/users/me
router.get("/me", requireUser,  async (req, res, next) => {
try{
  res.send(req.user);
}catch(error){
  next(error)
}
})
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {

  // try{
  //   const user = await getUserByUsername(req.params.username);
  //   const userRoutines = await getPublicRoutinesByUser(user)
  //     if (!user){
  //     next({
  //       name: "NO USER FOUND",
  //       message: "USER IS NOT FOUND!"
  //     });}
  //   res.send(userRoutines)
  //   {
  //   const user = await getUserByUsername(req.params.username);
  //   const routines = await getAllRoutinesByUser(user.username);
  //     res.send(routines)
  //   }
    
  try{
    // const {username} = req.params;
    // const user = await getUserByUsername(username);
    // if (!user){
    //   next({
    //     name: "NO USER FOUND",
    //     message: "USER IS NOT FOUND!"
    //   });
    // }
    // if(req.user && user.id == req.user.id ){
    //   const routines = await getAllRoutinesByUser({username: username});
    //   res.send(routines)
    // }
    // const routines = await getPublicRoutinesByUser({username: username});
    // res.send(routines)
  } catch(error){
    next(error)
  }

})

module.exports = router;
