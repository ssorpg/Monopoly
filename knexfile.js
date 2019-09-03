// DOTENV FOR KNEX
require('dotenv').config();



// SEQUELIZE CONFIGS
const configs = {
    development: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'asdfasdf',
            database: 'monopoly_db'
        },
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    },
    test: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: 'monopolytest_db'
        },
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    },
    production: {
        client: 'mysql2',
        connection: process.env.CLEARDB_DATABASE_URL,
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    }
};



// EXPORTS
module.exports = process.env.NODE_ENV ? configs[process.env.NODE_ENV] : configs.development;
