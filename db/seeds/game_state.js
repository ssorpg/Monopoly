exports.seed = function (knex) {
    return knex('game_state').del()
        .then(() => {
            return knex('game_state').insert([
                { id: 1, current_player_turn: 1, in_progress: false, paused: false }
            ]);
        });
};