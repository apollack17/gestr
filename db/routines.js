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
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1
      RETURING *;
    `, [username])
  } catch (error) {
    throw error;
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }){
  try {
      const {rows: [routines]} = await client.query(`
          INSERT INTO routines( creatorId, isPublic, name, goal)
          VALUES ($1, $2, $3, $4)
          RETURNING *,
          `, [creatorId, isPublic, name, goal]);
          return routines;
  } catch (error) {
      throw error; 
  }
}
async function updateRoutine({ creatorId, isPublic, name, goal }){
  try {
      const {rows: [routines]} = await client.query(`
          UPDATE routines
          SET isPublic=$2, name=$3, goal=$4
          WHERE id=$1,
          `, [id, isPublic, name, goal]);
          return routines;
  } catch (error) {
      throw error; 
  }
}

  async function destroyRoutine({id}){
    try {
      const {rows: [routines]} = await client.query(`
          DELETE routines
          WHERE id=$1,
          `, [id]);
          return routines;
      
    } catch (error) {
      throw error;
    }

}
module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}