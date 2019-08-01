$(function () {
    $("#submitGameButton").on("click", function (event) {
        event.preventDefault();

        const player = { name: $('#playerName').val() };

        // use user api to send player names as players
        $.post('/api/players', player)
            .then(() => {
                window.location.href = 'http://localhost:8080/public/game/game.html?name=' + player.name;
            })
    })
})