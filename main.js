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
	checkExtensionStatus();
});


var timerID = setInterval(function(){
	checkExtensionStatus();
}, 60 * 1000);
