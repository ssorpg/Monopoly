let playerImgFiles = [
    "player1.png",
    "player2.png",
    "player3.png",
    "player4.png"
];

$(function () {
    $('#submitGameButton').on('click', function (event) {
        event.preventDefault();

        $("#start-icon").animate({
            marginTop : "-=100px"
        }, 2000, function() {
            const player = { name: $('#playerName').val() };

            // use user api to send player names as players
            $.post('/api/players', player)
                .then((res) => {
                    // save player's name at local storage
                    window.localStorage.setItem("playerName", player.name);
                    // set player status. The player status is as one of the following:
                    // "PLAYING", "WIN", "LOSE"
                    // This player is just getting started, so set the status as "PLAYING"
                    window.localStorage.setItem("playerStatus", "PLAYING");
                    window.location.href = '/game?name=' + player.name + '&hash=' + res;
            });
        })
    });

    $("#player").on("click", function () {
        $(this).attr("src", "images/"+playerImgFiles[Math.floor(Math.random() * playerImgFiles.length)]);
    })
});