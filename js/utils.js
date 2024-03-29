
let tID = {
    snap: null,
    time: null
};

const barScroll = () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}

const capitalize = (str) => {
    try {
        if (str.includes(' and ')) {
            str = str.replace(' and ', ' And ');
        } else if (str.includes('(and ')) {
            str = str.replace('(and ', '(And ');
        } else if(str == undefined || str == '') {
            return;
        }
    
        str = str.split(' ');
    
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
    
        return str.join(" ");
    } catch (error) {

    }
}

function scrollBtn() {
    if ($(this).scrollTop() > 550) {
        $('#upBtnWrapper').fadeIn();
    }
    else {
        $('#upBtnWrapper').fadeOut();
    }
}

const goToTop = () =>  {
    $('html,body').animate({ scrollTop: 0 }, 800);
}

const changeMonthName = (month) =>  {
    switch (month) {
        case 0: {
            monthName = 'Jan';
            break;
        }
        case 1: {
            monthName = 'Feb';
            break;
        }
        case 2: {
            monthName = 'March';
            break;
        }
        case 3: {
            monthName = 'April';
            break;
        }
        case 4: {
            monthName = 'May';
            break;
        }
        case 5: {
            monthName = 'June';
            break;
        }
        case 6: {
            monthName = 'July';
            break;
        }
        case 7: {
            monthName = 'Aug';
            break;
        }
        case 8: {
            monthName = 'Sep';
            break;
        }
        case 9: {
            monthName = 'Oct';
            break;
        }
        case 10: {
            monthName = 'Nov';
            break;
        }
        case 11: {
            monthName = 'Dec';
            break;
        }  
    } 
}

const changeDayName = (day) =>  {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            dayName = day + 'st';
            break;
        }
        case 2:
        case 22: {
            dayName = day + 'nd';
            break;
        }
        case 3:
        case 23: {
            dayName = day + 'rd';
            break;
        }

        default: {
            dayName = day + 'th';
        }
    }
}

const animateScript = (e, type) =>  {
    $('body').css('pointer-events', 'none');
    const audio = e.target.querySelector('audio');
    clearInterval(tID[e.target.id]);
    audio.currentTime = 0; 
    const startPosition = 0;
    let position = startPosition;
    const fullImgWidth = 3840;
    const diff = 80;
    const interval = 30;
    audio.play();

    tID[e.target.id] = setInterval ( () => {
        e.target.style.backgroundPosition = 
        `-${position}px 0px`; 

        if (position < fullImgWidth) { 
            position = position + diff;
        } else { 
            position = startPosition;
            clearInterval(tID[e.target.id]);
        }
    }, interval);

    setTimeout(() => {
        villainsOrHeroes(type);
    }, 1500);

    setTimeout(() => {
        if (type == 1) {
            $('#snap').attr('class', '');
            $('#snap').hide();
            $('#time').show();
            $('#time').attr('class', 'infinityGauntlet');
        } else {
            $('#time').attr('class', '');
            $('#time').hide();
            $('#snap').show();
            $('#snap').attr('class', 'infinityGauntlet');
        }
        $('body').css('pointer-events', 'all');
    }, 2500);
}

function animateScript2 (e, type)  {
    $('body').css('pointer-events', 'none');
    const audio = e.target.querySelector('audio');
    clearInterval(tID[e.target.id]);
    audio.currentTime = 0; 
    const startPosition = 0;
    let position = startPosition;
    const fullImgWidth = 3840;
    const diff = 80;
    const interval = 30;
    audio.play();

    tID[e.target.id] = setInterval ( () => {
        e.target.style.backgroundPosition = 
        `-${position}px 0px`; 

        if (position < fullImgWidth) { 
            position = position + diff;
        } else { 
            position = startPosition;
            clearInterval(tID[e.target.id]);
        }
    }, interval);

    setTimeout(() => {
        dustHeroes(type);
    }, 1500);

    setTimeout(() => {
        if (type == 1) {
            $('#snap2').attr('class', '');
            $('#snap2').hide();
            $('#time2').show();
            $('#time2').attr('class', 'infinityGauntlet');
        } else {
            $('#time2').attr('class', '');
            $('#time2').hide();
            $('#snap2').show();
            $('#snap2').attr('class', 'infinityGauntlet');
        }
        $('body').css('pointer-events', 'all');
    }, 2500);
}

const BackColor = (elem, color) => {
    $(elem).css('border', color);
}

const hasClass = (elem, className) => {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

const addClass = (elem, className) => {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

const toggleClass = (elem, className) => {
    let newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}
