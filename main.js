// JavaScript
//const contents = document.getElementById('contents');
//contents.parentNode.removeChild(contents);

// Create object to hold site/element key
const siteInfo = {
	reddit: ['._31N0dvxfpsO6Ur5AKx4O5d', '#siteTable'],
	youtube: ['#contents'],	
};


// New reddit main page class => let contents = $('._31N0dvxfpsO6Ur5AKx4O5d');
// Old reddit main page class => let contents = $('#siteTable');

// jQuery code to simplify above JS code
var contents = $('#contents');
var parent = $('#contents').parentElement;


chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		console.log(
			`Storage key "${key}" in namespace "${namespace}" changed.`,
			`Old value was "${oldValue}", new value is "${newValue}".`
		);
		checkExtensionStatus();
		alwaysButtonEvent();
	}
});

function checkExtensionStatus(evt){
	if(siteInfo[getBaseUrl()] != null) {
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
	console.log(window.location.href);
	const currUrl = getBaseUrl();
	console.log("Current Url: " + currUrl);
	console.log(siteInfo[currUrl]);
	if(currUrl in siteInfo){
		const child  = siteInfo[currUrl][0];
		setElements(child);
		console.log("'" + contents + "'");
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


/*
 * Check for change in always local memory variable 
 */
function alwaysButtonEvent(){
	chrome.storage.local.get(['always'], function(res){
		try{
			console.log("HERE: MAIN");
			console.log(res.always);
		}
		catch{
			console.log("Error");
		}
		let isTrue = res.always;
		if(isTrue){
			contents.show();
			try{
				let url = getBaseUrl();
				console.log(url);
				delete siteInfo.youtube;
				console.log(siteInfo);
			}
			catch(e){
				logMyErrors(e);
			}
		}
	});
	
}
