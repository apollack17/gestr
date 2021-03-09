const client = require("./client");

async function getRoutineById(id) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id]);

    return rows;
  } catch (error) {
    throw error;
  }
}
async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines;
    `);
    console.log(rows);
    return rows;
  } catch (error) {
    throw error
  }
}
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId"=users.id
    `);
    const { rows: activities } = await client.query(`
      SELECT routine_activities.*, routines.*
      FROM routine_activities
      JOIN routines
      ON routine_activities."activityId"=routines."creatorId"
    `);
    for (routine of routines) {
      routine.activities = activities
    }
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.* , users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic"= true;
    `);
    const { rows: activities } = await client.query(`
      SELECT routine_activities.*, routines.*
      FROM routine_activities
      JOIN routines
      ON routine_activities."activityId"=routines."creatorId";
    `);
    for (routine of routines) {
      routine.activities = activities
    }
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username=$1;
    `, [username]);
    const { rows: activities } = await client.query(`
      SELECT routine_activities.*, routines.*
      FROM routine_activities
      JOIN routines
      ON routine_activities."activityId"=routines."creatorId";
    `);
    for (routine of routines) {
      routine.activities = activities
    }
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE username=$1 AND "isPublic"=true;
    `, [username])
    const { rows: activities } = await client.query(`
      SELECT routine_activities.*, routines.*
      FROM routine_activities
      JOIN routines
      ON routine_activities."activityId"=routines."creatorId";
    `);
    for (routine of routines) {
      routine.activities = activities
    }
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutinesByActivity({ id }) {
  //This function needs more studying
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic"=true;
    `)
    const { rows: activities } = await client.query(`
      SELECT routine_activities.*, routines.*
      FROM routine_activities
      JOIN routines
      ON routine_activities."activityId"=routines."creatorId"
      WHERE "activityId"=$1;
    `, [id]);
    for (routine of routines) {
      routine.activities = activities
    }
    console.log("Where's my activities", activities);
    console.log("Here is the routines", routines);
    return routines;
  } catch (error) {
    throw error;
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }){
  try {
    const { rows } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4);
      `, [creatorId, isPublic, name, goal]);
    return rows;
  } catch (error) {
    throw error; 
  }
}
function dbFields(fields){
  const insert = Object.keys(fields).map((key, index) => `"${ key }"=$${ index + 1 }`).join(', ');
  const select = Object.keys(fields).map((_, index) => `$${index + 1}`).join(', ');
}
async function updateRoutine({ update }){
  try {
    dbFields({update});
    const {rows: routines} = await client.query(`
      UPDATE routines
      SET (${Object.keys(update).map((key, idx)=>`"${ key }"=$${ idx + 1 }`).join(', ') })
      WHERE id=$1
      RETURNING *;
      `, Object.keys(update));
    return routines;
  } catch (error) {
      throw error; 
  }
}

async function destroyRoutine(id) {
  try {
    const {rows: routine} = await client.query(`
      DELETE FROM routines
      WHERE id=$1
      RETURNING *;
      `, [id]);
    await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId"=$1
      RETURNING *;
    `, [id]);
    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}