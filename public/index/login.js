$(function () {
    $("#submitGameButton").on("click", function () {
        // put player setup in the local storage
        const playerSetup = window.localStorage;

        let player = {
            name: $('#playerName').val(),
            money: 1500,
            position: 18
        };

        // use user api to send player names as players
        $.post('/api/players', {
            data: player
        }).then(res => {
            console.log(res);

            if (res.status === 200) {
                window.location.href = 'http://localhost:8080/public/game/game.html';
            }
        })
    })
})