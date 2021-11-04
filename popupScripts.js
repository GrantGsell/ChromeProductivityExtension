'use strict';
chrome.runtime.getBackgroundPage(darkMode);
chrome.runtime.getBackgroundPage(extensionOnOff);


function darkMode(){
	const dmFlag = toggleChange('test', changeTheme);
}


function extensionOnOff(){
	const onOffFlag = toggleChange('onOff', turnExtensionOnOff);
}


function toggleChange(elemId, callback){
	const elem = document.getElementById(elemId);
	
	// Set event listener for toggle change
	return elem.addEventListener('change', function(){
		chrome.storage.local.set({'test': elem.checked}, function(){
			console.log("Toggle Set: " + elem.checked);
			callback(elem.checked);
		});
	});
}


window.onload = function(){
	const t0 = 'test';
	const t1 = 'onOff';
	chrome.storage.local.get([t0], function(res){
		const toggleElem = document.getElementById(t0);
		toggleElem.checked = res.test;
		changeTheme(res.test);
	});
}


function turnExtensionOnOff(){
	console.log("Do Something");
}

function changeTheme(themeFlag){
	const element = document.querySelector('body');
	const style = getComputedStyle(element);
	const title = document.querySelector('.titleText');
	const inner = document.querySelector('.inner');
	const onOff = document.querySelector('.onOffTxt');
	const darkMode = document.querySelector('.darkModeTxt');
	const pause = document.querySelector('.pauseTxt');
	const once  = document.querySelector('.btn.pauseOnce');
	const always  = document.querySelector('.btn.pauseAlways');
	const active = document.querySelector('.activeTimeTxt');
	const set = document.querySelector('.setTimeBtn');
	const start = document.querySelector('.startTime');
	const end  = document.querySelector('.endTime');
	if (themeFlag) {
		// Darkmode theme
		element.style.backgroundColor = "#15202B";
		title.style.color = "#8896A6";
		inner.style.backgroundColor = "#192734";
		onOff.style.color = "#8896A6";
		darkMode.style.color = "#8896A6";
		pause.style.color = "#8896A6";
		once.style.background = "#8896A6";
		always.style.background = "#8899A6";
		active.style.color = "#8896A6";
		set.style.background = "#8896A6";
		start.style.background = "#8896A6";
		end.style.background = "#8896A6";
	}
	else {
		// Lightmode theme
		element.style.backgroundColor = "grey";
		title.style.color = "#000000";
		inner.style.backgroundColor = "white";
		onOff.style.color = "#000000";
		darkMode.style.color = "#000000";
		pause.style.color = "#000000";
		once.style.background = "lightgrey";
		always.style.background = "lightgrey";
		active.style.color = "#000000";
		set.style.background = "#FFFFFF";
		start.style.background = "lightgrey";
		end.style.background = "lightgrey";
	}
}
