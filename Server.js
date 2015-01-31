//RUN USING NODE
/*
var port = 8000;			//CHANGED PORT
	var http = require('http');
	var server = http.createServer();
	server.on('request', request);
	server.listen(port);
	function request (request, response) {
		var store = [];
		var check = '';
		request.on('data', function(data)
		{
			check += data;
			store.push(data);
		});
		request.on('end',function()
		{
			response.setHeader("Content-Type", "text/json");
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.end(check);
			Enter_data(store);
		});
	}
*/

var http = require('http');
var server = http.createServer();
server.listen(8000);
server.on('request', function(request, response) {
	var store = [];
	request.on('data', function(rec_data) {		//listening for data event -- do something with rec_data, received data
		store.push(rec_data);
	});
	request.on('end', function() {		//listening for end event, when client is done sending data
		//Allow Chrome Extension access to server, notice it allows all access so its most likely a security issue
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.end();					//end listening on server side
		Enter_data(store);
	});
});


Enter_data = function(data) {
var mysql = require('mysql');
var client = mysql.createConnection({
	host		: 'localhost',
	user		: 'Alan',
	password	: '12345'
});
//Testing if mysql can take arrays, it works
//var string = [];
var num = [23,5,2,20,8];
//string.push(data);

check_Error = function(type, error) {
	if (error) {
		console.log(type + ' ERROR: ' +  error.message);
		throw error;
	}
	return;
};

console.log('Connecting to Database ...');

client.connect(function(err, results) {
	check_Error('Connect', err);
	console.log('Connected!');
	createDB(client);
});

createDB = function (client) {
	client.query('CREATE DATABASE Mobius', function(err, results) {
		if (err && err.number != mysql.ERROR_DB_CREATE_EXISTS) {
			console.log('createDB' + err.message);
			throw err;
		}
		console.log('Database is created or already exists.');
		dbExists(client);
	});
};

dbExists = function (client) {
	client.query('USE Mobius', function(err, results) {
		check_Error('dbExists', err);
		createTable(client);
	});
};

createTable = function (client) {
	client.query(
		'CREATE TABLE History' +		//Create Table and names it
		'(ID INT(11) AUTO_INCREMENT, ' +	//Specify the column and types in the rows below
		'URL TEXT,	' +
		'Visits INT(11),	' +
		'PRIMARY KEY (ID));', function (err,results) {
			if (err && err.number != mysql.ERROR_TABLE_EXISTS_ERROR) {
				console.log('createTable ERROR: ' + err.message);
				throw err;
			}
			console.log("Table is ready.");
			clearTable(client);
		}
	);
};

clearTable = function (client) {
	client.query(
		'TRUNCATE TABLE History',
		function (err, results) {
			check_Error('clearTable', err);
			insertTable(client);
		}
	);
};

insertTable = function (client) {
	var insert = 'INSERT INTO History (URL, Visits) VALUES ?';
	var values =  [];
	for (var i = 0, lens = data.length; i < lens; ++i) {
		var hold = [];
		hold.push(data[i],num[i]);
		values.push(hold);
	}
	
	client.query(insert, [values], function (err, results) {
			check_Error('insertTable', err);
			console.dir(results);
			console.log("Inserted "+results.affectedRows+" row.");
			console.log("The unique id was " + results.insertId);
			tableHasData(client);
		}
	);
};

tableHasData = function (client) {
	client.query(
		'SELECT * FROM History',
		function selectCB(err, results, fields) {
			check_Error('tableHasData', err);
			console.log("Got "+results.length+" Rows:");
            console.log(results);
            client.end();
		}
	);
};

}








