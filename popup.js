'use strict'
var musicURL = chrome.extension.getURL('/mission-complete/music.mp3');
var music = new Audio(musicURL);
var disabled = false;

$('.mission-complete').remove();
$('body').append(
    `<div class="mission-complete">
        <div class="wav"><img src="${chrome.extension.getURL('/mission-complete/picture.png')}" alt="" /></div>
    </div>`
);

$(document).on('click', '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton', function () {

    if(disabled) {
        return;
    }

    // Show it
    $('.mission-complete').addClass('is-visible');
    // Play it
    music.play();
    // But dont bug it
    disabled = true;

    setTimeout(function(){
        $('.mission-complete').removeClass('is-visible');
        music.pause();
        music.currentTime = 0;

        disabled = false;
    }, 8000);
});