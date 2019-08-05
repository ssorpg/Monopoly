exports.seed = function (knex) {
    return knex('tiles').del()
        .then(() => {
            return knex('tiles').insert([
                {
                    id: 1, position: 0, type: 'go', money_lost: 0, property_cost: 0,
                    name: 'GO - Collect $100', description: '', owner: ''
                },
                {
                    id: 2, position: 1, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Wayback', description: '', owner: ''
                },
                {
                    id: 3, position: 2, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Lonely Lane', description: '', owner: ''
                },
                {
                    id: 4, position: 3, type: 'tax', money_lost: 100, property_cost: 0,
                    name: 'Personal Property Tax', description: 'Personal property tax! Lose $100.', owner: ''
                },
                {
                    id: 5, position: 4, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Jaytown', description: '', owner: ''
                },
                {
                    id: 6, position: 5, type: 'property', money_lost: 0, property_cost: 60,
                    name: 'Boomtown', description: '', owner: ''
                },
                {
                    id: 7, position: 6, type: 'toJail', money_lost: 0, property_cost: 0,
                    name: 'Lord Blueblood\'s Estate', description: '', owner: '' // description: Lord Blueblood\'s guards surround you too quickly for you to flee. Go to jail.
                },
                {
                    id: 8, position: 7, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Poverty Place', description: '', owner: ''
                },
                {
                    id: 9, position: 8, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Goat Alley', description: '', owner: ''
                },
                {
                    id: 10, position: 9, type: 'tax', money_lost: 150, property_cost: 0,
                    name: 'Land Taxes', description: 'Land taxes! Lose $150.', owner: ''
                },
                {
                    id: 11, position: 10, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'Hell\'s Half Acre', description: '', owner: ''
                },
                {
                    id: 12, position: 11, type: 'property', money_lost: 0, property_cost: 120,
                    name: 'The Bowery', description: '', owner: ''
                },
                {
                    id: 13, position: 12, type: 'freeParking', money_lost: 0, property_cost: 0,
                    name: 'Free Parking', description: 'Free Parking!', owner: ''
                },
                {
                    id: 14, position: 13, type: 'property', money_lost: 0, property_cost: 240,
                    name: 'Progress Park', description: '', owner: ''
                },
                {
                    id: 15, position: 14, type: 'property', money_lost: 0, property_cost: 240,
                    name: 'George Street', description: '', owner: ''
                },
                {
                    id: 16, position: 15, type: 'tax', money_lost: 200, property_cost: 0,
                    name: 'Improvement Tax', description: 'Improvement Tax! Lose $200.', owner: ''
                },
                {
                    id: 17, position: 16, type: 'property', money_lost: 0, property_cost: 220,
                    name: 'Johnson Road', description: '', owner: ''
                },
                {
                    id: 18, position: 17, type: 'property', money_lost: 0, property_cost: 220,
                    name: 'Fels Avenue', description: '', owner: ''
                },
                {
                    id: 19, position: 18, type: 'jail', money_lost: 0, property_cost: 0,
                    name: 'JAIL', description: 'Just visiting!', owner: ''
                },
                {
                    id: 20, position: 19, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Broadway', description: '', owner: ''
                },
                {
                    id: 21, position: 20, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Fifth Avenue', description: '', owner: ''
                },
                {
                    id: 22, position: 21, type: 'tax', money_lost: 250, property_cost: 0,
                    name: 'Some Sorta Tax', description: 'Some sorta tax! Lose $250.', owner: ''
                },
                {
                    id: 23, position: 22, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Lake Shore Drive', description: '', owner: ''
                },
                {
                    id: 24, position: 23, type: 'property', money_lost: 0, property_cost: 440,
                    name: 'Easy Street', description: '', owner: ''
                }
            ]);
        });
}; 