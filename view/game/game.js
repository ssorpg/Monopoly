// FUNCTIONS
function setPlayer(player) {
    setPlayerInfo(player);
    setPlayerPosition(player);
}

function setPlayers(payload) {
    $('#playerInfo').children().empty();

    payload.players.forEach(player => {
        setPlayer(player);
    });

    setInstructions(payload.playerInstructions);
    setCurrentPlayerTurn(payload.currentPlayerTurn);
    resetError();
}

function setPlayerInfo(player) {
    const playerInfo = $('.player' + player.player_number + 'Info');

    playerInfo.empty();

    let playerNameExpr = player.name;
    if (player.name === window.sessionStorage.getItem("playerName")) {
        playerNameExpr += " (YOU)";
    }

    playerInfo
        .append('<h6><b>Player ' + player.player_number + '</b></h6>')
        .append('<h6>Name: ' + playerNameExpr + '</h6>')
        .append('<h6>Money: $' + player.money + '</h6>');
}

function setPlayerPosition(player) {
    $('.player' + + player.player_number + 'Pos').remove();

    const playerPos = $('<div>')
        .addClass('player' + player.player_number + 'Pos')
        .addClass('positionMarker');

    $('#cell' + player.position).append(playerPos);
}

function setInstructions(playerInstructions) {
    $('#message').text(playerInstructions);
}


function setUpTiles(tiles) {
    tiles.forEach(tile => {
        if (tile.type === 'property') {
            $('#cell' + tile.position)
                .html('<p>' + tile.name + ' ($' + tile.property_cost + ')' + '</p>');
        }
        else if (tile.type === 'tax') {
            $('#cell' + tile.position)
                .html('<p>' + tile.name + ': </p> <div>$' + tile.money_lost + '</div>');
        }
        else {
            $('#cell' + tile.position)
                .html('<p>' + tile.name + '</p>');
        }

        if (tile.owner) {
            const cellOwner = $('<div>')
                .text('Owned by: ' + tile.owner)
                .addClass('cell' + tile.position + 'Owner');

            $('#cell' + tile.position).append(cellOwner);
        }
    });
}

function setRolls(rolls) {
    const imgNames = ['1oneDice.png', '2twoDice.png', '3threeDice.png', '4fourDice.png', '5fiveDice.png', '6sixDice.png'];
    const imgPath = '../images/';

    $('.diceImages').empty();
    $('.notYourTurn').empty();

    const newImg = $('<img>').attr('src', imgPath + imgNames[rolls.die1 - 1]);
    const newImg2 = $('<img>').attr('src', imgPath + imgNames[rolls.die2 - 1]);

    $('.diceImages').append(newImg, newImg2);
}

function resetError() {
    $('.error').text('');
}

function setCurrentPlayerTurn(currentPlayerTurn) {
    $('.currentPlayerTurn').text('Current turn: Player ' + currentPlayerTurn + '.');
}



// WEBSOCKET FUNCTIONS
const wsFunctions = {
    setPlayer: setPlayer,
    setPlayers: setPlayers,
    setRolls: setRolls,

    addNewPlayer: function(payload) {
        let message = {
            event:'addPlayer',
            data: {
                name: window.sessionStorage.getItem('playerName')
            }
        }
        ws.send(JSON.stringify(message));
    },
    canStart: function(payload) {
        $('#start').show();
    },
    started: function(payload) {
        $('#start').hide();
        $('#dice').show();
        $('#diceButton').hide();
    },
    yourTurn: function(payload) {
        $('#diceButton').show();
    },
    doTurn: function (payload) {
        $('#buttons').show();
        $('#diceButton').hide();
        setRolls(payload.rolls);
        setPlayers(payload);
    },
    setupTiles: function(data) {
        setUpTiles(data.tiles);
    },
    setBoard: function (payload) {
        setUpTiles(payload.tiles);
        setPlayers(payload);
    },
    setPlayer: function(payload) {
        setPlayerInfo(payload)
    },
    setUuid: function(payload) {
        uuid = payload.uuid;
    },
    propertyPurchased: function (payload) {
        $('#buttons').hide();

        const tileOwner = payload.tileOwner;

        const tileOwnerDisplay = $('<p>')
            .text('Owned by: ' + tileOwner.name)
            .addClass('cell' + tileOwner.position + 'Owner');

        $('#cell' + tileOwner.position).append(tileOwnerDisplay);

        setPlayers(payload);
    },

    lose: function () {
        alert('You went bankrupt!');
        window.sessionStorage.setItem('playerStatus', 'GAMEOVER');
    },

    winner: function (payload) {
        alert(payload.player.name + ' WINS!');
        window.sessionStorage.setItem('playerStatus', 'GAMEOVER');
    },

    error: function (payload) {
        $('.error').text(payload.text);
    },

    propertyPassed: function (payload) {
        $('#buttons').hide();

        setInstructions(payload.playerInstructions);
        setCurrentPlayerTurn(payload.currentPlayerTurn)
        resetError();
    }
};
let ws;
let uuid;



// EVENT LISTENERS
function setUpEventListeners() {
    // roll dice
    $('#dice').on('click', async () => {
        if ('PLAYING' === window.sessionStorage.getItem('playerStatus')) {
            const request = {
                event: 'rollDice',
                data: {
                    uuid:uuid
                }
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });

    $('#start').on('click', () => {
        const request = {
            event: 'startGame',
            data: {
                uuid:uuid
            }
        }
        ws.send(JSON.stringify(request));
    })

    // buy
    $('.buy').on('click', async () => {
        // TODO: need to define function 'buy' in player.js
        if ('PLAYING' === window.sessionStorage.getItem('playerStatus')) {
            const request = {
                event: 'purchaseProperty',
                data: {
                    uuid:uuid
                }
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });

    // pass
    $('.pass').on('click', async () => {
        // TODO: need to define function 'pass' in player.js
        if ('PLAYING' === window.sessionStorage.getItem('playerStatus')) {
            const request = {
                event: 'passProperty',
                data: {
                    uuid:uuid
                }
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });

    // sell - NOT IMPLEMENTED
    // $('.sell').on('click', async () => {
    //     // TODO: need to define function 'sell' in player.js
    //     if ('PLAYING' === window.sessionStorage.getItem('playerStatus')) {
    //         console.log("Will call ws.send('sell')");
    //     }
    // });
}



// ON LOAD
$(document).ready(() => {
    const matches = window.location.origin.match(/\/(.*)/);
    const url = matches[1];


    console.log(window.location.origin.indexOf('http'));

    if (window.location.origin.indexOf('https') === 0) {
        ws = new WebSocket('wss://' + url);
    }
    else {
        ws = new WebSocket('ws://' + url);
    }

    console.log(ws);

    ws.onmessage = (message) => {
        console.log('\nMessage: ' + message.data);

        const data = JSON.parse(message.data);

        // console.log(data);

        wsFunctions[data.function](data.payload);
    }

    setUpEventListeners();
});
