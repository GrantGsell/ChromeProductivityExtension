 chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
	chrome.alarms.create('refresh', { periodInMinutes: 1 });
	setSiteData();
});


chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(alarm.name); // refresh
  helloWorld();
});


function helloWorld() {
  console.log("Hello, world!");
}


chrome.runtime.onInstalled.addListener(() => {
	console.log("Background HERE");
});


const filter = {
  url: [
    {
      urlMatches: 'https://www.google.com/',
    },
  ],
};


chrome.webNavigation.onCompleted.addListener(() => {
  console.info("The user has loaded my favorite website!");
}, filter);


function setSiteData(){
	// Sites to block with their associated elements to block
	var siteInfo = {
		reddit: ['._31N0dvxfpsO6Ur5AKx4O5d', '#siteTable'],
		youtube: ['#contents'],	
	};
	
	// Store site data to local memory
	chrome.storage.local.set({['siteData'] : siteInfo}, function(res){
		if(!chrome.runtime.lastError){
			// Set storage value successfully
		}
	});	
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "Once Btn Pressed") {
            // do cool things with the request then send response
            // ...
            //sendResponse({ sender: "background.js", data: true  }); // This response is sent to the message's sender
			console.log("Message Recieved");
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				// relay finder.js's message to filler.js
				chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
					if (response) {
						if (response.data) {
							// relay filler.js's response to finder.js
							sendResponse({ data: response.data });
						}
					}
				});
			});
        }
    }
	return true;
});
