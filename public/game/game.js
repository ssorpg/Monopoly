// REQUESTS
async function getPlayers(ws) {
    const players = await ws.send('getUsers');

    $('.cell').empty();
    $('#players').empty();

    let playerNum = 1;
    players.forEach(player => {
        player.playerNum = playerNum;

        setPlayerInfo(player);
        setPlayerPosition(player);

        playerNum++;
    });
}



// FUNCTIONS
function setPlayerInfo(player) {
    let playerP = $('<p>')
        .append('<h3>Player ' + player.playerNum + '</h3>')
        .append('<h4>Name: ' + player.user_name + '</h4>')
        .append('<h4>Money: ' + player.money + '</h3>');

    $('#players').append(playerP);
}

function setPlayerPosition(player) {
    let playerDiv = $('<div>')
        .addClass('player' + player.playerNum);

    $('#cell' + player.position).append(playerDiv);
}

function setRoll(roll) {
    const imgNames = []
    let imgPath = '/images/';

    let rollP = $('<p>')
        .append('You rolled ' + roll);

    console.log(roll);

    $('#dice').append(rollP);
}



// EVENT LISTENERS
function setUpEventListeners(ws) {
    $('.rollDice').on('click', async () => {
        const roll = await ws.send('rollDice');

        setRoll(roll);
    });
}



// ON LOAD
$(document).ready(() => {
    const game_id = $('#board').data('id');
    const ws = new WebSocket("ws://localhost:8080/");

    console.log(ws);

    ws.onopen = () => {
        getPlayers(ws);
    };

    setUpEventListeners(ws);
});



// $('.logOut').on('click', () => {
//     sessionStorage.setItem('monopolyUsername', user_name);
//     localStorage.removeItem('monopolyUsername');
//     location.reload();
// });