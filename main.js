// JavaScript
//const contents = document.getElementById('contents');
//contents.parentNode.removeChild(contents);

// jQuery code to simplify above JS code
var contents = $('#contents');
var parent = $('#contents').parentElement;

// Simple dynamic extension control 
chrome.storage.local.get(['onOff', 'timeStart', 'timeEnd'], function(res){
	var onFlag  = res.onOff;

	// Check active times
	var currTime = new Date().toString();
	var currDate = currTime.slice(0,16);
	var time0 = Date.parse(currDate + res.timeStart);
	var time1 = Date.parse(currDate + res.timeEnd);
	var newTime = Date.parse(currTime);
	
	if(onFlag && (time0 <= newTime && newTime <= time1)){
		contents.remove();
	}else{
		parent.prepend(contents);
	}
});
