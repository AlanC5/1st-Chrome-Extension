/* Implement Later
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
} */





//Search up to 100 links, counts them, and shows them in a popup
function buildHistoryList() {				//REMINDER: ADD BACK ELEMENT PARAMETER
	//Look for history items in the last 24 hours
	var microsecondsPerDay = 1000 * 60 * 60 * 24;
	var oneDayAgo = (new Date()).getTime() - microsecondsPerDay;
	//Array that stores url and visitCounts
	var histories = [];

	chrome.history.search({
		text:'',				//Captures all links
		maxResults:1,			//No max
		startTime: oneDayAgo
		}, function(historyItems) {
		for (var i = 0; i < historyItems.length; i++) {
			histories.push({
				url: historyItems[i].url,
				visits: historyItems[i].visitCount
			});
			console.log(historyItems[i].url);
			//console.log(historyItems[i].visitCount);
			//Send information to port using AJAX and JQUERY
			$.ajax ({
				type: "POST",
				url: "http://localhost:8000",
				crossDomain: true,
				dataType: "json",
				data:JSON.stringify(historyItems[i].url)
			}).done(function (data) {alert("FINISHED");
				});
		}
	});
}



document.addEventListener("DOMContentLoaded", function() {
	buildHistoryList();
});