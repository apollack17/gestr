const express = require('express');
const routineActivityRouter = express.Router();
const { requireUser } = require('./utils');
const { updateRoutineActivity, destroyRoutineActivity } = require('../db');

routineActivityRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  try {
    const updatedRoutineActivity = await updateRoutineActivity({ id: routineActivityId, count, duration });
    res.send(updatedRoutineActivity);
  } catch (error) {
    next(error);
  }
})

routineActivityRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  console.log('This is the routine activity Id', routineActivityId);
  try {
    const deletedActivity = await destroyRoutineActivity(routineActivityId);
    res.send(deletedActivity);
  } catch (error) {
    next(error);
  }
})

module.exports = routineActivityRouter;