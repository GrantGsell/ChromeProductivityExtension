// JavaScript
//const contents = document.getElementById('contents');
//contents.parentNode.removeChild(contents);

// jQuery code to simplify above JS code
var contents = $('#contents');
var parent = $('#contents').parentElement;

// Simple dynamic extension control 
chrome.storage.local.get(['onOff'], function(res){
	var onFlag  = res.onOff;
	if(onFlag){
		contents.remove();
	}else{
		parent.prepend(contents);
	}
});
