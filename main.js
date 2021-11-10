// JavaScript
//const contents = document.getElementById('contents');
//contents.parentNode.removeChild(contents);

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
	}
});

function checkExtensionStatus(evt){
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

window.addEventListener("load", function(){
	console.log(window.location.href);
	console.log(getBaseUrl());
	checkExtensionStatus();
});


var timerID = setInterval(function(){
	checkExtensionStatus();
}, 60 * 1000);

// Function for obtaining ull up to top-level domain, inclusive
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
		baseUrl = fullUrl.substring(0, tldIndex + 4);
	}
	return baseUrl;
}
