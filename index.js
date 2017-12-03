const exec = require("child_process").exec
const mysql = require("mysql");

function getConnection() {
	return mysql.createConnection({
		host: 'localhost',
		user: 'InetOutages',
		password: 'InetOutages',
		database: 'InetOutages'
	});
}

exec("./test-internet.sh", (err, stdout, stderr) => {
	const result = stdout.trim()
	var resultChar = (function() {
		switch (result) {
			case "Online":
				return "U" // Up
			case "Offline":
				return "D" // Down
			default:
				return "?";
		}
	}());

    var conn = getConnection();

     new Promise((resolve, reject) => {
        conn.query("Insert into InetTest (test_time, result) values (now(), '" + resultChar + "')", (err, results) => {
            if (err) reject(err);
            else resolve(results);
        })
    }).catch(err => {
        console.log("Error: ", err)
    }).then(() => {
        conn.end()
    })

})


// create schema InetOutages;
// use InetOutages;
// create table InetTest (id integer not null auto_increment primary key, test_time datetime, result char);
// GRANT ALL PRIVILEGES ON InetOutages.* TO InetOutages@localhost IDENTIFIED BY 'InetOutages'
