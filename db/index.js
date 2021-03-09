// require and re-export all files in this db directory (users, activities...)
const client = require ('./client')
const { createUser, getUser, getUserById, getUserByUsername } = require ('./users')
const { getActivityById, getAllActivities, createActivity, updateActivity} = require ('./activities')
const { getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, destroyRoutine} = require('./routines')
const { getRoutineActivityById, addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity, getRoutineActivitiesByRoutine} = require ('./routine_activities')

module.exports = {
    client,
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity,
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByActivity,
    getPublicRoutinesByUser,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivitiesByRoutine
};