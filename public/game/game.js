// ROUTER OBJECT
const callbacks = {
    setPlayers: setPlayers,
    setPlayer: setPlayer,
    deletePlayer: deletePlayer,
    setRoll: setRoll
};



// ROUTER FUNCTIONS
function setPlayers(players) {
    players.forEach(player => {
        setPlayer(player)
    });
}

function setPlayer(player) {
    setPlayerInfo(player);
    setPlayerPosition(player);
}

function deletePlayer(player) {
    $('.player' + player.player_number + 'Info').empty();
    $('.player' + + player.player_number + 'Pos').remove();
}

function setRoll(player) {
    const roll = player.rval;

    const imgNames = ['1oneDice.png', '2twoDice.png', '3threeDice.png', '4fourDice.png', '5fiveDice.png', '6sixDice.png'];
    const imgPath = '../images/';

    $('.diceImages').empty();

    const newImg = $('<img>').attr('src', imgPath + imgNames[roll.die1 - 1]);
    const newImg2 = $('<img>').attr('src', imgPath + imgNames[roll.die2 - 1]);

    $('.diceImages').append(newImg, newImg2);

    setPlayer(player);
}



// HELPER FUNCTIONS
function setPlayerInfo(player) {
    let playerInfo = $('.player' + player.player_number + 'Info');

    playerInfo.empty();

    playerInfo
        .append('<h3>Player ' + player.player_number + '</h3>')
        .append('<h4>Name: ' + player.name + '</h4>')
        .append('<h4>Money: ' + player.money + '</h3>');

    $('#players').append(playerInfo);
}

function setPlayerPosition(player) {
    $('.player' + + player.player_number + 'Pos').remove();

    const playerPos = $('<div>')
        .addClass('player' + player.player_number + 'Pos');

    $('#cell' + player.position).append(playerPos);
}



// EVENT LISTENERS
function setUpEventListeners(ws) {
    $('.rollDice').on('click', async () => {
        ws.send('rollDice');
    });
}



// ON LOAD
$(document).ready(() => {
    const ws = new WebSocket('ws://localhost:8080/');

    console.log(ws);

    ws.onmessage = (message) => {
        console.log(message);

        const data = JSON.parse(message.data);

        callbacks[data.function](data.payload);
    }

    setUpEventListeners(ws);
});



// $('.logOut').on('click', () => {
//     sessionStorage.setItem('monopolyUsername', user_name);
//     localStorage.removeItem('monopolyUsername');
//     location.reload();
// });