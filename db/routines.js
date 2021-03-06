const client = require("./client");

async function getRoutineById(id) {
  try {
    const { rows: routine } = await client.query(`
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
    console.log(rows);
    return rows;
  } catch (error) {
    throw error
  }
}
async function getAllRoutines() {
  try {
    const { rows: [routines] } = await client.query(`
      SELECT * FROM routines;
    `)
    return routines;
  } catch (error) {
    throw error;
  }
}
async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic"= true;
    `)
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getAllRoutinesByUser({ username }) {
  //This function needs work possibly
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines
      WHERE username=$1;
    `, [username])
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutinesByActivity({ id }) {
  //This function needs more studying
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines
      WHERE id=$1;
    `, [id])
    return rows;
  } catch (error) {
    throw error;
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }){
  try {
    const {rows: [activity]} = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [creatorId, isPublic, name, goal]);
    return activity;
  } catch (error) {
    throw error; 
  }
}
async function updateRoutine({ creatorId, isPublic, name, goal }){
  try {
    const {rows: [routines]} = await client.query(`
      UPDATE routines
      SET "isPublic"=$2, name=$3, goal=$4
      WHERE "creatorId"=$1
      RETURNING *;
      `, [creatorId, isPublic, name, goal]);
    return routines;
  } catch (error) {
      throw error; 
  }
}

async function destroyRoutine({id}){
  try {
    const {rows: [routines]} = await client.query(`
      DELETE routines
      WHERE id=$1;
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