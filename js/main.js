
const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';
const movieActorsUrl = "https://api.themoviedb.org/3/person/";
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
                $('main, #snap, #bottomSection').fadeIn();
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
            $('#marvelContainer, #dcContainer, #nonMcuContainer').show();
            $('#lineMarvel, #lineDc, #lineNonMcu').parent().show();

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

                $('<img>', {
                    class: 'resultImg',
                    alt: 'character',
                    src: $(value).find('.characterImg').attr('src')
                }).appendTo(result);

                $('<p>', {
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

    $('#superheroContent, #signUpFormWrapper, #myAccountWrapper').hide();
    if ($('#mainContent').hasClass('mainHeroes')) {
        $('html, body').css({'background': 'url(./images/background11.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    } else {
        $('html, body').css({'background': 'url(./images/background5.jpg) no-repeat center center fixed', 'background-size': 'cover'});
    }

    $('.infinityGauntlet, #marvelContainer, #dcContainer, #mainContent, .searchContainer').show();
    $('#lineMarvel, #lineDc').parent().show();
    $('#mcuTimelineContent, #dcTimelineContent, #signUpFormWrapper, #myAccountWrapper').empty();
    searchVal = '';
    $('#search').val('');
    $('#mcuTimeline, #dcTimeline').hide();

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
        $('#marvelContainer .villainWrapper, #dcContainer .villainWrapper').fadeOut();
        $('#marvelContainer .heroWrapper, #dcContainer .heroWrapper').fadeIn();
    } else {
        $('#snap2, #time2').hide();
        $('#marvelContainer .heroWrapper, #dcContainer .heroWrapper').fadeOut();
        $('#marvelContainer .villainWrapper, #dcContainer .villainWrapper').fadeIn();
    }
}

const loadJson = () => {
    $.get('./lists/marvelMovieObj.txt', (data) => {
        marvelMovieObj = JSON.parse(data).movies;
    });

    $.get('./lists/dcMovieObj.txt', (data) => {
        dcMovieObj = JSON.parse(data).movies;
    });

    $.get('./lists/nonMcuMovieObj.txt', (data) => {
        nonMcuMovieObj = JSON.parse(data).movies;
    });

    $.get('./lists/marvelHeroes.txt', (data) => {
        setTimeout(() => {
            buildCharacters(1, $('#marvelContainer'), JSON.parse(data), 1);
        }, 500);
    });

    $.get('./lists/dcHeroes.txt', (data) => {
        setTimeout(() => {
            buildCharacters(2, $('#dcContainer'), JSON.parse(data), 1);
        }, 500);
    });

    $.get('./lists/nonMcuHeroes.txt', (data) => {
        setTimeout(() => {
            buildCharacters(1, $('#nonMcuContainer'), JSON.parse(data), 1);
        }, 500);
    });
}

const buildCharacters = (type, wrapper, arr, num) => {
    let imgPath;

    switch (type) {
        case 1:
            imgPath = 'heroes/marvel';
            break;
        case 2:
            imgPath = 'heroes/dc';
            break;
        case 3:
            imgPath = 'villains/marvel';
            break;
        case 4:
            imgPath = 'villains/dc';
            break;
        default:
            break;
    }

    let characters = arr.characters;
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
            
            $('<img>', {
                class: 'characterBtn',
                alt: 'actor',
                src: './images/man.png',
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
            id: characters[i].id,
            name: characters[i].name,
            actor: characters[i].actor,
            actorId: characters[i].actorId,
            click: function() {
                $('#moreMoviesBtn').show();
                $('#actorImdbLink').attr('target', '_blank');
                $('#actorImdbLink').css('cursor', 'pointer');
                getActorDetails($(this).attr('actorId'));
                characterClicked($(this).attr('name'), $(this).find($('.characterImg')), $(this).attr('id'), characters[i].actor);
            }
        }).appendTo(characterWrapper);

        let finalActorName;

        if (characters[i].actor == 'null') {
            finalActorName = '';
        } else {
            finalActorName = characters[i].actor;
        }

        let trimmed = characters[i].name.replace(/[ .-]/g,'');
        let restOfStr = trimmed.slice(1);
        let finalSrc = imgPath + '/' + trimmed.charAt(0).toLowerCase() + restOfStr + '.jpg';

        $('<img>', {
            class: 'characterImg lazy',
            alt: 'characterImg',
            'data-src': './images/' + finalSrc,
            'src': './images/stock.jpg'
        }).appendTo(character);

        $('<img>', {
            class: 'dustImg',
            alt: 'dust',
            src: './images/dust.png'
        }).appendTo(character);

        let characterOverlay = $('<div>', {
            class: 'characterOverlay',
        }).appendTo(character);

        let characterNameWrapper = $('<div>', {
            class: 'characterNameWrapper',
        }).appendTo(characterOverlay);

        $('<p>', {
            class: 'characterName',
            text: characters[i].name
        }).appendTo(characterNameWrapper);

        $('<p>', {
            class: 'actorNameOverlay',
            text: finalActorName
        }).appendTo(characterNameWrapper);
    }
}

const getActorDetails = (actorId) => {
    $.get(movieActorsUrl + actorId + "?api_key=" + tmdbKey + "&language=en-US&append_to_response=credits,external_ids,images", (data) => {
        var actorImgPath = 'https://image.tmdb.org/t/p/w500' + data.profile_path;
        $('#actorImg').attr('src', actorImgPath);
        $('#actorImg').attr('filePath', data.profile_path);
        $('#actorImg').show();

        if (data.external_ids.instagram_id == null || data.external_ids.instagram_id == '') {
            $('#instagramLink').attr('href', '');
            $('#instagramLink').hide();
        } else {
            $('#instagramLink').attr('href', 'https://instagram.com/' + data.external_ids.instagram_id);
            $('#instagramLink').show();
        }

        if (data.external_ids.imdb_id == null || data.external_ids.imdb_id == '') {
            $('#imdbLink').hide();
        } else {
            $('#imdbLink').attr('href', 'https://www.imdb.com/name/' + data.external_ids.imdb_id);
            $('#imdbLink').show();
            $('#actorImdbLink').attr('href', 'https://www.imdb.com/name/' + data.external_ids.imdb_id);
        }

        if (data.external_ids.twitter_id == null || data.external_ids.twitter_id == '') {
            $('#twitterLink').attr('href', '');
            $('#twitterLink').hide();
        } else {
            $('#twitterLink').attr('href', 'https://twitter.com/' + data.external_ids.twitter_id);
            $('#twitterLink').show();
        }

        buildCredits(data.credits.cast);
        buildImages(data.images.profiles);
    })
}

const buildImages = (images) => {
    let finalLength;

    if(images.length > 7) {
        finalLength = 7;
    } else {
        finalLength = images.length
    }

    for (let i = 0; i < finalLength; i++) {
        if (images[i].file_path !== $('#actorImg').attr('filePath')) {
            $('<img>', {
                class: 'actorProfileImg',
                src: 'https://image.tmdb.org/t/p/w500' + images[i].file_path,
                alt: 'actorProfileImg'
            }).appendTo($('#actorImages'))
        }
    }
}

const buildCredits = (credits) => {
    let moviesArr = credits;

    for (let i = 0; i < moviesArr.length; i++) {
        if (moviesArr[i].poster_path !== null && moviesArr[i].character !== '' && moviesArr[i].character !== undefined &&
            moviesArr[i].release_date !== undefined && moviesArr[i].release_date !== '') {
            moviesArr[i].title = moviesArr[i].title.replace('  ', ' ');

            if(moviesArr[i].character !== null) {
                moviesArr[i].character = moviesArr[i].character.replace('  ', ' ');
            } else {
                moviesArr[i].character = 'Unknown';
            }
            
            let finalMovieTitle;
            let finalCharacterTitle;

            if (moviesArr[i].title.length > 35) {
                finalMovieTitle = capitalize(moviesArr[i].title.substring(0, 35) + '...');
            } else {
                finalMovieTitle = capitalize(moviesArr[i].title);
            }
            
            if (moviesArr[i].character.length > 35) {
                finalCharacterTitle = capitalize(moviesArr[i].character.substring(0, 35) + '...');
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
        
            $('<p>', {
                class: 'extraMovieDate',
                text: finalDateText
            }).appendTo(extraMovieWrapper);

            $('<p>', {
                class: 'extraMovieVote',
                text: finalVoteText
            }).appendTo(extraMovieWrapper);

            if ($(window).width() < 765) {
                let extraMovieBtnWrapper = $('<div>', {
                    class: 'extraMovieBtnWrapper',
                }).appendTo(extraMovieWrapper);
            
                $('<img>', {
                    class: 'extraMovieBtn',
                    alt: 'actor',
                    src: './images/man.png',
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

            $('<img>', {
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
    
            $('<p>', {
                class: 'extraMovieName',
                text:  finalMovieTitle
            }).appendTo(extraMovieNameWrapper);
    
            $('<p>', {
                class: 'actorNameOverlay',
                text: finalCharacterTitle
            }).appendTo(extraMovieNameWrapper);
        }
    }
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

const characterClicked = (name, that, characterId, actorName) => {
    $('body').css({'opacity': '.2', 'pointer-events': 'none'});
    $('.siteLink').remove();
    $('#tvShows').hide();
    $('#marvelContainer, #dcContainer, #nonMcuContainer').show();
    $('#lineMarvel, #lineDc, #lineNonMcu').parent().show();
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

    movieList = undefined;

    if (that.parent().parent().parent().attr('id') == 'marvelContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = marvelMovieVillainsObj;
        } else {
            movieList = marvelMovieObj;
        }
    } else if(that.parent().parent().parent().attr('id') == 'dcContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = dcMovieVillainsObj;
        } else {
            movieList = dcMovieObj;
        }
    } else if(that.parent().parent().parent().attr('id') == 'nonMcuContainer') {
        if (that.parent().parent().hasClass('villainWrapper')) {
            movieList = nonMcuMovieVillainsObj;
        } else {
            movieList = nonMcuMovieObj;
        }
    }

    for (let w = 0; w < movieList.length; w++) {
        if (movieList[w].id == characterId) {
            movieList = movieList[w].movieList;
        } 
    }

    for (let j = 0; j < movieList.length; j++) {
        if (movieList[j].tvShowValue !== undefined) {
            $('#tvShows').show();
            break;
        }
    }

    for (let a = 0; a < movieList.length; a++) {
        if ('movieValue' in movieList[a]) {
            $('#movies').show();
            break;
        } else {
            $('#movies').hide(); 
        }
    }

    for (let i = 0; i < movieList.length; i++) {
        let link;
        let containerToAppend;
        if (movieList[i].movieValue) {
            link = 'https://omriknight9.github.io/my-movie-list/?movie=' + movieList[i].name + '&value=' + movieList[i].movieValue;
            containerToAppend = $('#movies');
        } else if (movieList[i].tvShowValue) {
            link = 'https://omriknight9.github.io/my-movie-list/?tvShow=' + movieList[i].name + '&value=' + movieList[i].tvShowValue
            containerToAppend = $('#tvShows');
        }

        $('<a>', {
            text: movieList[i].name + ', ',
            class: 'siteLink',
            target: '_blank',
            rel: 'noopener',
            href: link
        }).appendTo(containerToAppend);
    }

    setTimeout(() => {
        if ($('#movies').is(':visible')) {
            $('#movies a').last().html($('#movies a').last().html().replace(',', ''));
        }
        if ($('#tvShows').is(':visible')) {
            $('#tvShows a').last().html($('#tvShows a').last().html().replace(',', ''));
        }

        $('body').css({'opacity': '1', 'pointer-events': 'all'});
    }, 1000);

    $('.progress-container').hide();
    $('#superheroContent').hide();

    that.fadeIn();
    if (heroes == 1) {
        $('#marvelContainer .villainWrapper, #dcContainer .villainWrapper, #nonMcuContainer .villainWrapper').fadeOut();
        $('#marvelContainer .heroWrapper, #dcContainer .heroWrapper, #nonMcuContainer .heroWrapper').fadeIn();
        
    } else {
        $('#marvelContainer .heroWrapper, #dcContainer .heroWrapper, #nonMcuContainer .heroWrapper').fadeOut();
        $('#marvelContainer .villainWrapper, #dcContainer .villainWrapper, #nonMcuContainer .villainWrapper').fadeIn();
    }

    $('.progress-container').show();
    $('#moreMoviesContent, #actorImages').empty();
    hideMoreMovies();
    getCharacterInfo(name, actorName);
}

const getCharacterInfo = (name, actorName) => {
    $('#fullName').html('Full Name: ' + name);
    $('#actorName').html('Played By: ' + actorName);
    $('#superheroContent').show();
    document.querySelector('#superheroContent').scrollIntoView({ behavior: 'smooth' });
}

const goToTimeline = (type) => {
    if ($(window).width() < 765) {
        $('#header').hide();
    }

    $('.infinityGauntlet, #signUpBtn, #userNameHeader, .menuOpenWrapper, #bottomSection, #dcTimeline, #mcuTimeline, .searchContainer, #mainContent').hide();
    $('.spinnerWrapper').show();
    $('body').css('pointer-events', 'none');
    goToTop();
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
    
            $('<p>', {
                class: 'timelineMovieName',
                text: movies[i].name
            }).appendTo(timelineMovieWrapper);
    
            $('<p>', {
                class: 'timelineMovieDate',
                text: dateForShow
            }).appendTo(timelineMovieWrapper);
    
            let timelineMovieLink = $('<a>', {
                class: 'timelineMovieLink',
                rel: 'noopener',
                href: 'https://omriknight9.github.io/my-movie-list/?movie=' + movies[i].name.trim() + '&value=' + movies[i].value,
                target: '_blank'
            }).appendTo(timelineMovieWrapper);
    
            $('<img>', {
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
	$('#marvelContainer, #dcContainer, #nonMcuContainer').show();
    $('#lineMarvel, #lineDc, #lineNonMcu').parent().show();
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
				setTimeout(() => {
					buildCharacters(3, $('#marvelContainer'), JSON.parse(data), 2);
				}, 500);
			});
		
            $.get('./lists/marvelMovieVillainsObj.txt', (data) => {
                marvelMovieVillainsObj = JSON.parse(data).movies;
			});

			$.get('./lists/dcVillains.txt', (data) => {
				setTimeout(() => {
					buildCharacters(4, $('#dcContainer'), JSON.parse(data), 2);
				}, 500);
			});
		
			$.get('./lists/dcMovieVillainsObj.txt', (data) => {
                dcMovieVillainsObj = JSON.parse(data).movies;
			});

            $.get('./lists/nonMcuVillains.txt', (data) => {
				setTimeout(() => {
					buildCharacters(3, $('#nonMcuContainer'), JSON.parse(data), 2);
				}, 500);
			});
		
			$.get('./lists/nonMcuMovieVillainsObj.txt', (data) => {
                nonMcuMovieVillainsObj = JSON.parse(data).movies;
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
			$('#headerLogoMarvel').css({'background': 'url(./images/thanos.png) no-repeat 50% 50%', 'background-size': '70px 60px'});
			$('#headerLogoDc').css({'background': 'url(./images/joker.png) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#headerLogoNonMcu').css({'background': 'url(./images/magneto.png) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#marvelHeaderImg').attr('src', './images/thanos.png');
			$('#nonMcuHeaderImg').attr('src', './images/magneto.png');
			$('#dcHeaderImg').attr('src', './images/joker.png');
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
			$('#headerLogoMarvel').css({'background': 'url(./images/ironman.png) no-repeat 50% 50%', 'background-size': '70px 60px'});
			$('#headerLogoDc').css({'background': 'url(./images/superman.png) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#headerLogoNonMcu').css({'background': 'url(./images/wolverine.png) no-repeat 50% 50%', 'background-size': '60px 60px'});
			$('#marvelHeaderImg').attr('src', './images/ironman.png');
			$('#nonMcuHeaderImg').attr('src', './images/wolverine.png');
			$('#dcHeaderImg').attr('src', './images/superman.png');
			$('html, body').css({'background': 'url(./images/background11.jpg) no-repeat center center fixed', 'background-size': 'cover'});
            $('#search').attr('placeholder', 'Search Hero');
            $('.villainWrapper .dustImg').css('left', '10rem');
		}
    }, 1500);
}
