'use strict'
var dankExtention = {
    memeLength: {
        'mission-complete': 8000,
        'do-it': 1400
    },
    memeStateFor: {
        'mission-complete': false,
        'do-it': false
    },
    triggerMeme: function ( memeName, pictureFormat ) {
        let that = this;
        // simple check so that sound are not overlappping
        if( that.memeStateFor[ memeName ] ) {
            return;
        }

        // seatching the URL's from the extention to the page's context 
        let musicURL = chrome.extension.getURL('/resources/' + memeName + '/music.mp3'  );
        let pictureURL = chrome.extension.getURL('/resources/' + memeName + '/picture.' + pictureFormat )
        let music = new Audio(musicURL);

        that.memeStateFor[memeName]= true;

        //reusing the modal
        $( '.' + memeName ).remove();
        $( 'body' ).append(
            `<div class="meme-land ${ memeName }">
                <div class="wav"><img src="${ pictureURL }" alt="" /></div>
            </div>`
        );

        // showing the modal
        $( '.' + memeName ).addClass( 'is-visible' );
        music.play();
        
        // hiding the modal when the music/audio stops
        setTimeout( function () {
            $( '.' + memeName ).removeClass( 'is-visible' );
            music.pause();
            music.currentTime = 0;
            that.memeStateFor[ memeName ] = false;
        }, that.memeLength[ memeName ] );

    },
    // the attaching of events
    init: function () {
        let that = this;
        $( document ).on( 'click' , '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton, .TaskRowCompletionStatus-checkbox.TaskRowCompletionStatus-checkbox--incomplete' , function () {
            that.triggerMeme( 'mission-complete', 'png' );
        });

        let hoverMemeTimeOut = {};

        // delegate events for hover-in and hover-out
        $('body').on({
            mouseenter: function() {
                hoverMemeTimeOut = setTimeout(function () {
                    that.triggerMeme( 'do-it', 'gif' );
                }, 2000);
            },
            mouseleave: function() {
                clearTimeout(hoverMemeTimeOut);
            }
        }, '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton');
    }
};

// initializing the script only once
if ( ! window.dankExtInitialized ) {
    window.dankExtInitialized = true;
    dankExtention.init();
}