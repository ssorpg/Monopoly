// FUNCTION ROUTER OBJECT
const callbacks = {
    setPlayers: setPlayers,
    setRoll: setRoll
};



// FUNCTIONS
function setPlayers(players) {
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
    const imgNames = ['1oneDice.png', '2twoDice.png', '3threeDice.png', '4fourDice.png', '5fiveDice.png', '6sixDice.png'];
    const imgPath = '../images/';

    $('.diceImages').empty();

    const newImg = $('<img>').attr('src', imgPath + imgNames[roll.die1 - 1]);
    const newImg2 = $('<img>').attr('src', imgPath + imgNames[roll.die2 - 1]);

    $('.diceImages').append(newImg, newImg2);
}



// EVENT LISTENERS
function setUpEventListeners(ws) {
    $('.rollDice').on('click', async () => {
        ws.send('rollDice');
    });
}



// ON LOAD
$(document).ready(() => {
    const game_id = $('#board').data('id');
    const ws = new WebSocket("ws://localhost:8080/");

    console.log(ws);

    ws.onopen = () => {
        ws.send('getUsers');
    };

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