function onClick(event) {
  chrome.tabs.create({
    selected: true,
    url: 'http://www.google.com'
  });
  return false;
}

function addElements(divName, data) {
	var element = document.getElementById(divName);

	var ol = document.createElement('ol');
	element.appendChild(ol);

	for (var i = 0, lens = data.length; i < lens; ++i) {
		var d = document.createElement('d');
		d.appendChild(document.createTextNode(data[i]));
		d.addEventListener('click', onClick);
		var li = document.createElement('li');
		li.appendChild(d);
		ol.appendChild(li);
	}
}

var House = ["Statue", "People", "Fireplace"];

document.addEventListener("DOMContentLoaded", function() {
	addElements('Chart', House);
});