/*
 * Name       : None.
 * Purpose    : Set the dynamic elements of the popup when its opened, call 
 *                functions when the DOM is fully loaded.
 * Parameters : None.
 * Returns    : None.
 * Notes      : Both toggle switches and time elements are affected.
 */
window.onload = function(){
	// Read Darkmode Toggle Switch Local Data
	chrome.storage.local.get(['test'], function(res){
		const toggleElem = document.getElementById('test');
		toggleElem.checked = res.test;
		changeTheme(res.test);
	});

	// Read onOff Toggle Switch Local Data
	chrome.storage.local.get(['onOff'], function(res){
		const toggleOnOff = document.getElementById('onOff');
		toggleOnOff.checked = res.onOff;
	});

	// Read Time Input Local Data
	getActiveTime();

	// Call functions when DOM fully loads
	darkMode();
	extensionOnOff();
	setBtnEvent();
	alwaysBtnPressed();
	onceBtnPressed();
}


/*
 * Name       : darkMode
 * Purpose    : Creates a closure that monitors the dark mode toggle switch.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function darkMode(){
	const temp = 'test'
	const dmFlag = toggleChange(temp, changeTheme);
}


/*
 * Name       : extensionOnOff
 * Purpose    : Creates a closure that monitors the on/off toggle switch.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function extensionOnOff(){
	const onOffFlag = turnExtensionOnOff();
}


/*
 * Name       : toggleChange
 * Purpose    : Activates the functional components for the darkmode switch.
 * Parameters : 
 *              elemId, the html id for the darkmode switch.
 *              callback, a function to be executed when the darkmode toggle 
 *                switch changes state.
 * Returns    : A closure encompasing the darkmode functional components.
 * Notes      : None.
 */
function toggleChange(elemId, callback){
	const elem = document.getElementById(elemId);

	if(elem){
		// Set event listener for toggle change
		return elem.addEventListener('change', function(){
			localMemSet(elemId, elem.checked);
			callback(elem.checked);
			chrome.storage.local.set({'test': elem.checked}, function(){
				callback(elem.checked);
			});
		});
	}
}


/*
 * Name       : turnExtensionOnOff
 * Purpose    : To monitor the on/off toggle switch, and activate/deactivate 
 *                the extensions functionality accordingly.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function turnExtensionOnOff(){
	const elem = document.getElementById("onOff");
	return elem.addEventListener('change', function(){
		chrome.storage.local.set({'onOff': elem.checked}, function(){
			// On Off has been set, do something
		});
	});
}


/*
 * Name       : localMemSet
 * Purpose    : Sets the given inputs in local memory.
 * Parameters : 
 *              key, the key for the given data.
 *              value, the data for the associtated key.
 * Returns    : None.
 * Notes      : None.
 */
function localMemSet(key, value){
	 chrome.storage.local.set({[key] : value}, function(res){
		if(!chrome.runtime.lastError){
			// Set storage value successfully
		}
	 });
}


/*
 * Name       : setActiveTime
 * Purpose    : Obtains the start and end time that the user has provided, 
 *                and stores the values in memory.
 * Parameters : None.
 * Returns    : None.
 * Notes      : If the times inputted by the user are invalid an error 
 *                message will be displayed on the popup.
 */
function setActiveTime(){	
	// Obtain start and end time
	let timeStart = document.getElementById("startTime").value;
	let timeEnd = document.getElementById("endTime").value;
	
	// Time difference:
	let datePadding = new Date();
	let currDate = datePadding.toString().slice(0,16);
	const diff = Date.parse(currDate + timeEnd) - Date.parse(currDate + timeStart);
	
	// Ensure both times are valid
	if(timeStart.length == 0 || timeEnd.length == 0 || diff <= 0){
		// Input errror
		errorText("Invalid Time(s)", true);
		return;
	}

	// No error, set empty error message
	errorText("Time Set!", false);

	// Set local data to input data
	localMemSet('timeStart', timeStart);
	localMemSet('timeEnd', timeEnd);
}


/*
 * Name       : getActiveTime
 * Purpose    : Obtains the values stored for the time that the extension is
 *                active and sets the html elements accordingly.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function getActiveTime(){
	let timeStart;
	let timeEnd;
	chrome.storage.local.get(['timeStart', 'timeEnd'], function(res){
		timeStart = res.timeStart;
		timeEnd = res.timeEnd;
		document.getElementById("startTime").value = timeStart;
		document.getElementById("endTime").value = timeEnd;
	});
}


/*
 * Name       : setBtnEvent
 * Purpose    : Creates a closure for when the set button is clicked.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function setBtnEvent(){
	const setBtn = eventBtnClick('setBtn', setActiveTime);
}

/*
 * Name       : eventBtnClick
 * Purpose    : Checks to see if a html button is pressed, and executes a 
 *                callback funciton if true.
 * Parameters : 
 *              btnId, a string denoting the html id for a button.
 *              callback, a function to be executed if the given button was 
 *                pressed.
 * Returns    : A closure encompasing a listener for the given button.
 * Notes      : None.
 */
function eventBtnClick(btnId, callback){
	const elem = document.getElementById(btnId);
	return elem.addEventListener('click', function(){
		callback();
	});
}


/*
 * Name       : errorText
 * Purpose    : Displays text when the time input by the user is invalid, or 
 *                to remove error text if the user sets a valid time after an 
 *                invalid one.
 * Parameters :
 *              errMsg, a string denoting the error message to display.
 *              isError, a boolean denoting if the current user input is 
 *                valid.
 * Returns    : None.
 * Notes      : None.
 */
function errorText(errMsg, isError){
	// Error message element
	const errElem = document.getElementById('errorText');
	errElem.innerHTML = errMsg;
	if(isError){
		errElem.style.color = "red";
	}else{
		errElem.style.color = "green";
		setTimeout(function(){
			errElem.innerHTML = "";
		}, 1000);
	}
}


/*
 * Name       : alwaysBtnPressed
 * Purpose    : To register that the always button was pressed and call its
 *                coressponding callback function.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function alwaysBtnPressed(){
	const setBtn = eventBtnClick('alwaysBtn', activateAlways);
}


/*
 * Name       : activateAlways
 * Purpose    : To act as a callback function for when the always button is 
 *                pressed by the user.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function activateAlways(){
	sendMessage("Always Btn Pressed", true);
}


/*
 * Name       : onceBtnPressed
 * Purpose    : To register that the once button was pressed and call its
 *                coressponding callback function.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function onceBtnPressed(){
	const setOnceFlag = eventBtnClick('onceBtn', activateOnce);
	
}


/*
 * Name       : activateOnce
 * Purpose    : To act as a callback function for when the once button is 
 *                pressed by the user.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function activateOnce(){
	sendMessage("Once Btn Pressed", true);
}


/*
 * Name       : sendMessage
 * Purpose    : Facilitates sending messages from this script to the main 
 *                script via the background script, which acts as an 
 *                intermediary.
 * Parameters :
 *              message, a string denoting the message to be passed.
 *              msgData, an object denoting the data to be passed.
 * Returns    : None.
 * Notes      : None.
 */
function sendMessage(message, msgData){
	chrome.runtime.sendMessage({ msg: message, data: msgData}, (response) => {
		if (response) {
			console.log("Message successful");
		}
	});
}


/*
 * Name       : changeTheme
 * Purpose    : To change the color of each element within the popup.
 * Parameters : themeFlag, a boolean denoting if the theme should be in
 *                darkmode (true) or lightmode (false).
 * Returns    : None.
 * Notes      : None.
 */
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
