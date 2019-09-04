module.exports = stateTable = {
  'waitPlayers': {
    'addPlayer': 'waitPlayers', // stays here until nplayers === 2
    'delPlayer': 'delPlayer'
  },
  'waitStart': {
    'addPlayer': 'addPlayer', // stays here until start or nplayers ===  4
    'startGame': 'startGame',
    'delPlayer': 'delPlayer',
    'nextPlayer': 'nextPlayer'
  },
  "startGame": {
    "nextPlayer": 'nextPlayer', // enqueue 'nextPlayer'
    'delPlayer': 'delPlayer'
  },
  "nextPlayer": {
    'delPlayer': 'delPlayer'
  },
  "waitRoll": {
    'rollDice': 'rollDice'
  },
  "waitPurchase": {
    "purchaseProperty": 'purchase',
    "passProperty": 'pass'
  }
}
