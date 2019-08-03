exports.seed = function (knex) {
    return knex('tiles').del()
        .then(() => {
            return knex('tiles').insert([
                {
                    id: 1, position: 0, type: 'go', money_lost: 0, money_gained: 0, property_cost: 0,
                    description: ''
                },
                {
                    id: 2, position: 1, type: 'property', money_lost: 0, money_gained: 0, property_cost: 60,
                    description: 'Purchase Wayback for $60?'
                },
                {
                    id: 3, position: 2, type: 'property', money_lost: 0, money_gained: 0, property_cost: 60,
                    description: 'Purchase Lonely Lane for $60?'
                },
                {
                    id: 4, position: 3, type: 'tax', money_lost: 100, money_gained: 0, property_cost: 0,
                    description: 'Personal property tax! Lose $100.'
                },
                {
                    id: 5, position: 4, type: 'property', money_lost: 0, money_gained: 0, property_cost: 60,
                    description: 'Purchase Jaytown for $60?'
                },
                {
                    id: 6, position: 5, type: 'property', money_lost: 0, money_gained: 0, property_cost: 60,
                    description: 'Purchase Boomtown for $60?'
                },
                {
                    id: 7, position: 6, type: 'toJail', money_lost: 0, money_gained: 0, property_cost: 0,
                    description: 'Lord Blueblood\'s guards surround you too quickly for you to flee. Go to jail.'
                },
                {
                    id: 8, position: 7, type: 'property', money_lost: 0, money_gained: 0, property_cost: 120,
                    description: 'Purchase Poverty Place for $120?'
                },
                {
                    id: 9, position: 8, type: 'property', money_lost: 0, money_gained: 0, property_cost: 120,
                    description: 'Purchase Goat Alley for $120?'
                },
                {
                    id: 10, position: 9, type: 'tax', money_lost: 150, money_gained: 0, property_cost: 0,
                    description: 'Land taxes! Lose $150.'
                },
                {
                    id: 11, position: 10, type: 'property', money_lost: 0, money_gained: 0, property_cost: 120,
                    description: 'Purchase Hell\'s Half Acre for $120?'
                },
                {
                    id: 12, position: 11, type: 'property', money_lost: 0, money_gained: 0, property_cost: 120,
                    description: 'Purchase The Bowery for $120?'
                },
                {
                    id: 13, position: 12, type: 'freeParking', money_lost: 0, money_gained: 0, property_cost: 0,
                    description: 'Free Parking!'
                },
                {
                    id: 14, position: 13, type: 'property', money_lost: 0, money_gained: 0, property_cost: 240,
                    description: 'Purchase Progress Park for $240?'
                },
                {
                    id: 15, position: 14, type: 'property', money_lost: 0, money_gained: 0, property_cost: 240,
                    description: 'Purchase George Street for $240?'
                },
                {
                    id: 16, position: 15, type: 'tax', money_lost: 200, money_gained: 0, property_cost: 0,
                    description: 'Improvement Tax! Lose $200.'
                },
                {
                    id: 17, position: 16, type: 'property', money_lost: 0, money_gained: 0, property_cost: 220,
                    description: 'Purchase Johnson Road for $220?'
                },
                {
                    id: 18, position: 17, type: 'property', money_lost: 0, money_gained: 0, property_cost: 220,
                    description: 'Purchase Fels Avenue for $220?'
                },
                {
                    id: 19, position: 18, type: 'jail', money_lost: 0, money_gained: 0, property_cost: 0,
                    description: 'Just visiting!'
                },
                {
                    id: 20, position: 19, type: 'property', money_lost: 0, money_gained: 0, property_cost: 440,
                    description: 'Purchase Broadway for $440?'
                },
                {
                    id: 21, position: 20, type: 'property', money_lost: 0, money_gained: 0, property_cost: 440,
                    description: 'Purchase Fifth Avenue for $440?'
                },
                {
                    id: 22, position: 21, type: 'tax', money_lost: 250, money_gained: 0, property_cost: 0,
                    description: 'Some sotra tax! Lose $250.'
                },
                {
                    id: 23, position: 22, type: 'property', money_lost: 0, money_gained: 0, property_cost: 440,
                    description: 'Purchase Lake Shore Drive for $440?'
                },
                {
                    id: 24, position: 23, type: 'property', money_lost: 0, money_gained: 0, property_cost: 440,
                    description: 'Purchase Easy Street for $440?'
                }
            ]);
        });
}; 