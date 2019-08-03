// HELPER FUNCTIONS
function setPlayer(player) {
    setPlayerInfo(player);
    setPlayerPosition(player);
}

function setPlayerInfo(player) {
    let playerInfo = $('.player' + player.player_number + 'Info');

    playerInfo.empty();

    playerInfo
        .append('<h6><b>Player ' + player.player_number + '</b></h6>')
        .append('<h6>Name: ' + player.name + '</h6>')
        .append('<h6>Money: ' + player.money + '</h6>');
}

function setPlayerPosition(player) {
    $('.player' + + player.player_number + 'Pos').remove();

    const playerPos = $('<div>')
        .addClass('player' + player.player_number + 'Pos')
        .addClass('positionMarker');

    $('#cell' + player.position).append(playerPos);
}

function setTileDescription(description) {
    $('#message').text(description);
}



// WEBSOCKET FUNCTIONS
const wsFunctions = {
    setPlayer: setPlayer,

    setPlayers: function (players) {
        $('#playerInfo').children().empty();
        $('.positionMarker').remove();

        players.forEach(player => {
            setPlayer(player);
        });
    },

    setRoll: function (payload) {
        const player = payload.player
        const rolls = payload.rolls;
    
        const imgNames = ['1oneDice.png', '2twoDice.png', '3threeDice.png', '4fourDice.png', '5fiveDice.png', '6sixDice.png'];
        const imgPath = '../images/';
    
        $('.diceImages').empty();
    
        const newImg = $('<img>').attr('src', imgPath + imgNames[rolls.die1 - 1]);
        const newImg2 = $('<img>').attr('src', imgPath + imgNames[rolls.die2 - 1]);
    
        $('.diceImages').append(newImg, newImg2);
    
        setPlayer(player);
        setTileDescription(payload.tile.description);
    },

    wait: function() {}, // So we don't get console errors when server returns nothing

    checkLosers : function(payload) {   //TODO: get rid of losers in game
        let losers = payload.losers;
        // TODO
        // 1. Remove the losers on the player list
        // 2. If this player is a loser. Show a message like "YOU LOSE"
        // 3. The player is allowed to stay in game to watch it, but it can't send any messages
        console.log(losers);
    }
};



// EVENT LISTENERS
function setUpEventListeners(ws) {
    // roll dice
    $('.rollDice').on('click', async () => {
        const request = {
            function: 'doTurn'
        }

        ws.send(JSON.stringify(request));
    });

    // bid 
    $(".bid").on("click", async () => {
        // TODO: need to define function "bid" in player.js
        console.log("Will call ws.send('bid')");
    })

    // buy 
    $(".buy").on("click", async () => {
        // TODO: need to define function "buy" in player.js
        console.log("Will call ws.send('buy')");
    })

    // trade 
    $(".trade").on("click", async () => {
        // TODO: need to define function "trade" in player.js
        console.log("Will call ws.send('trade')");
    })
}



// ON LOAD
$(document).ready(() => {
    const ws = new WebSocket('ws://localhost:8080/');

    console.log(ws);

    ws.onmessage = (message) => {
        console.log('\nMessage: ' + message.data);

        const data = JSON.parse(message.data);

        // console.log(data);

        wsFunctions[data.function](data.payload);
    }

    setUpEventListeners(ws);
});