// require and re-export all files in this db directory (users, activities...)
const { client } = require ('./client')
const { users } = require ('./users')


module.exports(
    client,
    users
)