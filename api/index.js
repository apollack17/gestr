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
const { Router } = require('express');

apiRouter.get('/health', async (req, res, next) => {
  try{
    console.log('All is well from the console log.')
    res.send({message: 'All is well'})
  }catch(error){
    console.error(error)
  }
  next();
})

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});


// apiRouter.get('/users/me', async (req, res, next) => {
 
// })

// apiRouter.get('/users/:username/routines', async (req, res, next) => {
  
// })



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const activityRouter = require('./activities');
apiRouter.use('/activities', activityRouter);

const routineRouter = require('./routines');
apiRouter.use('/routines', routineRouter);

const routineActivityRouter = require('./routine_activities');
apiRouter.use('/routine_activities', routineActivityRouter);

module.exports = apiRouter;