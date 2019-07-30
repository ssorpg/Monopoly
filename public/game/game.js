// REQUESTS




// FUNCTIONS
async function getPlayers(game_id) {
    const players = await $.get('../api/game_state/' + 1 + '/users');

    $('#players').empty();
    players.forEach(player => {
        let newPlayer = $('<p>')
            .append('<h3>Name: ' + player.user_name + '</h3>')
            .append('<h4>Money: ' + player.money + '</h3>');

        $('#players').append(newPlayer);
    });
}



// ON LOAD
$(document).ready(function () {
    const game_id = $('#board').data('id');

    getPlayers(game_id);
});



// $('.logOut').on('click', () => {
//     sessionStorage.setItem('monopolyUsername', user_name);
//     localStorage.removeItem('monopolyUsername');
//     location.reload();
// });