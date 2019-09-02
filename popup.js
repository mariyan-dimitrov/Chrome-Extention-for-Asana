'use strict'
var dankExtention = {
    memeLength: {
        'mission-complete': 8000,
    },
    memeStateFor: {
        'mission-complete': false,
    },
    triggerMeme: function ( memeName ) {
        let that = this;
        // simple check so that sound are not overlappping
        if( that.memeStateFor[ memeName ] ) {
            return;
        }

        // seatching the URL's from the extention to the page's context 
        let musicURL = chrome.extension.getURL('/resources/' + memeName + '/music.mp3');
        let pictureURL = chrome.extension.getURL('/resources/' + memeName + '/picture.png')
        let music = new Audio(musicURL);

        that.memeStateFor[memeName]= true;

        //reusing the modal
        $( '#' + memeName ).remove();
        $( 'body' ).append(
            `<div id="${ memeName }">
                <div class="wav"><img src="${ pictureURL }" alt="" /></div>
            </div>`
        );

        $( '#' + memeName ).addClass( 'is-visible' );
        music.play();
    
        setTimeout( function () {
            $( '#' + memeName ).removeClass( 'is-visible' );
            music.pause();
            music.currentTime = 0;
            that.memeStateFor[ memeName ] = false;
        }, that.memeLength[ memeName ] );

    },
    init: function () {
        let that = this;
        $( document ).on( 'click' , '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton, .TaskRowCompletionStatus-checkbox.TaskRowCompletionStatus-checkbox--incomplete' , function () {
            that.triggerMeme( 'mission-complete' );
        });
    }
};

if ( ! window.dankExtInitialized ) {
    window.dankExtInitialized = true;
    dankExtention.init();
}