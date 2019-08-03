// FUNCTIONS
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

function setInstructions(playerInstructions) {
    $('#message').text(playerInstructions);
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
        $('.notYourTurn').empty();

        const newImg = $('<img>').attr('src', imgPath + imgNames[rolls.die1 - 1]);
        const newImg2 = $('<img>').attr('src', imgPath + imgNames[rolls.die2 - 1]);

        $('.diceImages').append(newImg, newImg2);

        setPlayer(player);
        setInstructions(payload.playerInstructions);
    },

    propertyPurchased: function (payload) {
        $('.cell' + player.position + 'Owner').text('Owned by: ' + player.name);
        setInstructions(payload.playerInstructions);
    },

    checkLosers: function (payload) { //TODO: get rid of losers in game
        let losers = payload.losers;
        let survivors = payload.survivors;
        // TODO
        // 1. Remove the losers on the player list (done)
        // 2. If this player is a loser. Show a message like "YOU LOSE"
        // 3. The player is allowed to stay in game to watch it, but it can't send any messages (done)
        
        // Remove all the losers, leave only survivors
        this.setPlayers(survivors);

        // Check if this player is a loser
        losers.forEach(loser => {
            if (loser.name === window.localStorage.getItem("playerName")) {

                // Set this player status as "LOSE". Then this player can't send any messages
                // to the server
                window.localStorage.setItem("playerStatus", "LOSE");

                // TODO: toggle a message to this player saying "YOU LOSE"
            }
        });
        console.log(losers);
    },

    notYourTurn: function (payload) {
        $('.error').text(payload.text);
    },

    messageError: function (payload) {
        $('.messageError').text(payload.text);
    }
};



// EVENT LISTENERS
function setUpEventListeners(ws) {
    // roll dice
    $('.rollDice').on('click', async () => {
        if ("PLAYING" === window.localStorage.getItem("playerStatus")) {
            const request = {
                function: 'doTurn'
            }
    
            ws.send(JSON.stringify(request));
        }
    });

    // bid 
    $(".bid").on("click", async () => {
        // TODO: need to define function "bid" in player.js
        if ("PLAYING" === window.localStorage.getItem("playerStatus")) {
            console.log("Will call ws.send('bid')");
        }
    })

    // buy 
    $(".buy").on("click", async () => {
        // TODO: need to define function "buy" in player.js
        if ("PLAYING" === window.localStorage.getItem("playerStatus")) {
            console.log("Will call ws.send('buy')");
        }
    })

    // trade 
    $(".trade").on("click", async () => {
        // TODO: need to define function "trade" in player.js
        if ("PLAYING" === window.localStorage.getItem("playerStatus")) {
            console.log("Will call ws.send('trade')");
        }
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