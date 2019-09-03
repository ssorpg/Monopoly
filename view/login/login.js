let playerImgFiles = [
    'player1.png',
    'player2.png',
    'player3.png',
    'player4.png'
];

$(function () {
    $('#submitGameButton').on('click', function (event) {
        event.preventDefault();
        $('.error').text('');

        const player = { name: $('#playerName').val() };

        $('#start-icon').animate({ marginTop: '-=100px' }, 1000, () => {
            // use user api to send player names as players
            $.post('/api/games/1/players', player)
                .then(res => {
                    // save player's name at session storage
                    window.sessionStorage.setItem('playerName', player.name);
                    // set player status. The player status is as one of the following:
                    // 'PLAYING', 'WIN', 'LOSE'
                    // This player is just getting started, so set the status as 'PLAYING'
                    window.sessionStorage.setItem('playerStatus', 'PLAYING');
                    window.location.href = '/game?name=' + player.name + '&hash=' + res;
                },
                    err => {
                        $('#start-icon').removeAttr('style');
                        $('.error').text(err.responseText);
                    });
        });
    });

    $('#player').on('click', function () {
        $(this).attr('src', 'images/' + playerImgFiles[Math.floor(Math.random() * playerImgFiles.length)]);
    })
});
