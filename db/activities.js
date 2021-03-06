const  client  = require("./client");

async function getActivityById(id){
    try {
        const {rows: activity} = await client.query(`
            SELECT * FROM activities 
            WHERE id = $1
            RETURNING *;
        `, [id]);
        return activity;
    } catch (error) {
        throw error
    }
};
async function getAllActivities(){
    try {
        const {rows: [activities]} = await client.query(`
            SELECT * FROM activities
            RETURNING *;
        `)
        return activities;
    } catch (error) {
        throw error
    }
}

async function createActivity({name, description}) {
    try {
        const { rows: [activity] } = await client.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            RETURNING *;
       `, [name, description])
        return activity;
    } catch (error) {
        throw error;
    }
}

async function updateActivity({ id, name, description }) {
    try {
        const { rows: [activity] } = await client.query(`
            UPDATE activities
            WHERE id=$1
            SET name=$2, description=$3
            RETURNING *;
        `, [id, name, description])

        return activity;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getActivityById,
    getAllActivities,
    createActivity,
    updateActivity
}