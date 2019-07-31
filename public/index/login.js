$(function() {
    $("#submitGameButton").on("click", function() {
        // put player setup in the local storage
        let playerSetup = window.localStorage;

        // get player number
        let playerNum = parseInt($("#playernumber").val());
        playerSetup.setItem("playerNum", String(playerNum));

        // create player array
        let playerArr = new Array();

        // fetch player name and color choices
        for (let i = 0; i < playerNum; i++) {
            let playerNameId = getPlayerNameByNum(i+1);
            let playerColorId = getPlayerColorByNum(i+1);

            let playerName = $("#" + playerNameId).val();
            let playerColor = $("#" + playerColorId).val();

            playerArr.push(playerName);

            playerSetup.setItem(playerNameId, playerName);
            playerSetup.setItem(playerColorId, playerColor);
        }

        console.log(playerArr);

        // use user api to send player names as users
        $.ajax('/api/users', {
            type : "POST",
            data : {
                players : playerArr
            }
        }).then(function() {
            console.log("player data sent");
            window.open("/public/game/game.html");
        })
    })
})

function getPlayerNameByNum(num) {
    return "player" + num + "name";
}

function getPlayerColorByNum(num) {
    return "player" + num + "color";
}