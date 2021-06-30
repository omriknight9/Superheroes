
const searchUrl = 'https://superheroapi.com/api.php/';
const accessToken = 10222400164056556;

const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';
const movieActorsUrl = "https://api.themoviedb.org/3/person/";

let marvelHeroesArr = [];
let marvelVillainsArr = [];
let nonMcuHeroesArr = [];
let nonMcuVillainsArr = [];
let dcHeroesArr = [];
let dcVillainsArr = [];
let mcuTimelineArr = [];
let dcTimelineArr = [];

let marvelMovieObj = {};
let marvelMovieVillainsObj = {};
let nonMcuMovieObj = {};
let nonMcuMovieVillainsObj = {};
let dcMovieObj = {};
let dcMovieVillainsObj = {};

let villainsShown = false;
let mcuTimelineShown = false;
let dcTimelineShown = false;

let movieList;

let searchVal;
let heroes = 1;

var time = 2;

let monthName;
let dayName;

let token;

let gauntletType;

$(document).ready(() => {

    goToTop();

    window.onscroll = function () {
        barScroll();
        scrollBtn();
        lazyload();
        this.oldScroll = this.scrollY;

        if ($(window).width() > 765) {
            $('.moveLine').each(function(i) {
                if ($(this).is(':visible')) {
                    var bottom_of_object = $(this).offset().top + $(this).outerHeight() + 100;
                    var bottom_of_window = $(window).scrollTop() + $(window).height();
                    if (bottom_of_window > bottom_of_object && !$(this).hasClass('moveUp')) {
                        $(this).addClass('moveUp');
                        if ($(this).attr('name') == 'nonMcuLineWrapper') {
                            $('#nonMcuContainer').addClass('fullOpacity');
                        } else if ($(this).attr('name') == 'dcLineWrapper') {
                            $('#dcContainer').addClass('fullOpacity');
                        }
                    }
                }
            });
        }
    };

    var interval = setInterval(() => {
        time--;
        if (time == 0) {
            clearInterval(interval);
            setTimeout(() => {
                $('#overlay').remove();
                $('.progress-container').show();
                $('main, #snap').fadeIn();
                $('#bottomSection').fadeIn();
                $('html').css('overflow-y', 'unset');
                window.scrollTo(0, 1);   
            }, 500);
        }
    }, 800);
  
    loadJson();

    $('#search').on('input', () => {

        if ($('#time2').is(':visible')) {
            $('#marvelContainer .heroWrapper').css({'transform': 'translateX(0)', 'opacity': 1});
            $('#marvelContainer .heroWrapper').fadeIn(1500);
            $('.dustImg').css('left', '10rem');
            $('#time2').attr('class', '');
            $('#time2').hide();
            $('#snap2').show();
            $('#snap2').attr('class', 'infinityGauntlet');
        }

        $('#searchResults').empty();

        searchVal = $('#search').val().toLowerCase();

        let searchClass;

        if (heroes == 1) {
            searchClass = '.heroWrapper';
        } else {
            searchClass = '.villainWrapper';
        }

        $.each($(searchClass), (key, value) => {
            $('#superheroContent').hide();
            $('#marvelContainer').show();
            $('#lineMarvel').parent().show();
            $('#dcContainer').show();
            $('#lineDc').parent().show();
            $('#nonMcuContainer').show();
            $('#lineNonMcu').parent().show();

            if ($(value).attr('name').toLowerCase().includes(searchVal)) {
                $(value).show();

                $('#searchResults').show();

                let result = $('<div>', {
                    class: 'result',
                    click: () => {
                        $('#searchResults').empty();
                        $('#searchResults').hide();
                        $('#search').val('');
                        $(value).find('.character').click();
                    }
                }).appendTo($('#searchResults'));

                let resultImg = $('<img>', {
                    class: 'resultImg',
                    alt: 'character',
                    src: $(value).find('.characterImg').attr('src')
                }).appendTo(result);

                let resultName = $('<p>', {
                    class: 'resultName',
                    text: $(value).attr('name')
                }).appendTo(result);
            } 
        });

        if (searchVal.length == 0) {
            $('#searchResults').empty();
            $('#searchResults').hide();
        }
    })

    $(document).on('click touchend', (e) => {
        if ($('#menu').is(':visible')) {
            if (!$(e.target).is(".menuOpenWrapper, #menu, .menuSpan, #toggle")) {
                $('#toggle').attr('class', '');
            } 
        }
    });
});

