// require and re-export all files in this db directory (users, activities...)
const { client } = require ('./client')
const { createUser, getUser, getUserById, getUserByUsername } = require ('./users')
const { getActivityById, getAllActivities, createActivity, updateActivity} = require ('./activities')
const { getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, destroyRoutine} = require('./routines')
const { getRoutineActivityById, addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity} = require ('./routine_activities')

module.exports = {
    client,
    createUser,
    getUser,
    getUserById,
<<<<<<< HEAD
    getUserByUsername
=======
    getUserByUsername,
    getActivityById, getAllActivities, createActivity, updateActivity,
    getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, destroyRoutine,
    getRoutineActivityById, addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity

    
>>>>>>> 644ab72d40f36f4f8c167a258b08dc1f787d0c3b
}