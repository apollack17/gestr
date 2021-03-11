const express = require('express');
const activityRouter = express.Router();

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
  } catch (error) {
    console.error(error)
  } next(newActivity) 
});

activityRouter.patch('/', async (req, res, next) => {
  const {id, name, description} = req.body;
  try {
    const patchedActivity = await updateActivity(id, name, description);
  } catch (error) {
    console.error(error)
  } next(patchedActivity) 
});

module.exports = activityRouter;