// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername } = require('../db');
const { getAllActivities } = require('../db/activities');

apiRouter.get('/health', async (req, res, next) => {
  try{
    console.log('All is well from the console log.')
    res.send({message: 'All is well'})
  }catch(error){
    console.error(error)
  }
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
    // const hashedPassword = bcrypt.hashSync(password, 10)
    const createdUser = await createUser({username, password});
    console.log(createdUser)
    res.send(createdUser);
  } catch ({ name, message }) {
    next({ name, message })
  } 
});
-

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

// apiRouter.get('/users/me', async (req, res, next) => {
 
// })

// apiRouter.get('/users/:username/routines', async (req, res, next) => {
  
// })

apiRouter.get('/activities', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error)
  }
})

apiRouter.post('/activities', async (req, res, next) => {
  const {name, description} = req.body;
  try {
    const newActivity = await createActivity(name, description);
  } catch (error) {
    console.error(error)
  } next(newActivity) 
});

apiRouter.patch('/activities', async (req, res, next) => {
  const {id, name, description} = req.body;
  try {
    const patchedActivity = await updateActivity(id, name, description);
  } catch (error) {
    console.error(error)
  } next(patchedActivity) 
});

module.exports = apiRouter;