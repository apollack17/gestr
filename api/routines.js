const express = require('express');
const { getAllPublicRoutines, createRoutine, getRoutineById, destroyRoutine, updateRoutine, addActivityToRoutine } = require('../db');
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
  const creatorId = id;
  try {
    const createdRoutine = await createRoutine({ creatorId, isPublic, name, goal });
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
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    const addedRoutineActivity = await addActivityToRoutine({ routineId: routineId, activityId: activityId, count, duration });
    res.send(addedRoutineActivity)
  } catch (error) {
    next(error);
  }

})

module.exports = routineRouter;