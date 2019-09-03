const tileModel = require('../models/tile');

module.exports.makeBoard = async function() {
  let board = Object.create(props);

  board.tiles = await get();

  return board;
}

const props = {
  tiles: undefined
}

async function tile(id) {
  return await tileModel.getTile(id);
}

async function get() {
    return this.tiles = await tileModel.getTiles();
}
