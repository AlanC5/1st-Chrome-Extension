function addElements(divName, data) {
	var element = document.getElementById(divName);

	var ol = document.createElement('ol');
	element.appendChild(ol);

	for (var i = 0, lens = data.length; i < lens; ++i) {
		var d = document.createElement('d');
		d.appendChild(document.createTextNode(data[i]));
		
		var li = document.createElement('li');
		li.appendChild(d);
		ol.appendChild(li);
	}
}

//Search up to 100 links, counts them, and shows them in a popup
function buildHistoryList() {
	//Look for history items in the last 24 hours
	var microsecondsPerDay = 1000 * 60 * 60 * 24;
	var oneDayAgo = (new Date()).getTime() - microsecondsPerDay;
	
	var historyStore = [];

	var historiesprocessed = 0;
	var histories = [];

	chrome.history.search({text:'', maxResults:0, startTime: oneDayAgo}, function(historyItems) {
		for (var i = 0; i < historyItems.length; i++) {
			histories.push({
				url: historyItems[i].url,
				visits: historyItems[i].visitCount
			});
			console.log(historyItems[i].url);
		}
	});
}



document.addEventListener("DOMContentLoaded", function() {
	buildHistoryList();
});