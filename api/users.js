const express = require('express');
const usersRouter = express.Router();
const { getUserByUsername, createUser, getPublicRoutinesByUser } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { requireUser } = require('./utils');

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const testUser = await getUserByUsername(username);
    if (testUser) {
      res.status(401)
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    } else if (password.length < 8) {
      res.status(401)
      next({
        name: 'PasswordError',
        message: 'Password must be at least 8 characters in length'
      })
    } else {
      const createdUser = await createUser({ username, password });
      console.log("This is the created user:", createdUser);
      const token = jwt.sign({
        id: createdUser.id,
        username: createdUser.username
      },
        JWT_SECRET
      );
      res.send({
        message: "Thank you for signing up",
        token: token,
        user: createdUser
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  } 
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "Missing Credentials Error",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (user) {
      const token = jwt.sign({
        id: user.id,
        username: user.username
      },
        JWT_SECRET
      );
      res.send({ message: "you're logged in!", 'token': token });
    } else {
      next({ 
        name: 'Incorrect Credentials Error', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.error(error);
    next(error);
  }
});

usersRouter.get('/me', requireUser, async (req, res, next) => {
  const authHeader = req.headers.authorization
  try{
      if(authHeader){
      res.send(req.user)
      } else {
          res.status(401)
          next({
              name: 'Invalid Token',
              message: 'Unauthorized user'
          })
      }
  } catch ({name, message}){
      next({name, message})
  }
});
usersRouter.get('/:username/routines', async (req, res, next) => {
  const { username } = req.params;
  try {
    const allRoutines = await getPublicRoutinesByUser({username});
    res.send(allRoutines)
  } catch (error) {
    next(error)
  }

})

module.exports = usersRouter;