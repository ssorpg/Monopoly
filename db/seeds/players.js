exports.seed = function (knex) {
    return knex('players').del()
        .then(function () {
            return knex('players').insert([
                { id: 1, player_number: 1, name: 'Player 1', money: 1500, position: 18 },
                { id: 2, player_number: 2, name: 'Player 2', money: 1500, position: 18 },
                { id: 3, player_number: 3, name: 'Player 3', money: 1500, position: 18 },
                { id: 4, player_number: 4, name: 'Player 4', money: 1500, position: 18 },
            ]);
        });
};