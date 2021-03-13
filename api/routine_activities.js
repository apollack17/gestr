const express = require('express');
const routineActivityRouter = express.Router();
const { requireUser } = require('./utils');
const { updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById, getRoutineById } = require('../db');

routineActivityRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  try {
    const routineActivity = await getRoutineActivityById({ id: routineActivityId })
    const routine = await getRoutineById(routineActivity.routineId)
    if (req.user.id === routine.creatorId) {
      const updatedRoutineActivity = await updateRoutineActivity({ id: routineActivityId, count, duration });
      res.send(updatedRoutineActivity);
    } else {
      res.status(401);
      next({
        name: 'RoutineActivtyOwnerError',
        message: 'You are not the owner of this routine activity'
      })
    } 
  } catch ({name, message}) {
    next({name, message});
  }
})

routineActivityRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  try {
    const routineActivity = await getRoutineActivityById({ id: routineActivityId })
    const routine = await getRoutineById(routineActivity.routineId)
    if (req.user.id === routine.creatorId) {
      const deletedActivity = await destroyRoutineActivity(routineActivityId);
      res.send(deletedActivity);
    } else {
      res.status(401);
      next({
        name: 'RoutineActivtyOwnerError',
        message: 'You are not the owner of this routine activity'
      })
    } 
  } catch ({name, message}) {
    next({name, message});
  }
})

module.exports = routineActivityRouter;