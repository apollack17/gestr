const express = require('express');
const activityRouter = express.Router();
const { getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');
const { requireUser } = require('./utils');

activityRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error)
  }
})

activityRouter.post('/', requireUser, async (req, res, next) => {
  const {name, description} = req.body;
  try {
    const newActivity = await createActivity({name, description});
    res.send(newActivity)
  } catch (error) {
    next(error)
  } 
});

activityRouter.patch('/:activityId', requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  try {
    const patchedActivity = await updateActivity({id: activityId, name, description});
    res.send(patchedActivity)
  } catch (error) {
    next(error)
  }
});

activityRouter.get('/:activityId/routines', async (req, res, next) => {
  const { activityId } = req.params;
  const id = activityId;

  try {
    const routine = await getPublicRoutinesByActivity({ id });
    res.send(routine);
  } catch (error) {
    
  }
})

module.exports = activityRouter;