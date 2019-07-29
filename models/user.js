// SEQUELIZE REQUIRE
const knex = require('../config/connection.js');



// USERS TABLE
// knex.schema.createTable('users', table => {
//     table.increments('id');
//     table.string('username');
//     table.integer('money');
// })
//     .catch(err => {
//         throw err;
//     })
//     .finally(() => {
//         knex.destroy();
//     });

// const users = [
//     { username: 'Jon', money: 10000 },
//     { username: 'Jeremy', money: 10000 },
//     { username: 'Mengyuan', money: 10000 }
// ];

// knex('users').insert(users)
//     .catch(err => {
//         throw err;
//     })
//     .finally(() => {
//         knex.destroy();
//     });



// EXPORTS
module.exports = knex;