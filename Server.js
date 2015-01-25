//RUN USING NODE

var port = 8000;			//CHANGED PORT
	var http = require('http');
	var server = http.createServer();
	server.on('request', request);
	server.listen(port);
	function request (request, response) {
		var store = '';
		request.on('data', function(data)
		{
			
			store += data;
		});
		request.on('end',function()
		{
			console.log(store);
			response.setHeader("Content-Type", "text/json");
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.end(store);
			Enter_data(store);
		});
	}

Enter_data = function(data) {
var mysql = require('mysql');
var client = mysql.createConnection({
	host		: 'localhost',
	user		: 'Alan',
	password	: '12345'
});
//Testing if mysql can take arrays, it works
var string = [];
var num = [23,5,2,20,8];
string.push(data);

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
	for (var i = 0, lens = string.length; i < lens; ++i) {
		var hold = [];
		hold.push(string[i],num[i]);
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








