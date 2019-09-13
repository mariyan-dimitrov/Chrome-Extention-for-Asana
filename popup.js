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
    triggerMeme: function ( memeName, pictureFormat, offset, isSoundOnly ) {
        let that = this;
        // simple check so that sound are not overlappping
        if( that.memeStateFor[ memeName ]  && ! isSoundOnly) {
            return;
        }

        // seatching the URL's from the extention to the page's context 
        let musicURL = chrome.extension.getURL('/resources/' + memeName + '/music.mp3'  );
        let music = new Audio(musicURL);

        if ( isSoundOnly ) {
            music.play();
            return;
        }

        let pictureURL = chrome.extension.getURL('/resources/' + memeName + '/picture.' + pictureFormat )

        that.memeStateFor[memeName]= true;

        //reusing the modal
        $( '.' + memeName ).remove();
        $( 'body' ).append(
            `<div class="meme-land ${ memeName }">
                <div class="wav"><img src="${ pictureURL }" alt="" /></div>
            </div>`
        );

        if ( offset ) {
            $( `.meme-land.${memeName}` ).css( offset );
        }

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
        let hoverMemeTimeOut = {};
        $( document ).on( 'click' , '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton, .TaskRowCompletionStatus-checkbox.TaskRowCompletionStatus-checkbox--incomplete' , function () {
            clearTimeout(hoverMemeTimeOut);
            that.triggerMeme( 'mission-complete', 'png' );
        });


        // delegate events for hover-in and hover-out
        $( 'body' ).on({
            mouseenter: function(e) {
                let offset = $(this).offset() 
                hoverMemeTimeOut = setTimeout(function () {
                    that.triggerMeme( 'do-it', 'gif', offset);
                }, 1000);
            },
            mouseleave: function() {
                clearTimeout(hoverMemeTimeOut);
            }
        }, '.Button.Button--small.Button--secondary.CompletionButton--isIncomplete.CompletionButton, ' +
           '.TaskRowCompletionStatus-checkbox.TaskRowCompletionStatus-checkbox--incomplete' );

        $( document ).on('click', '.Button.Button--small.Button--primary.AddTaskDropdownButton-addTaskButton', function () {
            that.triggerMeme( 'oof', 'gif', null, true);
        })
    }
};

// initializing the script only once
if ( ! window.dankExtInitialized ) {
    window.dankExtInitialized = true;
    dankExtention.init();
}