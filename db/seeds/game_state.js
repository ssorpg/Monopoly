exports.seed = function (knex) {
    return knex('game_state').del()
        .then(function () {
            return knex('game_state').insert([
                { id: 1, in_progress: false, current_player_turn: 1 }
            ]);
        });
};