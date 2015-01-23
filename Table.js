var mysql = require('mysql');
var client = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: ''
});

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
	client.query(
		'INSERT INTO History' +
		' SET URL = ?' +
		', Visits = ?',
		['INSERT URL DATA',
		'5'],
		function (err, results) {
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








