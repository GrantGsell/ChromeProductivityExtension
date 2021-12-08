/*
 * Name       : None.
 * Purpose    : Execute storage related functions when th e extension is
 *                initially downloaded.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
	initializeSiteData();
	initializeStorageData();
});


/*
 * Name       : initializeSiteData
 * Purpose    : Stores the object containing the content that should be hidden
 *                when the extension is activated. The key is the base url and  *                the value is the html content that should be hidden.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function initializeSiteData(){
	// Sites to block with their associated elements to block
	var siteInfo = {
		reddit: ['._31N0dvxfpsO6Ur5AKx4O5d', '#siteTable'],
		youtube: ['#contents'],	
	};
	chrome.storage.sync.set({['siteData'] : siteInfo}, function(res){
		if(!chrome.runtime.lastError){
			// Set site data values successfully
		}
	});	
}


/*
 * Name       : initializeStorageData
 * Purpose    : Sets the two toggle swithes to off when the extension is
 *                initially downlaoded.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
function initializeStorageData(){
	const darkModeToggle = 'test';
	const onOffToggle = 'onOfff';
	chrome.storage.local.set({['test'] : false}, function(res){
		if(!chrome.runtime.lastError){
			// Set storage data successfully
		}
	});
	chrome.storage.local.set({['onOff'] :  false}, function(res){
		if(!chrome.runtime.lastError){
			// Set storage data successfully
		}
	});
}


/*
 * Name       : None.
 * Purpose    : Passes messages from popupScripts to main.
 * Parameters : None.
 * Returns    : None.
 * Notes      : None.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "Once Btn Pressed") {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
					if (response) {
						if (response.data) {
							sendResponse({ data: response.data });
						}
					}
				});
			});
        }
		else if(request.msg == "Always Btn Pressed"){	
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
					if (response) {
						if (response.data) {
							sendResponse({ data: response.data });
						}
					}
				});
			});
			
		}
    }
	return true;
});
