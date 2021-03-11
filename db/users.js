const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
    // const hashedPass = bcrypt.hashSync(password, 10);
    try {
        const {rows: [users]} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING id, username;
            `, [username, password]);
        console.log(users)
        return users;
    } catch (error) {
        throw error 
    }
}
async function getUser({ username, password }) {
    try {
        const { rows: [user]} = await client.query(`
            SELECT * FROM users 
            WHERE username=$1;
        `, [username]);
        if (user.password === password) {
            delete user.password;
            return user;
        }
    } catch (error) {
       throw error; 
    }
}
async function getUserById (id){
    try {
        const {rows: [user]} = await client.query(`
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