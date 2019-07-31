// REQUESTS
async function getPlayers() {
    const game_id = $('#board').data('id');
    const players = await $.get('../api/game_state/' + game_id + '/users');

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
    let imgPath = '../images/';

    let rollP = $('<p>')
        .append('You rolled ' + roll);
    
    console.log(roll);

    $('#dice').append(rollP);
}



// EVENT LISTENERS
async function setUpEventListeners() {
    $('.rollDice').on('click', () => {
        const roll = $.get('../api/game/rollDice');
        
        setRoll(roll);
    });
}



// ON LOAD
$(document).ready(function () {
    setUpEventListeners();
    getPlayers();
});



// $('.logOut').on('click', () => {
//     sessionStorage.setItem('monopolyUsername', user_name);
//     localStorage.removeItem('monopolyUsername');
//     location.reload();
// });