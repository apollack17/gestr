const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser, getPublicRoutinesByUser } = require('../db');
const jwt = require('jsonwebtoken');

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const testUser = await getUserByUsername(username);
    if (testUser) {
      res.status(401)
      return next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    if (password.length > 7) {
      const createdUser = await createUser({ username, password });
      const token = jwt.sign({
        id: createdUser.id,
        username: createdUser.username
      },
        process.env.JWT_SECRET
      );
      res.send({
        message: "Thank you for signing up",
        token: token,
        user: createdUser
      })
    } else {
      res.status(401)
      return next({
        name: 'PasswordError',
        message: 'Password must be at least 8 characters in length'
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  } 
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next({
      name: "Missing Credentials Error",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password === password) {
      const token = jwt.sign({
        id: user.id,
        username: user.username
      },
        process.env.JWT_SECRET
      );
      res.send({ message: "you're logged in!", 'token': token });
    } else {
      next({ 
        name: 'Incorrect Credentials Error', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

// usersRouter.get('/me', async (req, res, next) => {
 
// })

usersRouter.get('/:username/routines', async (req, res, next) => {
  const { username } = req.body;
  try {
    const allRoutines = await getPublicRoutinesByUser(username);

    const routines = allRoutines.filter(routine => {
      return routine;
    })
    console.log(allRoutines)
    console.log(routines)
    res.send(allRoutines)
  } catch (error) {
    next(error)
  }

})

module.exports = usersRouter;