// require and re-export all files in this db directory (users, activities...)
const { client } = require ('./client')
const { createUser, getUser, getUserById, getUserByUsername } = require ('./users')


module.exports = {
    client,
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}