// Create object to hold site/element key
var siteInfo = {
	reddit: ['._31N0dvxfpsO6Ur5AKx4O5d', '#siteTable'],
	youtube: ['#contents'],	
};


// jQuery code to simplify above JS code
var contents = $('#contents');
var parent = $('#contents').parentElement;


/*
 * Name       : None.
 * Purpose    : Calls the checkExtensionStatus function when one of the three
 *                storage values is changed.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		console.log(
			`Storage key "${key}" in namespace "${namespace}" changed.`,
			`Old value was "${oldValue}", new value is "${newValue}".`
		);
		checkExtensionStatus();
	}
});


/*
 * Name       : checkExtensionStatus
 * Purpose    : Checks the status of the onOff toggle switch, and the active 
 *                time range set by the user. If the onOff switch is set to 
 *                on and the current time is in the inclusive range of 
 *                timeStart to timeEnd, the extension is active.
 * Parameters : None.
 * Returns    : None.
 * Notes      : If the current webpage is not listed as a key in the siteData
 *                object, nothing happens.
 */
function checkExtensionStatus(){
	chrome.storage.sync.get(['siteData'], function(res){
		if(getBaseUrl() in res.siteData){
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
	});
}


/*
 * Name       : None.
 * Purpose    : To set the child/parent elements and call the
 *                checkExtensionStatus function when a new webpage is loaded.
 * Parameters : None.
 * Returns    : None.
 * Notes      : If the current webpage is not a key in the siteInfo object 
 *                nothing occurs.
 */
window.addEventListener("load", function(){
	const currUrl = getBaseUrl();
	chrome.storage.sync.get(['siteData'], function(res){
		if(getBaseUrl() in res.siteData){
			const child  = siteInfo[currUrl][0];
			setElements(child);
			checkExtensionStatus();
		}
	});
});


/*
 * Name       : None.
 * Purpose    : Calls the checkExtensionStatus function once every minute. 
 *                This is used to to ensure that the extension turns off when
 *                the current time is outside of the active time block set by  *                the user.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
var timerID = setInterval(function(){
	checkExtensionStatus();
}, 60 * 1000);


/*
 * Name       : getBaseUrl
 * Purpose    : Obtains the second-level domain, (the url between subdomain 
 *                and top-level domain), for the current webpage.
 * Parameters : None.
 * Returns    : A string denoting the second-level domain for the current 
 *                wepage.
 * Notes      : The number 12 is in the substring return is obtained from 
 *                the length of the url scheme and subdomain. 
 *                Ex: https://www. == 12
 */
function getBaseUrl(){
	const tld = ['.com', '.org', '.net', '.gov']; // Common top level domains
	const fullUrl = window.location.href;

	// Search for first index of top level domain in the current url
	let tldIndex = -1;
	for(let elem of tld){
		if(fullUrl.indexOf(elem) != -1) tldIndex = fullUrl.indexOf(elem);
	}
	
	// Obtain url substring up to the top level domain
	if(tldIndex != -1){
		return fullUrl.substring(12, tldIndex);
	}
	return null;
}


/*
 * Name       : setElements
 * Purpose    : Sets the child and parent elements of a webpage that will be
 *                hidden when the extension is active.
 * Parameters : child, a string denoting the html element of a given website 
 *                that we want to hide.
 * Returns    : None.
 * Notes      : None.
 */
function setElements(child){
	contents = $(child);
	parent = $(child).parentElement;
}


/*
 * Name       : setSiteObject
 * Purpose    : Deletes the current webpages key from the siteData storage 
 *                object.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function setSiteObject(){
	chrome.storage.sync.get(['siteData'], function(res){
		var sites = res.siteData;
		delete sites[getBaseUrl()];
		chrome.storage.sync.set({['siteData'] : sites}, function(res){
			if(!chrome.runtime.lastError){
				console.log("Storage data set successfully");
			}
		});	
	});
}


/*
 * Name       : None.
 * Purpose    : Recives and responds to messages sent from popupScripts via 
 *                background, when the once/always buttons are pressed.
 * Parameters : None.
 * Returns    : Sends true response message back to background.
 * Notes      : None.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "Once Btn Pressed") {
			contents.show();
            sendResponse({ data: true });
        }
		else if(request.msg == "Always Btn Pressed"){
			contents.show();
			try{
				setSiteObject();
			}
			catch(e){
				console.log(e);
			}
			sendResponse({ data: true });
		}
    }
});
