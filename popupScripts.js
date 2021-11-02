'use strict';
chrome.runtime.getBackgroundPage(darkMode);
chrome.runtime.getBackgroundPage(extensionOnOff);


function darkMode(){
	const dmFlag = "test"
	toggleChange("test", dmFlag, changeTheme);
}


function extensionOnOff(){
	const onOffFlag = "onOff";
	toggleChange(onOffFlag, onOffFlag, changeTheme);
}


function toggleChange(toggleElemId, key, callback){
	// Obtain element via id
	const elem = document.getElementById(toggleElemId);

	// Set event listener for toggle change
	elem.addEventListener('change', function(){
		chrome.storage.local.set({key: elem.checked}, function(){
			
			console.log("Toggle Set: " + elem.checked);
		});
		callback(elem.checked);
	});
}


window.onload = function(){
	console.log("WINDOW OPENED");
	chrome.storage.local.get(['test'], function(res){
		console.log("Value on Window Open: " + res.test);
		const toggleElem = document.getElementById("test");
		toggleElem.checked = res.test;
		changeTheme(res.test);
	});
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
