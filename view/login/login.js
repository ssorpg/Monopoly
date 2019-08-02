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
                .then(() => {
                    window.location.href = '/game';
            });
        })
    });

    $("#player").on("click", function () {
        $(this).attr("src", "images/"+playerImgFiles[Math.floor(Math.random() * playerImgFiles.length)]);
    })
});