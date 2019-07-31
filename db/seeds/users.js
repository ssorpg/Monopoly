exports.seed = function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                { id: 1, money: 10000, user_name: 'Jon', game_id: 1, position: 18 },
                { id: 2, money: 10000, user_name: 'Jeremy', game_id: 1, position: 18 },
                { id: 3, money: 10000, user_name: 'Mengyuan', game_id: 1, position: 18 }
            ]);
        });
};