const { client } = require("./client");
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