const lazyload = () => {

    let lazyloadImages = document.querySelectorAll(".lazy");

    let scrollTop = window.pageYOffset;

    lazyloadImages.forEach((img) => {
        if (img.getBoundingClientRect().top + 200 < (window.innerHeight)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
}

const dustHeroes = (type) => {

    let dustedArr = ['character703', 'character489', 'character714', 'character251',
    'character275', 'character697', 'character106', 'character620', 'character226',
    'character579', 'character708', 'character234', 'character630', 'character303'];

    if (type == 1) {
        setTimeout(() => {
            $.each($('.heroWrapper'), (key, value) => {
                if (dustedArr.includes($(value).attr('id'))) {
                    $(value).find($('.dustImg')).css('left', '-10rem');
                    $(value).css({'transform': 'translateX(60px)', 'opacity': 0});
                    $(value).fadeOut(1500);
                }
            });
        }, 500);

    } else {
        $('.heroWrapper').css({'transform': 'translateX(0)', 'opacity': 1});
        $('.heroWrapper').fadeIn(1500);
        $('.dustImg').css('left', '10rem');
    }
}

const goToDiv = (div) => {

    $('html, body').animate({
        scrollTop: $(div).offset().top - 200
    }, 1000);
}

const goHome = (type) => {

    if(type == 2 && heroes == 2) {
        $('#time').hide();
        $('#time').attr('class', '');
        $('#snap').show();
        $('#snap').attr('class', 'infinityGauntlet');
        villainsOrHeroes(2);
    }

    if (userLoggedIn) {
        if ($(window).width() < 765) {
            $('#header').hide();
        }

        $('#userNameHeader').show();
        if (heroes == 1) {
            $('.menuOpenWrapper').show();
        }
    } else {
        if ($(window).width() < 765) {
            $('#header').show();
        } else {
            $('#signUpBtn').show();
        }

        $('#userNameHeader').hide();
    }

    $('.infinityGauntlet').show();
    $('#superheroContent, #signUpFormWrapper, #myAccountWrapper').hide();
    if ($('#mainContent').hasClass('mainHeroes')) {
        $('html, body').css({'background': 'url(./images/background11.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    } else {
        $('html, body').css({'background': 'url(./images/background5.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    }

    $('#marvelContainer').show();
    $('#lineMarvel').parent().show();
    $('#dcContainer').show();
    $('#lineDc').parent().show();
    $('#mcuTimelineContent, #dcTimelineContent, #signUpFormWrapper, #myAccountWrapper').empty();
    searchVal = '';
    $('#search').val('');
    $('#mcuTimeline, #dcTimeline').hide();
    $('#mainContent, .searchContainer').show();

    if ($('#time2').is(':visible')) {
        $('#marvelContainer .characterWrapper').css({'transform': 'translateX(0)', 'opacity': 1});
        $('#marvelContainer .characterWrapper').fadeIn(1500);
        $('.dustImg').css('left', '10rem');
        $('#time2').attr('class', '');
        $('#time2').hide();
        $('#snap2').show();
        $('#snap2').attr('class', 'infinityGauntlet');
    }

    if (heroes == 1) {
        $('#marvelContainer .villainWrapper').fadeOut();
        $('#dcContainer .villainWrapper').fadeOut();
        $('#marvelContainer .heroWrapper').fadeIn();
        $('#dcContainer .heroWrapper').fadeIn();
    } else {
        $('#snap2, #time2').hide();
        $('#marvelContainer .heroWrapper').fadeOut();
        $('#dcContainer .heroWrapper').fadeOut();
        $('#marvelContainer .villainWrapper').fadeIn();
        $('#dcContainer .villainWrapper').fadeIn();
    }
}

const loadJson = () => {

    $.get('./lists/marvelMovieObj.txt', (data) => {
        marvelMovieObj = JSON.parse(data);
        marvelMovieObj = marvelMovieObj.movies;
    });

    $.get('./lists/dcMovieObj.txt', (data) => {
        dcMovieObj = JSON.parse(data);
        dcMovieObj = dcMovieObj.movies;
    });

    $.get('./lists/nonMcuMovieObj.txt', (data) => {
        nonMcuMovieObj = JSON.parse(data);
        nonMcuMovieObj = nonMcuMovieObj.movies;
    });

    $.get('./lists/marvelHeroes.txt', (data) => {
        marvelHeroesArr.push(JSON.parse(data));
        setTimeout(() => {
            buildCharacters($('#marvelContainer'), marvelHeroesArr, 1);
        }, 500);
    });

    $.get('./lists/dcHeroes.txt', (data) => {
        dcHeroesArr.push(JSON.parse(data));
        setTimeout(() => {
            buildCharacters($('#dcContainer'), dcHeroesArr, 1);
        }, 500);
    });

    $.get('./lists/nonMcuHeroes.txt', (data) => {
        nonMcuHeroesArr.push(JSON.parse(data));
        setTimeout(() => {
            buildCharacters($('#nonMcuContainer'), nonMcuHeroesArr, 1);
        }, 500);
    });
}

const buildCharacters = (wrapper, arr, num) => {
    let characters;

    characters = arr[0].characters;

    let charactersClass;
    
    if (num == 1) {
        charactersClass = 'characterWrapper heroWrapper';
    } else {
        charactersClass = 'characterWrapper villainWrapper';
    }

    for (let i = 0; i < characters.length; i++) {

        let characterWrapper = $('<div>', {
            class: charactersClass,
            name: characters[i].name,
            id: 'character' + characters[i].characterId,
        }).appendTo(wrapper);

        let characterBtnWrapper = $('<div>', {
            class: 'characterBtnWrapper',
        }).appendTo(characterWrapper);

        if ($(window).width() < 765) {
            
            let characterBtn = $('<img>', {
                class: 'characterBtn',
                alt: 'actor',
                src: './images/man.webp',
                click: function() {
                    if ($(this).parent().parent().find($('.characterName')).is(':visible')) {
                        $(this).parent().parent().find($('.characterName')).hide();
                        $(this).parent().parent().find($('.actorNameOverlay')).fadeIn();
                    } else {
                        $(this).parent().parent().find($('.actorNameOverlay')).hide();
                        $(this).parent().parent().find($('.characterName')).fadeIn();
                    }
                }
            }).appendTo(characterBtnWrapper);
        }

        let character = $('<div>', {
            class: 'character',
            name: characters[i].name,
            characterId: characters[i].characterId,
            video: characters[i].video,
            characterNum: characters[i].id,
            actor: characters[i].actor,
            instagram: characters[i].instagram,
            imdb: characters[i].imdb,
            actorId: characters[i].actorId,
            click: function() {
                if ($(this).attr('actorId') == 'null') {
                    $('#actorImg').attr('src', $(this).find($('.characterImg')).attr('src'));
                    $('#instagramLink, #imdbLink, #twitterLink').hide();
                    $('#actorImdbLink').attr({'href': 'javascript:void(0)', 'target': ''});
                    $('#actorImdbLink').css('cursor', 'auto');
                    $('#moreMoviesBtn').hide();
                    $('#moreMoviesContent').empty();
                    hideMoreMovies();
                } else {
                    $('#moreMoviesBtn').show();
                    $('#actorImdbLink').attr('target', '_blank');
                    $('#actorImdbLink').css('cursor', 'pointer');
                    getActorSocials($(this).attr('actorId'), $(this).attr('instagram'), $(this).attr('imdb'));
                    getActorDetails($(this).attr('actorId'), $(this).attr('imdb'));
                    getActorCredits($(this).attr('actorId'));
                }
                
                characterClicked($(this).attr('name'), $(this).find($('.characterImg')), $(this).attr('characterId'), $(this).attr('video'), characters[i].actor, $(this).attr('instagram'), $(this).attr('imdb'));
            }
        }).appendTo(characterWrapper);

        var finalActorName;

        if (characters[i].actor == 'null') {
            finalActorName = '';
        } else {
            finalActorName = characters[i].actor;
        }

        let characterImg = $('<img>', {
            class: 'characterImg lazy',
            alt: 'characterImg',
            'data-src': './images/' + characters[i].image,
            'src': './images/stock.jpg'
        }).appendTo(character);

        let dustImg = $('<img>', {
            class: 'dustImg',
            alt: 'dust',
            src: './images/dust.webp'
        }).appendTo(character);

        let characterOverlay = $('<div>', {
            class: 'characterOverlay',
        }).appendTo(character);

        let characterNameWrapper = $('<div>', {
            class: 'characterNameWrapper',
        }).appendTo(characterOverlay);

        let characterName = $('<p>', {
            class: 'characterName',
            text: characters[i].name
        }).appendTo(characterNameWrapper);

        let actorNameOverlay = $('<p>', {
            class: 'actorNameOverlay',
            text: finalActorName
        }).appendTo(characterNameWrapper);
    }
}

const getActorDetails = (actorId, imdbActorId) => {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + actorId + "?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: (data) => {
            var actorImgPath = 'https://image.tmdb.org/t/p/w500' + data.profile_path;

            $('#actorImg').attr('src', actorImgPath);
            $('#actorImdbLink').attr('href', 'https://www.imdb.com/name/' + imdbActorId);
            $('#actorImg').show();
        },
        error: (err) => {
            //console.log(err);
        }
    });
}

const showMoreMovies = () => {
    sortMovies($('#moreMoviesContent'), 'releaseDate');
    
    $('#moreMoviesContent').slideDown();
    $('#moreMoviesBtn').attr('onclick', 'hideMoreMovies()');
    $('#moreMoviesBtn').html('Hide' + '<span></span><span></span><span></span><span></span>');

    setTimeout(() => {
        $('#moreMoviesContent').css('display', 'flex');
        $('.extraMovieWrapper').css('opacity', 1);
    }, 500);
}

const hideMoreMovies = () => {
    $('#moreMoviesContent').slideUp();
    $('#moreMoviesBtn').attr('onclick', 'showMoreMovies()');
    $('#moreMoviesBtn').html('More Movies' + '<span></span><span></span><span></span><span></span>');
}

const getActorCredits = (imdbActorId) => {
    hideMoreMovies();
    $('#moreMoviesContent').empty();

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/movie_credits?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: (data) => {
            let moviesArr = data.cast;

            for (let i = 0; i < moviesArr.length; i++) {
                
                if (moviesArr[i].poster_path !== null && moviesArr[i].character !== '' && moviesArr[i].character !== undefined &&
                moviesArr[i].release_date !== undefined && moviesArr[i].release_date !== '' && moviesArr[i].genre_ids[0] !== 99 &&
                moviesArr[i].genre_ids[1] !== 99 && moviesArr[i].genre_ids[0] !== 10770 && moviesArr[i].genre_ids[1] !== 10770) {

                    moviesArr[i].title = moviesArr[i].title.replace('  ', ' ');
                    moviesArr[i].character = moviesArr[i].character.replace('  ', ' ');

                    let finalMovieTitle;
                    let finalCharacterTitle;

                    if (moviesArr[i].title.length > 40) {
                        finalMovieTitle = capitalize(moviesArr[i].title.substring(0, 40) + '...');
                    } else {
                        finalMovieTitle = capitalize(moviesArr[i].title);
                    }
                    
                    if (moviesArr[i].character.length > 40) {
                        finalCharacterTitle = capitalize(moviesArr[i].character.substring(0, 40) + '...');
                    } else {
                        finalCharacterTitle = capitalize(moviesArr[i].character);
                    }

                    moviesArr[i].vote_average = JSON.stringify(moviesArr[i].vote_average);

                    let finalVoteText;

                    if ((moviesArr[i].vote_average.length == 1 && moviesArr[i].vote_average !== '0') || moviesArr[i].vote_average == '10') {
                        finalVoteText = moviesArr[i].vote_average + '0'
                    } else {
                        finalVoteText = moviesArr[i].vote_average;
                    }

                    finalVoteText = finalVoteText.replace('.', '') + '%';

                    let date = new Date(moviesArr[i].release_date);
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();

                    let finalDateText;

                    let today = new Date();

                    if (finalVoteText == '0%' && date > today) {
                        finalVoteText = 'TBD';
                    }

                    changeMonthName(month - 1);
                    changeDayName(day);

                    finalDateText = monthName + ' ' + dayName + ' ' + year; 

                    let extraMovieWrapper = $('<div>', {
                        class: 'extraMovieWrapper',
                        value: moviesArr[i].id,
                        releaseDate: moviesArr[i].release_date,
                    }).appendTo($('#moreMoviesContent'));
                
                    let extraMovieDate = $('<p>', {
                        class: 'extraMovieDate',
                        text: finalDateText
                    }).appendTo(extraMovieWrapper);

                    let extraMovieVote = $('<p>', {
                        class: 'extraMovieVote',
                        text: finalVoteText
                    }).appendTo(extraMovieWrapper);

                    if ($(window).width() < 765) {
            
                        let extraMovieBtnWrapper = $('<div>', {
                            class: 'extraMovieBtnWrapper',
                        }).appendTo(extraMovieWrapper);
                    
                        let extraMovieBtn = $('<img>', {
                            class: 'extraMovieBtn',
                            alt: 'actor',
                            src: './images/man.webp',
                            click: function() {
                                if ($(this).parent().parent().find($('.extraMovieName')).is(':visible')) {
                                    $(this).parent().parent().find($('.extraMovieName')).hide();
                                    $(this).parent().parent().find($('.actorNameOverlay')).fadeIn();
                                } else {
                                    $(this).parent().parent().find($('.actorNameOverlay')).hide();
                                    $(this).parent().parent().find($('.extraMovieName')).fadeIn();
                                }
                            }
                        }).appendTo(extraMovieBtnWrapper);
                    }

                    let extraMovie = $('<div>', {
                        class: 'extraMovie',
                    }).appendTo(extraMovieWrapper);

                    let extraMovieLink1 = $('<a>', {
                        class: 'extraMovieLink',
                        target: '_blank',
                        rel: 'noopener',
                        href: 'https://omriknight9.github.io/my-movie-list/?movie=' + finalMovieTitle + '&value=' + moviesArr[i].id
                    }).appendTo(extraMovie);

                    let extraMovieImg = $('<img>', {
                        class: 'extraMovieImg',
                        src: 'https://image.tmdb.org/t/p/w500' + moviesArr[i].poster_path,
                        alt: 'Movie Img'
                    }).appendTo(extraMovieLink1);

                    let characterOverlay = $('<div>', {
                        class: 'characterOverlay',
                    }).appendTo(extraMovie);
            
                    let extraMovieNameWrapper = $('<div>', {
                        class: 'extraMovieNameWrapper',
                    }).appendTo(characterOverlay);
            
                    let extraMovieName = $('<p>', {
                        class: 'extraMovieName',
                        text:  finalMovieTitle
                    }).appendTo(extraMovieNameWrapper);
            
                    let actorNameOverlay = $('<p>', {
                        class: 'actorNameOverlay',
                        text: finalCharacterTitle
                    }).appendTo(extraMovieNameWrapper);
                }
            }
        },
        error: (err) => {
            console.log(err);
        }
    })
}

const sortMovies = (container, elem1) => {

    let children;
    $.each($(container), function (key, value) {
        let ids = [], obj, i, len;

        children = $(this).find('.extraMovieWrapper');

        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
			obj.idNum = new Date(elem2);

            ids.push(obj);
        }
        
        ids.sort(function (a, b) { return (b.idNum - a.idNum); });

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    setTimeout(() => {
        $('.extraMovieWrapper').slice(25).remove();
    }, 1000); 
}

const getActorSocials = (imdbActorId, instagram, imdb) => {
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/external_ids?api_key=" + tmdbKey + "&language=en-US",
        dataType: "jsonp",
        ifModified: true,

        success: (data) => {

            if (data.instagram_id == null || data.instagram_id == '') {
                if (instagram !== 'null') {
                    $('#instagramLink').attr('href', 'https://instagram.com/' + instagram);
                    $('#instagramLink').show();
                } else {
                    $('#instagramLink').attr('href', '');
                    $('#instagramLink').hide();
                }

            } else {
                $('#instagramLink').attr('href', 'https://instagram.com/' + data.instagram_id);
                $('#instagramLink').show();
            }

            if (data.imdb_id == null || data.imdb_id == '') {
                if (imdb !== 'null') {
                    $('#imdbLink').attr('href', 'https://www.imdb.com/name/' + imdb);
                    $('#imdbLink').show();
                } else {
                    $('#imdbLink').attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
                    $('#imdbLink').show();
                }

            } else {
                $('#imdbLink').attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
                $('#imdbLink').show();
            }

            if (data.twitter_id == null || data.twitter_id == '') {
                $('#twitterLink').attr('href', '');
                $('#twitterLink').hide();
            } else {
                $('#twitterLink').attr('href', 'https://twitter.com/' + data.twitter_id);
                $('#twitterLink').show();
            }

        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const characterClicked = (name, that, characterId, videoSrc, actorName) => {
    $('#marvelContainer').show();
    $('#lineMarvel').parent().show();
    $('#dcContainer').show();
    $('#lineDc').parent().show();
    $('#nonMcuContainer').show();
    $('#lineNonMcu').parent().show();
    searchVal = '';
    $('#search').val('');

    if ($('#time2').is(':visible')) {
        $('#marvelContainer .characterWrapper').css({'transform': 'translateX(0)', 'opacity': 1});
        $('#marvelContainer .characterWrapper').fadeIn(1500);
        $('.dustImg').css('left', '10rem');
        $('#time2').attr('class', '');
        $('#time2').hide();
        $('#snap2').show();
        $('#snap2').attr('class', 'infinityGauntlet');
    }

    let characterNum = that.parent().attr('characterNum');

    movieList = undefined;

    if (that.parent().parent().parent().attr('id') == 'marvelContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = marvelMovieVillainsObj[characterNum-1][characterId];
        } else {
            movieList = marvelMovieObj[characterNum - 1][characterId];
        }
    } else if(that.parent().parent().parent().attr('id') == 'dcContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = dcMovieVillainsObj[characterNum-1][characterId];
        } else {
            movieList = dcMovieObj[characterNum - 1][characterId];
        }
    } else if(that.parent().parent().parent().attr('id') == 'nonMcuContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = nonMcuMovieVillainsObj[characterNum-1][characterId];
        } else {
            movieList = nonMcuMovieObj[characterNum - 1][characterId];
        }
    }

    $('#movies').html('Movies Appeared:');

    for (let i = 0; i < movieList.length; i++) {

        if (i % 2 == 0) {

            let movieLink = $('<a>', {
                text: movieList[i].trim() + ', ',
                target: '_blank',
                rel: 'noopener',
                href: 'https://omriknight9.github.io/my-movie-list/?movie=' + movieList[i].trim() + '&value=' + movieList[i + 1].movieValue
            }).appendTo($('#movies'));
        }
    }

    setTimeout(() => {
        $('#movies a').last().html($('#movies a').last().html().replace(',', ''));
    }, 1000);

    $('.progress-container').hide();
    
    $('body').css('pointer-events', 'none');
    $('#superheroContent').hide();

    that.fadeIn();
    if (heroes == 1) {
        $('#marvelContainer .villainWrapper').fadeOut();
        $('#dcContainer .villainWrapper').fadeOut();
        $('#nonMcuContainer .villainWrapper').fadeOut();
        $('#marvelContainer .heroWrapper').fadeIn();
        $('#dcContainer .heroWrapper').fadeIn();
        $('#nonMcuContainer .heroWrapper').fadeIn();
        
    } else {
        $('#marvelContainer .heroWrapper').fadeOut();
        $('#dcContainer .heroWrapper').fadeOut();
        $('#nonMcuContainer .heroWrapper').fadeOut();
        $('#marvelContainer .villainWrapper').fadeIn();
        $('#dcContainer .villainWrapper').fadeIn();
        $('#nonMcuContainer .villainWrapper').fadeIn();
    }

    $('body').css('pointer-events', 'all');

    $('.progress-container').show();
    if (characterId < 2000) {
        getCharacterInfo(characterId, videoSrc, actorName);
    } else {
        showContent(name, videoSrc, actorName);
    }
}

const showContent = (name, videoSrc, actorName) => {
    $('#fullName, #work, #firstAppearance, #publisher').hide();
    $('#characterName').html('Name: ' + name);
    $('#characterName').show();
    $('#superheroContent').show();
    $('#characterVideo').attr('src', 'https://www.youtube.com/embed/' + videoSrc + '?rel=0&enablejsapi=1');

    if (actorName == 'null') {
        $('#actorName').html('');
        $('#actorName').hide();
    } else {
        $('#actorName').html('Played By: ' + actorName);
        $('#actorName').show();
    }

    document.querySelector('#superheroContent').scrollIntoView({ behavior: 'smooth' });
}

const getCharacterInfo = (searchVal, videoSrc, actorName) => {

    $.ajax({
        url: searchUrl + accessToken + '/' + searchVal,
        type: 'GET',
        success: (data) => { 
            $('#characterVideo').attr('src', 'https://www.youtube.com/embed/' + videoSrc + '?rel=0&enablejsapi=1');

            $('#fullName').show();

            if (actorName == 'null') {
                $('#actorName').html('');
                $('#actorName').hide();
            } else {
                $('#actorName').html('Played By: ' + actorName);
                $('#actorName').show();
            }

            if (data.biography['full-name'] !== data.name) {
                if (data.biography['full-name'] == '') {
                    $('#fullName').hide();
                } else {
                    $('#fullName').html('Full Name: ' + data.biography['full-name']);
                    $('#fullName').show();
                }
                $('#characterName').html('Name: ' + data.name);
                $('#characterName').show();
            } else {
                $('#characterName').hide();
                $('#fullName').html('Name: ' + data.name);
            }

            if (data.biography['first-appearance'] !== null && data.biography['first-appearance'] !== undefined && data.biography['first-appearance'] !== '-') {
                $('#firstAppearance').html('First Appearance: ' + data.biography['first-appearance']);
                $('#firstAppearance').show();
            } else {
                $('#firstAppearance').html('');
                $('#firstAppearance').hide();
            }

            if (data.biography['publisher'] !== null && data.biography['publisher'] !== undefined && data.biography['publisher'] !== '-') {
                $('#publisher').html('Publisher: ' + data.biography['publisher']);
                $('#publisher').show();
            } else {
                $('#firstAppearance').html('');
                $('#firstAppearance').hide();
            }

            if (data.work['occupation'] !== null && data.work['occupation'] !== undefined && data.work['occupation'] !== '-') {
                $('#work').html('Occupation: ' + data.work['occupation']);
                $('#work').show();
            } else {
                $('#work').html('');
                $('#work').hide();
            }

            $('#superheroContent').show();
            document.querySelector('#superheroContent').scrollIntoView({ behavior: 'smooth' });

        },
        error: (xhr, ajaxOptions, thrownError) => {
            if(xhr.status == 404) {
                console.log(thrownError);
            }
        }
    });
}

const goToTimeline = (type) => {

    if ($(window).width() < 765) {
        $('#header').hide();
    }

    $('.infinityGauntlet, #signUpBtn, #userNameHeader, .menuOpenWrapper').hide();
    $('.spinnerWrapper').show();
    $('body').css('pointer-events', 'none');
    // $('footer').hide();
    $('#bottomSection').hide();
    goToTop();
    $('#dcTimeline, #mcuTimeline, .searchContainer').hide();

    let arr;

    if (type == 1) {
        arr = mcuTimelineArr;
        $('#mcuTimeline').show();
        if (!mcuTimelineShown) {
            $.get('./lists/mcuTimeline.txt', (data) => {
                arr.push(JSON.parse(data));
                buildTimeline($('#mcuTimelineContent'), arr, type);
            });
            mcuTimelineShown = true;
        } else {
            buildTimeline($('#mcuTimelineContent'), arr, type);
        }

    } else {
        arr = dcTimelineArr;
        $('#dcTimeline').show();

        if (!dcTimelineShown) {
            $.get('./lists/dcTimeline.txt', (data) => {
                arr.push(JSON.parse(data));
                buildTimeline($('#dcTimelineContent'), arr, type);
                dcTimelineShown = true;
            });
        } else {
            buildTimeline($('#dcTimelineContent'), arr, type);
        }
    }

    $('html, body').css({'background': 'url(./images/background9.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    $('#mainContent').hide();
}

const buildTimeline = (wrapper, arr, type) => {

    let movies = arr[0].movies;

    setTimeout(() => {
        for (let i = 0; i < movies.length; i++) {

            let date = new Date(movies[i].date);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let yearToShow = date.getFullYear();

            changeMonthName(month - 1);
            changeDayName(day);
    
            let dateForShow = monthName + ' ' + dayName + ' ' + yearToShow; 
    
            let timelineMovieWrapper = $('<div>', {
                class: 'timelineMovieWrapper'
            }).appendTo(wrapper);
    
            let timelineMovieName = $('<p>', {
                class: 'timelineMovieName',
                text: movies[i].name
            }).appendTo(timelineMovieWrapper);
    
            let timelineMovieDate = $('<p>', {
                class: 'timelineMovieDate',
                text: dateForShow
            }).appendTo(timelineMovieWrapper);
    
            let timelineMovieLink = $('<a>', {
                class: 'timelineMovieLink',
                rel: 'noopener',
                href: 'https://omriknight9.github.io/my-movie-list/?movie=' + movies[i].name.trim() + '&value=' + movies[i].value,
                target: '_blank'
            }).appendTo(timelineMovieWrapper);
    
            let timelineMovieImg = $('<img>', {
                class: 'timelineMovieImg',
                src: './images/' + movies[i].image,
                alt: 'movie img'
            }).appendTo(timelineMovieLink);
        }

        if ($('.timelineMovieWrapper').length % 2 == 0) {
            if (type == 1) {
                $('.timelineMovieWrapper').parent().addClass('marvelEvenMovieWrapper');
            } else {
                $('.timelineMovieWrapper').parent().addClass('dcEvenMovieWrapper');
            }
    
        } else {
            if (type == 1) {
                $('.timelineMovieWrapper').parent().addClass('marvelOddMovieWrapper');
            } else {
                $('.timelineMovieWrapper').parent().addClass('dcOddMovieWrapper');
            }
        }

        $('.spinnerWrapper').hide();
        $('body').css('pointer-events', 'all');
        // $('footer').css('display', 'flex');
        $('#bottomSection').show();

    }, 1000);

    setTimeout(() => {
        window.onscroll = function () {
            barScroll();
            scrollBtn();
            lazyload();
            this.oldScroll = this.scrollY;

            if ($(window).width() > 765) {

                $('.moveLine').each(function(i) {
                    if ($(this).is(':visible')) {
                        var bottom_of_object = $(this).offset().top + $(this).outerHeight() + 100;
                        var bottom_of_window = $(window).scrollTop() + $(window).height();
                        if (bottom_of_window > bottom_of_object && !$(this).hasClass('moveUp')) {
                            $(this).addClass('moveUp');
                            if ($(this).attr('name') == 'nonMcuLineWrapper') {
                                $('#nonMcuContainer').addClass('fullOpacity');
                            } else if ($(this).attr('name') == 'dcLineWrapper') {
                                $('#dcContainer').addClass('fullOpacity');
                            }
                        }
                    }
                });
            }
            
            $('.timelineMovieWrapper').each( function(i) {
                var bottom_of_object = $(this).offset().top + $(this).outerHeight() - 400;
                var bottom_of_window = $(window).scrollTop() + $(window).height();

                if( bottom_of_window > bottom_of_object ){
                    $(this).animate({'opacity':'1'});
                    $(this).css({'transform': 'scale(1)'}, 5400);   
                }
            }); 
        };
    }, 1500);
}

const villainsOrHeroes = (type) => {
	
	$('#marvelContainer').show();
    $('#lineMarvel').parent().show();
    $('#dcContainer').show();
    $('#lineDc').parent().show();
    $('#nonMcuContainer').show();
    $('#lineNonMcu').parent().show();
    searchVal = '';
    $('#search').val('');

    if (userLoggedIn) {
        $('.menuOpenWrapper').hide();
    }

    $('#superheroContent').hide();

	if(type == 1) {
        heroes = 2;
		$('#mainContent').attr('class', 'mainVillains');  
        $('.heroWrapper .dustImg').css('left', '-10rem');
        $('.heroWrapper').css({'transform': 'translateX(60px)', 'opacity': 0});
        $('#snap2, #time2').hide();
		
		if (!villainsShown) {
			$.get('./lists/marvelVillains.txt', (data) => {
				marvelVillainsArr.push(JSON.parse(data));
				setTimeout(() => {
					buildCharacters($('#marvelContainer'), marvelVillainsArr, 2);
				}, 500);
			});
		
			$.get('./lists/‏‏marvelMovieVillainsObj.txt', (data) => {
				marvelMovieVillainsObj = JSON.parse(data);
				marvelMovieVillainsObj = marvelMovieVillainsObj.movies;
			});

			$.get('./lists/dcVillains.txt', (data) => {
				dcVillainsArr.push(JSON.parse(data));
				setTimeout(() => {
					buildCharacters($('#dcContainer'), dcVillainsArr, 2);
				}, 500);
			});
		
			$.get('./lists/dcMovieVillainsObj.txt', (data) => {
				dcMovieVillainsObj = JSON.parse(data);
				dcMovieVillainsObj = dcMovieVillainsObj.movies;
			});

			$.get('./lists/‏‏nonMcuVillains.txt', (data) => {
				nonMcuVillainsArr.push(JSON.parse(data));
				setTimeout(() => {
					buildCharacters($('#nonMcuContainer'), nonMcuVillainsArr, 2);
				}, 500);
			});
		
			$.get('./lists/nonMcuMovieVillainsObj.txt', (data) => {
				nonMcuMovieVillainsObj = JSON.parse(data);
				nonMcuMovieVillainsObj = nonMcuMovieVillainsObj.movies;
			});

			villainsShown = true;
		} else {
            $('.heroWrapper .dustImg').css('left', '-10rem');
            $('.heroWrapper').css({'transform': 'translateX(60px)', 'opacity': 0});
		}
		
	} else {
        heroes = 1;

        $('#mainContent').attr('class', 'mainHeroes');  
        $('.villainWrapper .dustImg').css('left', '-10rem');
        $('.villainWrapper').css({'transform': 'translateX(60px)', 'opacity': 0});
        if (userLoggedIn && favorites) {
            $('#favoritesBtn').attr('onclick', 'showFavorites(1)');
            $('#favoritesBtn').html('Show Favorites');
            $('.addToFavoritesBtn').show();
            favorites = false;
        }
	}
    
    setTimeout(() => {
		if(type == 1) {
            if (userLoggedIn) {
                $('.characterBtn').removeClass('characterBtnLoggedIn');
            }
            $('.villainWrapper').show();
            $('.villainWrapper').css('opacity', 1);
            $('.heroWrapper').css({'transform': 'translateX(0)', 'opacity': 0}).hide();
			$('#headerLogoMarvel').css({'background': 'url(./images/thanos.webp) no-repeat 50% 50%', 'background-size': '70px 60px'});
			$('#headerLogoDc').css({'background': 'url(./images/joker.webp) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#headerLogoNonMcu').css({'background': 'url(./images/magneto.webp) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#marvelHeaderImg').attr('src', './images/thanos.webp');
			$('#nonMcuHeaderImg').attr('src', './images/magneto.webp');
			$('#dcHeaderImg').attr('src', './images/joker.webp');
			$('html, body').css({'background': 'url(./images/background5.jpg) no-repeat center center fixed', 'background-size': 'cover'});
            $('#search').attr('placeholder', 'Search Villain');
            $('.heroWrapper .dustImg').css('left', '10rem');
 
		} else {

            if (userLoggedIn) {
                $('.characterBtn').addClass('characterBtnLoggedIn');
                $('.addToFavoritesBtnLoggedIn').show();
            }
            if (userLoggedIn) {
                $('.menuOpenWrapper').show();
            }
            $('#snap2').show();
            $('.heroWrapper').show();
            $('.heroWrapper').css('opacity', 1);
            $('.villainWrapper').css({'transform': 'translateX(0)', 'opacity': 0}).hide();;
			$('#headerLogoMarvel').css({'background': 'url(./images/ironman.webp) no-repeat 50% 50%', 'background-size': '70px 60px'});
			$('#headerLogoDc').css({'background': 'url(./images/superman.webp) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#headerLogoNonMcu').css({'background': 'url(./images/wolverine.webp) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#marvelHeaderImg').attr('src', './images/ironman.webp');
			$('#nonMcuHeaderImg').attr('src', './images/wolverine.webp');
			$('#dcHeaderImg').attr('src', './images/superman.webp');
			$('html, body').css({'background': 'url(./images/background11.jpg) no-repeat center center fixed', 'background-size': 'cover'});
            $('#search').attr('placeholder', 'Search Hero');
            $('.villainWrapper .dustImg').css('left', '10rem');
		}
    }, 1500);
}