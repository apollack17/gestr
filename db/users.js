const client = require("./client");

async function createUser({username, password}){
    try {
        const {rows: [users]} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            RETURNING *,
            `, [username, password]);
            delete users.password;
            return users;
    } catch (error) {
        throw error 
    }
}
async function getUser({username, password}){
    try {
        const {rows: user} = await client.query(`
            SELECT * FROM users 
            WHERE username=$1 
            AND password=$2;
        `, [username, password]);
        delete user.password;
        
        return user;
    } catch (error) {
       throw error; 
    }
}
async function getUserById (id){
    try {
        const {rows: user} = await client.query(`
            SELECT * FROM users 
            WHERE id=$1;
        `, [id]);
        delete user.password;
        
        return user;
    } catch (error) {
       throw error; 
    }
}
async function getUserByUsername(username){
    try {
        const {rows: user} = await client.query(`
            SELECT * FROM users 
            WHERE username=$1;
        `, [username]);
        delete user.password;
        
        return user.username;
    } catch (error) {
       throw error; 
    }
}
module.exports = {
    createUser, 
    getUser,
    getUserById,
    getUserByUsername
};