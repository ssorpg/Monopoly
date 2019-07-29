// SEQUELIZE CONFIGS
const configs = {
    development: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: 'monopoly_db'
        },
        seeds: {
            directory: './seeds'
        }
    },
    test: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: 'monopolytest_db'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL
    }
};



// EXPORTS
module.exports = configs[process.env.NODE_ENV]
    ? configs[process.env.NODE_ENV]
    : configs.development;
