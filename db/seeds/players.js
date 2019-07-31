exports.seed = function (knex) {
    return knex('players').del()
        .then(function () {
            return knex('players').insert([
                { id: 1, money: 1500, name: 'Player 1', position: 18 },
                { id: 2, money: 1500, name: 'Player 2', position: 18 },
                { id: 3, money: 1500, name: 'Player 3', position: 18 },
                { id: 4, money: 1500, name: 'Player 4', position: 18 }
            ]);
        });
};