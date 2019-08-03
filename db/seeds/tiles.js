exports.seed = function (knex) {
    return knex('tiles').del()
        .then(() => {
            return knex('tiles').insert([
                {
                    id: 1, position: 0, type: 'go', money_lost: 0, property_cost: 0,
                    name: 'Go', description: ''
                },
                {
                    id: 2, position: 1, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Wayback', description: ''
                },
                {
                    id: 3, position: 2, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Lonely Lane', description: ''
                },
                {
                    id: 4, position: 3, type: 'tax', money_lost: 100, property_cost: 0,
                    name: 'Go', description: 'Personal property tax! Lose $100.'
                },
                {
                    id: 5, position: 4, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Personal Property Tax', description: ''
                },
                {
                    id: 6, position: 5, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Boomtown', description: ''
                },
                {
                    id: 7, position: 6, type: 'toJail', money_lost: 0, property_cost: 0,
                    name: 'Lord Blueblood\'s Estate', description: 'Lord Blueblood\'s guards surround you too quickly for you to flee. Go to jail.'
                },
                {
                    id: 8, position: 7, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Poverty Place', description: ''
                },
                {
                    id: 9, position: 8, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Goat Alley', description: ''
                },
                {
                    id: 10, position: 9, type: 'tax', money_lost: 150, property_cost: 0,
                    name: 'Land Taxes', description: 'Land taxes! Lose $150.'
                },
                {
                    id: 11, position: 10, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Hell\'s Half Acre', description: ''
                },
                {
                    id: 12, position: 11, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'The Bowery', description: ''
                },
                {
                    id: 13, position: 12, type: 'freeParking', money_lost: 0, property_cost: 0,
                    name: 'Free Parking', description: 'Free Parking!'
                },
                {
                    id: 14, position: 13, type: 'property', money_lost: 0, property_cost: 240,
                    name: 'Progress Park', description: ''
                },
                {
                    id: 15, position: 14, type: 'property', money_lost: 0, property_cost: 240,
                    name: 'George Street', description: ''
                },
                {
                    id: 16, position: 15, type: 'tax', money_lost: 200, property_cost: 0,
                    name: 'Improvement Tax', description: 'Improvement Tax! Lose $200.'
                },
                {
                    id: 17, position: 16, type: 'property', money_lost: 0, property_cost: 220,
                    name: 'Johnson Road', description: ''
                },
                {
                    id: 18, position: 17, type: 'property', money_lost: 0, property_cost: 220,
                    name: 'Fels Avenue', description: ''
                },
                {
                    id: 19, position: 18, type: 'jail', money_lost: 0, property_cost: 0,
                    name: 'Jail', description: 'Just visiting!'
                },
                {
                    id: 20, position: 19, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Broadway', description: ''
                },
                {
                    id: 21, position: 20, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Fifth Avenue', description: ''
                },
                {
                    id: 22, position: 21, type: 'tax', money_lost: 250, property_cost: 0,
                    name: 'Some Sorta Tax', description: 'Some sotra tax! Lose $250.'
                },
                {
                    id: 23, position: 22, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Lake Shore Drive', description: ''
                },
                {
                    id: 24, position: 23, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Easy Street', description: ''
                }
            ]);
        });
}; 