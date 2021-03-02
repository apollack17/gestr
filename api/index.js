// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;

const express = require('express');
const apiRouter = express.Router();

const { createUser, getUserByUsername } = require('../db');

apiRouter.get('/health', async (req, res, next) => {
  console.log('All is well from the console log.')
  res.send({
    message: 'All is well'
  })
  next();
})

apiRouter.post('/users/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const testUser = await getUserByUsername(username);

    if (testUser) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    if (password.length < 8) {
      throw Error('Password is too short, it must be at least 8 characters long.');
    }

    await createUser({username, password});

    res.send({ 
      message: "thank you for signing up",
    });
  } catch ({ name, message }) {
    next({ name, message })
  } 
});


apiRouter.post('/users/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "Missing Credentials Error",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign(
        {
          id: user.id, 
          username
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

apiRouter.get('/users/me', async (req, res, next) => {
 
})