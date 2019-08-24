chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript( null, { file: 'jquery.js' }, function() {
        chrome.tabs.insertCSS( null, { file: 'style.css' }, function() {
          chrome.tabs.executeScript( null, { file: 'popup.js' } );
        })
      });
    });
  }
})