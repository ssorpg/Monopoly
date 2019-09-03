const makeGame = require('./game').makeGame;
const makePlayer = require('./player').makePlayer;

let game = makeGame(1,null);

let player = makePlayer({name: 'foo'});

// console.log(player)
// player.speak()


game.queue.enqueueEvent({event: 'addPlayer', data: player});
game.queue.enqueueEvent({event: 'addPlayer', data: makePlayer({name: 'bar'})});
game.queue.enqueueEvent({event: 'addPlayer', data: makePlayer({name: 'baz'})});

setTimeout(() => {
  if(true) {
    game.queue.enqueueEvent({event: 'addPlayer', data: makePlayer({name: 'wtf'})});
  } else {
    game.queue.enqueueEvent({event: 'startGame', data: {}});

  }
},1000)

async function test() {
  while(true) {
    let item = await game.queue.waitEvent();

    game.stateTransition(item.event, item.data);
  }
}

test();
