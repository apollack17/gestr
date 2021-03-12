const client = require("./client");
const bcrypt = require("bcrypt");
const { user } = require("./client");

async function createUser({ username, password }) {
    const hashedPass = bcrypt.hashSync(password, 10);
    try {
        const {rows: [users]} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
            `, [username, hashedPass]);
        console.log(users)
        delete users.password
        return users;
    } catch (error) {
        throw error 
    }
}
async function getUser({ username, password }) {
    try {
        const user = await getUserByUsername(username);
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compareSync(password, hashedPassword);
        if (passwordsMatch) {
            delete user.password;
            return user;
        } else {
            return;
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
        const {rows: [user]} = await client.query(`
            SELECT * FROM users 
            WHERE username=$1;
        `, [username]);
        
        return user;
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