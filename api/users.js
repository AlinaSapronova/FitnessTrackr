/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const {
    getUserByUsername, getUser, createUser
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
router.post("/login", async (req, res, next) => {const { username, password } = req.body;


if (!username || !password) {
  next({
    name: "MissingCredentialsError",
    message: "Please supply both a username and password",
  });
}
try {
  const user = await getUserByUsername(username);

  if (user && user.password == password) {

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );
    res.send({ message: "you're logged in!", token });
  } else {
    next({
      name: "IncorrectCredentialsError",
      message: "Username or password is incorrect",
    });
  }
} catch (error) {
  console.log(error);
  next(error);
}
});
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
