// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const { getUserById } = require('../db');

apiRouter.get('/health', async (req, res, next) => {
  try {
    console.log('All is well from the console log.')
    res.send({message: 'All is well'})
  } catch(error){
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

const usersRouter = require('./users');
const activityRouter = require('./activities');
const routineRouter = require('./routines');
const routineActivityRouter = require('./routine_activities');

apiRouter.use('/users', usersRouter);
apiRouter.use('/activities', activityRouter);
apiRouter.use('/routines', routineRouter);
apiRouter.use('/routine_activities', routineActivityRouter);
apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;