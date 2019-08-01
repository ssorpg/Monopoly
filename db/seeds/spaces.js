exports.seed = function (knex) {
    return knex('spaces').del()
        .then(function () {
            return knex('spaces').insert([
                { id: 1, money_lost: 0, money_gained: 200 },
                { id: 2, money_lost: 60, money_gained: 0 },
                { id: 3, money_lost: 0, money_gained: 150 },
                { id: 4, money_lost: 60, money_gained: 0 },
                { id: 5, money_lost: 200, money_gained: 0 },
                { id: 6, money_lost: 0, money_gained: 100 },
                { id: 7, money_lost: 0, money_gained: 0 },
                { id: 8, money_lost: 140, money_gained: 0 },
                { id: 9, money_lost: 150, money_gained: 0 },
                { id: 10, money_lost: 140, money_gained: 0 },
                { id: 11, money_lost: 160, money_gained: 0 },
                { id: 12, money_lost: 0, money_gained: 100 },
                { id: 13, money_lost: 0, money_gained: 0 },
                { id: 14, money_lost: 220, money_gained: 0 },
                { id: 15, money_lost: 0, money_gained: 100 },
                { id: 16, money_lost: 220, money_gained: 0 },
                { id: 17, money_lost: 240, money_gained: 0 },
                { id: 18, money_lost: 150, money_gained: 0 },
                { id: 19, money_lost: 0, money_gained: 0 },
                { id: 20, money_lost: 300, money_gained: 0 },
                { id: 21, money_lost: 300, money_gained: 0 },
                { id: 22, money_lost: 0, money_gained: 150 },
                { id: 23, money_lost: 0, money_gained: 100 },
                { id: 24, money_lost: 100, money_gained: 0 }
            ]);
        });
};