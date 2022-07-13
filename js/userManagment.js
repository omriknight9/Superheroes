
const back4appAppId = 'gtdHhx99C3WkxE5EWFi8NN3M8u3MBVXc0sQk5y7C';
const back4appJsKey = 'EQrq2RH5VZ8FBRuq2t21OSkuSYiTXTXWVpuYyZot';
let characterObj = [];
let currentUser;
let userLoggedIn = false;
let favorites = false;

$(document).ready(() => {
    Parse.initialize(back4appAppId, back4appJsKey);
    Parse.serverURL = "https://parseapi.back4app.com/";

    if (Parse.User.current() !== null) {
        currentUser = Parse.User.current();
        userLoggedIn = true;
        characterObj = currentUser.get("characterObj");

        if (characterObj == undefined) {
            characterObj = [];
        }

        $('#header').hide();

        setTimeout(() => {
            $.each($('.heroWrapper'), function (key, value) {
                $('<img>', {
                    class: 'addToFavoritesBtn',
                    src: './images/emptyStar.png',
                    alt: 'star',
                    click: function() {
                        if ($(this).attr('src') == './images/emptyStar.png') {
                            $(this).attr('src', './images/fullStar.png');
                        } else {
                            $(this).attr('src', './images/emptyStar.png');
                        }
                        let containerElement = $(this).parent().parent().parent();
                        addToFavorites(Number($(this).parent().parent().find($('.character')).attr('id')), $(containerElement).attr('id'));
                    }
                }).appendTo($(value).find($('.characterBtnWrapper')));
    
                if ($(window).width() < 765) {
                    $(value).find($('.characterBtn')).addClass('characterBtnLoggedIn');
                    $(value).find($('.addToFavoritesBtn')).addClass('addToFavoritesBtnLoggedIn');
                }
    
                let cleanVal = $(value).find($('.character')).attr('id');

                if (!characterObj.find(o => o.id === Number(cleanVal) && o.container === $(value).parent().attr('id'))) { 
                } else {
                    let starBtn = $(value).find($('.addToFavoritesBtn'));
                    $(starBtn).attr('src', './images/fullStar.png');
                }
            });
        }, 2000);

        $('.menuOpenWrapper').show();
        $('#userNameHeader').html('Hello, ' + capitalize(currentUser.get("username"))).show();
        $('#signUpBtn').hide();
    }
});

