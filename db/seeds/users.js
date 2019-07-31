exports.seed = function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert([
                { id: 1, money: 1500, user_name: 'Player 1', game_id: 1, position: 18 },
                { id: 2, money: 1500, user_name: 'Player 2', game_id: 1, position: 18 },
                { id: 3, money: 1500, user_name: 'Player 3', game_id: 1, position: 18 },
                { id: 4, money: 1500, user_name: 'Player 4', game_id: 1, position: 18 }
            ]);
        });
};