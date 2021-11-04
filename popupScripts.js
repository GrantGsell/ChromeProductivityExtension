'use strict';
chrome.runtime.getBackgroundPage(darkMode);
chrome.runtime.getBackgroundPage(extensionOnOff);


function darkMode(){
	const temp = 'test'
	const dmFlag = toggleChange(temp, changeTheme);
}


function extensionOnOff(){
	//const onOffFlag = toggleChange('onOff', turnExtensionOnOff);
	const onOffFlag = turnExtensionOnOff();
}


function toggleChange(elemId, callback){
	const elem = document.getElementById(elemId);
	
	// Set event listener for toggle change
	return elem.addEventListener('change', function(){
		localMemSet(elemId, elem.checked);
		callback(elem.checked);
		chrome.storage.local.set({'test': elem.checked}, function(){
			callback(elem.checked);
		});
	});
}


window.onload = function(){
	const t0 = 'test';
	const t1 = 'onOff';
	chrome.storage.local.get(['test'], function(res){
		const toggleElem = document.getElementById(t0);
		toggleElem.checked = res.test;
		changeTheme(res.test);
	});

	chrome.storage.local.get(['onOff'], function(res){
		console.log("On open, onOff: " + res.onOff);
		const toggleOnOff = document.getElementById(t1);
		toggleOnOff.checked = res.onOff;
	});
}


function turnExtensionOnOff(){
	const elem = document.getElementById("onOff");
	return elem.addEventListener('change', function(){
		chrome.storage.local.set({'onOff': elem.checked}, function(){
			console.log("On Off Toggle: " + elem.checked);
		});
	});
}


function localMemGet(key){
	let value;
	chrome.storage.local.get([key], function(res){
		let entriesArray = Object.entries(res);
		let key = entriesArray[0][0];
		value = entriesArray[0][1];
	});
	return value;
f}


function localMemSet(key, value){
	chrome.storage.local.set({[key] : value}, function(res){
		if(!chrome.runtime.lastError){
			// set storage value successfully.
			console.log("SET");
		}
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
