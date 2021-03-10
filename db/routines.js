const client = require("./client");

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id]);

    return routine;
  } catch (error) {
    throw error;
  }
}
async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines;
    `);
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
      ON routine_activities."activityId"=$1;
    `, [id]);
    for (routine of routines) {
      routine.activities = activities
    }
    return routines;
  } catch (error) {
    throw error;
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [creatorId, isPublic, name, goal]);
    return routine;
  } catch (error) {
    throw error; 
  }
}
async function updateRoutine({ id, isPublic, name, goal }) {
  const fields = { isPublic: isPublic, name: name, goal: goal }
  if (isPublic === undefined || isPublic === null) delete fields.isPublic;
  if (name === undefined || name === null) delete fields.name;
  if (goal === undefined || goal === null) delete fields.goal;
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [routines]} = await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));
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