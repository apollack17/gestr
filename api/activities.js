const express = require('express');
const activityRouter = express.Router();
const { getAllActivities, createActivity, updateActivity } = require('../db');

activityRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error)
  }
})

activityRouter.post('/', async (req, res, next) => {
  const {name, description} = req.body;
  try {
    const newActivity = await createActivity(name, description);
    res.send(newActivity)
  } catch (error) {
    next(error)
  } 
});

activityRouter.patch('/', async (req, res, next) => {
  const {id, name, description} = req.body;
  try {
    const patchedActivity = await updateActivity(id, name, description);
    res.send(patchedActivity)
  } catch (error) {
    next(error)
  }
});

module.exports = activityRouter;