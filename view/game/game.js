// FUNCTIONS
function setPlayer(player) {
    setPlayerInfo(player);
    setPlayerPosition(player);
}

function removePlayer(player) {
    removePlayerInfo(player);
    removePlayerPosition(player);
}

function removePlayerInfo(player) {
    let playerInfo = $('.player' + player.player_number + 'Info');

    playerInfo.empty();
}

function removePlayerPosition(player) {
    $('.player' + + player.player_number + 'Pos').remove();
}

function setPlayers(payload) {
    payload.players.forEach(player => {
        setPlayer(player);
    });

    setInstructions(payload.playerInstructions);
    setCurrentPlayerTurn(payload.currentPlayerTurn);
    resetError();
}

function setPlayerInfo(player) {
    let playerInfo = $('.player' + player.player_number + 'Info');

    playerInfo.empty();

    let playerNameExpr = player.name;
    if (player.name === sessionStorage.getItem("playerName")) {
        playerNameExpr += " (YOU)";
    }

    playerInfo
        .append('<h6><b>Player ' + player.player_number + '</b><h6>')
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
        $('#cell' + tile.position)
            .html(tile.name)

        if (tile.owner) {
            const cellOwner = $('<p>')
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
    $('.currentPlayerTurn').text('Current turn: player ' + currentPlayerTurn);
}



// WEBSOCKET FUNCTIONS
const wsFunctions = {
    setPlayer: setPlayer,
    setPlayers: setPlayers,
    setRolls: setRolls,

    doTurn: function (payload) {
        setRolls(payload.rolls);
        setPlayers(payload);
    },

    setBoard: function (payload) {
        setUpTiles(payload.tiles);
        setPlayers(payload);
    },

    propertyPurchased: function (payload) {
        const tileOwner = payload.tileOwner;

        const tileOwnerDisplay = $('<p>')
            .text('Owned by: ' + tileOwner.name)
            .addClass('cell' + tileOwner.position + 'Owner');

        $('#cell' + tileOwner.position).append(tileOwnerDisplay);

        setPlayers(payload);
    },

    checkLosers: function (payload) { //TODO: get rid of losers in game
        let losers = payload.losers;
        let survivors = payload.survivors;

        // 1. Remove the losers in player info box
        // 2. Send an alert to everyone showing who loses
        // 3. The player is allowed to stay in game to watch it, but it can't send any messages 

        // Remove all the losers, leave only survivors
        losers.forEach(loser => {
            removePlayer(loser);
        })

        // Check if this player is a loser
        let loserMsg = "";
        losers.forEach(loser => {
            if (loser.name === sessionStorage.getItem('playerName')) {

                // Set this player status as 'LOSE'. Then this player can't send any messages
                // to the server
                sessionStorage.setItem('playerStatus', 'LOSE');
            }

            // Build a message containing all losers' names
            loserMsg += (loser.name + " LOSE!!!\n");
        });

        // Toggle the message of losers to everyone
        alert(loserMsg);
        console.log(losers);
    },

    error: function (payload) {
        $('.error').text(payload.text);
    },

    propertyPassed: function (payload) {
        setInstructions(payload.playerInstructions);
        setCurrentPlayerTurn(payload.currentPlayerTurn)
        resetError();
    }
};



// EVENT LISTENERS
function setUpEventListeners(ws) {
    // roll dice
    $('.rollDice').on('click', async () => {
        if ('PLAYING' === sessionStorage.getItem('playerStatus')) {
            const request = {
                function: 'doTurn'
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });


    // buy 
    $('.buy').on('click', async () => {
        // TODO: need to define function 'buy' in player.js
        if ('PLAYING' === sessionStorage.getItem('playerStatus')) {
            const request = {
                function: 'purchaseProperty'
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });

    // pass 
    $('.pass').on('click', async () => {
        // TODO: need to define function 'pass' in player.js
        if ('PLAYING' === sessionStorage.getItem('playerStatus')) {
            const request = {
                function: 'passProperty'
            }

            ws.send(JSON.stringify(request));
            $('.error').text('');
        }
    });

    // sell 
    $('.sell').on('click', async () => {
        // TODO: need to define function 'sell' in player.js
        if ('PLAYING' === sessionStorage.getItem('playerStatus')) {
            console.log("Will call ws.send('sell')");
        }
    });
}



// ON LOAD
$(document).ready(() => {
    const matches = window.location.origin.match(/\/(.*)/);
    const url = matches[1];

    const ws = new WebSocket('ws://' + url);

    console.log(ws);

    ws.onmessage = (message) => {
        console.log('\nMessage: ' + message.data);

        const data = JSON.parse(message.data);

        // console.log(data);

        wsFunctions[data.function](data.payload);
    }

    setUpEventListeners(ws);
});