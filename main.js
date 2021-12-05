// JavaScript
//const contents = document.getElementById('contents');
//contents.parentNode.removeChild(contents);

// Create object to hold site/element key
var siteInfo = {
	reddit: ['._31N0dvxfpsO6Ur5AKx4O5d', '#siteTable'],
	youtube: ['#contents'],	
};


// New reddit main page class => let contents = $('._31N0dvxfpsO6Ur5AKx4O5d');
// Old reddit Main page class => let contents = $('#siteTable');

// jQuery code to simplify above JS code
var contents = $('#contents');
var parent = $('#contents').parentElement;


chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		//console.log(
		//	`Storage key "${key}" in namespace "${namespace}" changed.`,
		//	`Old value was "${oldValue}", new value is "${newValue}".`
	//	);
		checkExtensionStatus();
		//console.log(getSiteObject());
		console.log("URL is in sites Object: " + (getBaseUrl() in siteInfo));
	}
});

function checkExtensionStatus(evt){
	if(getSiteObject(getBaseUrl())) {
		console.log("Made it to initial check 2");
		chrome.storage.local.get(['onOff', 'timeStart', 'timeEnd'], function(res){
			var currTime = new Date().toString();
			var currDate = currTime.slice(0,16);
			var time0 = Date.parse(currDate + res.timeStart);
			var time1 = Date.parse(currDate + res.timeEnd);
			var newTime = Date.parse(currTime);
			if(res.onOff && (time0 <= newTime && newTime <= time1)){
				contents.hide("fast");
			}else{
				contents.show("fast");
			}
		});
	}
}

window.addEventListener("load", function(){
	const currUrl = getBaseUrl();
	if(getSiteObject(currUrl)){
		const child  = siteInfo[currUrl][0];
		setElements(child);
	}
	checkExtensionStatus();
});


var timerID = setInterval(function(){
	checkExtensionStatus();
}, 60 * 1000);


// Function for obtaining url between subdomain and top-level domain
function getBaseUrl(){
	// Array of top level domains
	const tld = ['.com', '.org', '.net', '.gov'];
	const fullUrl = window.location.href;

	// Search for first index of top level domains
	let tldIndex = -1;
	for(let elem of tld){
		if(fullUrl.indexOf(elem) != -1) tldIndex = fullUrl.indexOf(elem);
	}
	
	// Obtain url substring up to the top level domain
	let baseUrl = "";
	if(tldIndex != -1){
		baseUrl = fullUrl.substring(12, tldIndex);
	}
	return baseUrl;
}

window.addEventListener('locationchange', function(){
    console.log('location changed!');
})


function setElements(child){
	contents = $(child);
	parent = $(child).parentElement;
}


let result = false;
function getSiteObject(url){
	var site = {
		data: null
	};
	//let result = false;
	chrome.storage.sync.get(['siteData'], function(res){
		site.data = res.siteData;
		console.log("Site Data: " + site.data);
		console.log("URL      : " + url);
		if(url in site.data){
			result = true;
		}else{
			result = false;
		}
	});
	//console.log("Result: " + result);
	return result;
}


function setSiteObject(){
	var site = {
		data: null
	};
	let result = false;
	chrome.storage.sync.get(['siteData'], function(res){
		site.data = res.siteData;
		delete site.data.youtube;
		console.log("Site Data After Deletion: " + site.data);
		
		chrome.storage.sync.set({['siteData'] : site.data}, function(res){
			if(!chrome.runtime.lastError){
				// Set storage value successfully
			}
		});
		
	});
	/*
	chrome.storage.sync.set({['siteData'] : site.data}, function(res){
			if(!chrome.runtime.lastError){
				// Set storage value successfully
			}
	});
	*/
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "Once Btn Pressed") {
			contents.show();
            // do cool things with the request then send response 
            // ...
			console.log("Message Recieved!!!!!!");
            sendResponse({ data: true }); // This response is sent to the message's sender, here the background script 
        }
		else if(request.msg == "Always Btn Pressed"){
			contents.show();
			try{
				//delete siteData.youtube;
				//console.log(siteData);
				setSiteObject();
			}
			catch(e){
				console.log(e);
			}
			console.log("Always Button was Pressed!!!!");
			sendResponse({ data: true });
		}
    }
});
