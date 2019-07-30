// EVENT LISTENERS
$(document).ready(function () {
    let user_name = localStorage.getItem('monopolyUsername');

    if (user_name) {
        pageSetup(user_name);
    }
    else {
        $('.user_name').val(sessionStorage.getItem('monopolyUsername'));
    }

    $('.userName').submit(event => {
        event.preventDefault();

        $.ajax('/api/users', {
            method: 'POST',
            data: $(event.target).serialize()
        })
            .then(
                () => {
                    user_name = $('.user_name').val();
                    localStorage.setItem('monopolyUsername', user_name);

                    pageSetup(user_name);
                },
                res => {
                    $('.usernameErr').text(res.responseText);
                });
    });
});