const goToSignUp = () => {
    $('body').css('pointer-events', 'none');
    $('.infinityGauntlet, #signUpBtn').hide();

    if ($(window).width() < 765) {
        $('#header').hide();
    }
    
    $('html, body').css({'background': 'url(./images/background9.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    $('#mainContent, .searchContainer').hide();

    $.get("signUpForm.html", (data) => {
        $('#signUpFormWrapper').show();
        $('#signUpFormWrapper').append(data);
        setTimeout(() => {
            $('body').css('pointer-events', 'all');
        }, 1000);
    });
}

const showSignInForm = () => {
    $('#signInSection').show();
    $('#signUpSection, #forgotPassSection').hide();
}

const showSignUpForm = () => {
    $('#signUpSection').show();
    $('#signInSection').hide();
}

const showResetPassForm = () => {
    $('#forgotPassSection').show();
    $('#signInSection').hide();
}

const signUp = () => {
    valid = true;
    let nameVal = $('#usernameSignUp').val();
    let emailVal = $('#emailSignUp').val();
    let passwordVal = $('#passwordSignUp').val();
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (nameVal == '' || nameVal.length < 2) {
        $('#usernameSignUp').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }
    
    if (emailVal == '' || emailVal == undefined || emailVal == 0 || !filter.test(emailVal)) {
        $('#emailSignUp').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (passwordVal == '' || passwordVal.length < 6) {
        $('#passwordSignUp').css({
            'border': '1px solid #FF4545'
        });

        $('body').css('pointer-events', 'none');
        $('#passErrorSignIn').fadeIn();

        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#passErrorSignIn').fadeOut();
        }, 2000);

        valid = false;
    }

    if (valid) {
        if (Parse.User.current() !== null) {
            Parse.User.logOut();
        }

        localStorage.clear();
        let user = new Parse.User();
        currentUser = user;
        user.set("username", nameVal);
        user.set("password", passwordVal);
        user.set("email", emailVal);
        user.set("characters", chosenCharacterArr);

        user.signUp().then(() => {
            showSignInForm();

        }).catch((error) => {
            console.log("Error: " + error.code + " " + error.message);
        });
    }
}

const logIn = () => {
    valid = true;
    let nameVal = $('#usernameSignIn').val();
    let passwordVal = $('#passwordSignIn').val();

    if (nameVal == '' || nameVal.length < 2) {
        $('#usernameSignIn').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }
    
    if (passwordVal == '' || passwordVal.length < 6) {
        $('#passwordSignIn').css({
            'border': '1px solid #FF4545'
        });

        $('body').css('pointer-events', 'none');
        $('#passErrorLogIn').fadeIn();

        setTimeout(() => {
            $('body').css('pointer-events', 'all');
            $('#passErrorLogIn').fadeOut();
        }, 2000);

        valid = false;
    }

    if (valid) {
        localStorage.clear();

        let user = Parse.User.logIn(nameVal, passwordVal).then((user) => {
            currentUser = user;
            let characters = user.get("characters");
            chosenCharacterArr = characters;

            $.each($('.heroWrapper'), (key, value) => {
            
                let addToFavoritesBtn = $('<img>', {
                    class: 'addToFavoritesBtn',
                    src: './images/emptyStar.png',
                    alt: 'star',
                    click: function() {
                        if ($(this).attr('src') == './images/emptyStar.png') {
                            $(this).attr('src', './images/fullStar.png');
                        } else {
                            $(this).attr('src', './images/emptyStar.png');
                        }
                        let containerElement = $(this).parent().parent().parent();
                        addToFavorites(Number($(this).parent().parent().find($('.character')).attr('id')), $(containerElement).attr('id'));
                    }
                }).appendTo($(value).find($('.characterBtnWrapper')));

                if ($(window).width() < 765) {
                    $(value).find($('.characterBtn')).addClass('characterBtnLoggedIn');
                    $(value).find($('.addToFavoritesBtn')).addClass('addToFavoritesBtnLoggedIn');
                }

                let cleanVal = $(value).find($('.character')).attr('id');

                if (!characterObj.find(o => o.id === Number(cleanVal) && o.container === $(value).parent().attr('id'))) { 
                } else {
                    let starBtn = $(value).find($('.addToFavoritesBtn'));
                    $(starBtn).attr('src', './images/fullStar.png');
                }
            });

            $('.menuOpenWrapper').show();
            $('#header').hide();
            $('body').css('pointer-events', 'none');
            
            setTimeout(() => {
                $('body').css('pointer-events', 'all');
            }, 2000);

            $('#signUpBtn').hide();
            userLoggedIn = true;
            $('#userNameHeader').html('Hello, ' + capitalize(user.get("username"))).show();
            goHome(2);
        }).catch((error) => {
            if (error.code == 205) {
                $('body').css('pointer-events', 'none');
                $('.signUpButton').html('Please Verify Your Email');
                $('.signUpButton').css({'color': 'red', 'background': 'white'});

                setTimeout(() => {
                    $('body').css('pointer-events', 'all');
                    $('.signUpButton').html('Log In');
                    $('.signUpButton').css({'color': 'white', 'background': 'linear-gradient(#333, #222)'});
                }, 2000);
            } else if (error.code == 101) {
                $('body').css('pointer-events', 'none');
                $('.signUpButton').html('Check Username/Password');
                $('.signUpButton').css({'color': 'red', 'background': 'white'});

                setTimeout(() => {
                    $('body').css('pointer-events', 'all');
                    $('.signUpButton').html('Log In');
                    $('.signUpButton').css({'color': 'white', 'background': 'linear-gradient(#333, #222)'});
                }, 2000);
            } else {
                console.log("Error: " + error.code + " " + error.message);
            }
        }); 
    }
}

const logOut = () => {
    localStorage.clear();
    chosenCharacterArr = [];

    let user = Parse.User.logOut().then((user) => {
        currentUser = user;

        if ($(window).width() < 765) {
            $('#header').show();
        } else {
            $('#signUpBtn').show();
        }

        if(heroes == 1) {
            $('.heroWrapper').fadeIn();
        }

        $('.addToFavoritesBtn').remove();
        $('.menuOpenWrapper, #userNameHeader').hide();
        $('.characterBtn').removeClass('characterBtnLoggedIn');
        $('#userNameHeader').html('');
        userLoggedIn = false;
    });
}

const resetPassword = () => {
    valid = true;
    let emailVal = $('#emailForgotPass').val();
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (emailVal == '' || emailVal == undefined || emailVal == 0 || !filter.test(emailVal)) {
        $('#emailForgotPass').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (valid) {
        Parse.User.requestPasswordReset(emailVal).then(() => {
            $('#emailWasSent').fadeIn();

            setTimeout(() => {
                $('#emailWasSent').fadeOut();
                showSignInForm();
            }, 2000); 
        }).catch((error) => {
            console.log("The login failed with error: " + error.code + " " + error.message);
        });
    }
}

const addToFavorites = (character, containerElement) => {
    let obj = {
        id: character,
        container: containerElement
    }

    if (!characterObj.find(o => o.id === character && o.container === containerElement)) {
        characterObj.push(obj)
    } else {
        for (let i = 0; i < characterObj.length; i++) {
            if (characterObj[i].id === character && characterObj[i].container === containerElement) {
                characterObj.splice(i, 1);
                break;
            }
        }
    }

    currentUser.set("characterObj", characterObj).save();
}

const showFavorites = (type) => {
    $('body').css('pointer-events', 'none');
    let characters = currentUser.get("characters");

    if (characters == undefined) {
        characters = [];
    }

    if (type == 1) {
        if ($('#time2').is(':visible')) {
            $('#time2').click();
            setTimeout(() => {
                $.each($('.heroWrapper'), (key, value) => {
                    let cleanVal = $(value).find($('.character')).attr('id');

                    if (!characterObj.find(o => o.id === Number(cleanVal) && o.container === $(value).parent().attr('id'))) { 
                        $(value).fadeOut('slow');
                    } else {
                        $('#marvelContainer .infinityGauntlet').hide();
                        $('.addToFavoritesBtn').fadeOut();
                        $('.characterBtn').removeClass('characterBtnLoggedIn');
                    }
                });
        
                $('#favoritesBtn').attr('onclick', 'showFavorites(2)');
                $('#favoritesBtn').html('Show All');
                type = 2;
                $('body').css('pointer-events', 'all');
            }, 3000)
        } else {
            $.each($('.heroWrapper'), (key, value) => {
                let cleanVal = $(value).find($('.character')).attr('id');

                if (!characterObj.find(o => o.id === Number(cleanVal) && o.container === $(value).parent().attr('id'))) { 
                    $(value).fadeOut('slow');
                } else {
                    $('#marvelContainer .infinityGauntlet').hide();
                    $('.addToFavoritesBtn').fadeOut();
                    $('.characterBtn').removeClass('characterBtnLoggedIn');
                }
            });
    
            $('#favoritesBtn').attr('onclick', 'showFavorites(2)');
            $('#favoritesBtn').html('Show All');
            type = 2;
            $('body').css('pointer-events', 'all');
        }
        
        favorites = true;
    } else {
        $('#marvelContainer .infinityGauntlet').show();
        $('.heroWrapper').fadeIn();
        $('.addToFavoritesBtn').fadeIn();
        $('.characterBtn').addClass('characterBtnLoggedIn');
        $('#favoritesBtn').attr('onclick', 'showFavorites(1)');
        $('#favoritesBtn').html('Show Favorites');
        type = 1;
        setTimeout(() => {
            $('body').css('pointer-events', 'all');
        }, 1000);

        favorites = false;
    }
}

const goToMyAccount = () => {
    $('body').css('pointer-events', 'none');
    $('.infinityGauntlet, #signUpBtn, #userNameHeader, .menuOpenWrapper').hide();
    $('html, body').css({'background': 'url(./images/background9.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    $('#mainContent, .searchContainer').hide();

    $.get("myAccount.html", (data) => {
        $('#myAccountWrapper').show();
        $('#myAccountWrapper').append(data);
        setTimeout(() => {
            $('body').css('pointer-events', 'all');
        }, 1000);
    });
}

const changeUsername = () => {
    valid = true;
    let usernameAccountVal = $('#usernameAccount').val();

    if (usernameAccountVal == '' || usernameAccountVal.length < 2) {
        $('#usernameAccount').css({
            'border': '1px solid #FF4545'
        });
        valid = false;
    }

    if (valid) {
        currentUser.set('username', usernameAccountVal).save();
        $('#userNameHeader').html(capitalize(usernameAccountVal));
        goHome(2);
    }
}
