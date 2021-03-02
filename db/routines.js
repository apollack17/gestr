const { client } = require("./client");

async function getRoutineById(id) {
  try {
    const { rows: routine } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1
      RETURNING *;
    `, [id]);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines
      RETURNING *;
    `)
    delete routines.activities;
    return routines;
  } catch (error) {
    throw error
  }
}

async function getAllRoutines() {
  try {
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines
      RETURNING *;
    `)
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic"= true;
      RETURNING *;
    `)
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  //This function needs work possibly
  try {
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines
      WHERE username=$1
      RETURING *;
    `, [username])

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  //This function needs more studying
  try {
    
  } catch (error) {
    throw error;
  }
}
module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities
}