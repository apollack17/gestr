const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, destroyRoutine, updateRoutine, addActivityToRoutine, getRoutineActivitiesByRoutine } = require('../db');
const routineRouter = express.Router();
const { requireUser } = require('./utils');

routineRouter.get('/', async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines)
  } catch (error) {
    next(error);
  }

})

routineRouter.post('/', requireUser, async (req, res, next) => {
  const { id } = req.user;
  const { isPublic, name, goal } = req.body
  console.log('This is the req.user test:', req.user);
  try {
    const createdRoutine = await createRoutine({ creatorId: id, isPublic, name, goal });
    res.send(createdRoutine);
  } catch (error) {
    next(error);
  }
})

routineRouter.patch('/:routineId', requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;
  try {
    const updatedRoutine = await updateRoutine({ id: routineId, isPublic, name, goal });
    res.send(updatedRoutine)
  } catch (error) {
    next(error)
  }
})

routineRouter.delete('/:routineId', requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    const deletedRoutine = await destroyRoutine(routineId)
    res.send(deletedRoutine)
  } catch (error) {
    next(error)
  }
})

routineRouter.post('/:routineId/activities', async (req, res, next) => {

  try {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const routine = await getRoutineActivitiesByRoutine({ id: routineId})
    const matchedRoutineActivity = routine.filter(routine => {
      return routine.activityId === activityId;
    })
    console.log('this is the matched routine activity', matchedRoutineActivity);
    if (matchedRoutineActivity.length) {
      res.status(401);
      next({
        name: 'ActivityExistError',
        message: 'This activity already exists'
    })
    } else {
      const addedRoutineActivity = await addActivityToRoutine({ routineId: id, activityId, count, duration });
      res.send(addedRoutineActivity);
    }
  } catch ({name, message}) {
    next({name, message});
  }

})

module.exports = routineRouter;