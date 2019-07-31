$(function () {
    $("#submitGameButton").on("click", function (event) {
        event.preventDefault();

        // put player setup in the local storage
        const playerSetup = window.localStorage;

        const player = { name: $('#playerName').val() };

        playerSetup.setItem('monopolyUsername', player.name);

        // use user api to send player names as players
        $.post('/api/players', player)
            .then(() => {
                window.location.href = 'http://localhost:8080/public/game/game.html';
            })
    })
})