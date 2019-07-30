exports.seed = function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                { id: 1, user_name: 'Jon' },
                { id: 2, user_name: 'Jeremy' },
                { id: 3, user_name: 'Mengyuan' }
            ]);
        });
};