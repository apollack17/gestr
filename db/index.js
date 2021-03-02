// require and re-export all files in this db directory (users, activities...)
const { client } = require ('./client')
const { createUser, getUser, getUserById, getUserByUsername } = require ('./users')


module.exports = {
    client,
    createUser,
    getUser,
    getUserById,
<<<<<<< HEAD
    getUserByUsername
=======
    getUserByUsername,
    
>>>>>>> 644ab72d40f36f4f8c167a258b08dc1f787d0c3b
}