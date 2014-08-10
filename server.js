var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

 var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST || 'db4free.net',
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'prosandcons',
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'consandpros',
  port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
  database : 'prosandcons'
 });

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.enable('trust proxy');

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/html'));

app.post('/sendComment', function(req, res) {
	console.log(req.body);
	console.log(req.ip);

connection.query('INSERT INTO procon'+
	' SET game = ?'+
	', type = ?'+
	', user = ?'+
	', title = ?'+
	', comment = ?'+
	', agree = ?'+
	', disagree = ?',
	[req.body.game,
	req.body.type,
	req.ip,
	req.body.title,
	req.body.comment,
	0,
	0], function (err, rows, fields) {
		if (err){
			console.log(err);
			res.end("Duplicate comment...");
		}
		else{
			console.log('Comment inserted');

		connection.query('INSERT INTO voting'+
			' SET id = ?'+
			', user = ?'+
			', decision = ?',
			[rows.insertId,
			req.ip,
			"yours"], function (err, rows, fields) {
				if (err){
					console.log(err);
				}
			});

			res.end("Comment submitted!");
		}
	});
});

app.post('/getComment', function(req, res){
	console.log("Checking "+req.body.game+"'s comments");

	var comments = 'SELECT * FROM procon WHERE game="'+req.body.game+'" ORDER BY (agree-disagree) DESC';

	connection.query(comments, function(err, rows, fields) {
		if (err) throw err;
		if(!rows[0]){
			console.log("No comments");
			res.end();}
		else{
			console.log("Comments found");
			res.end(JSON.stringify(rows));
		}
	});
});

app.post('/sendVote', function(req, res){
	console.log(req.body);

connection.query('INSERT INTO voting'+
	' SET id = ?'+
	', user = ?'+
	', decision = ?',
	[req.body.id,
	req.ip,
	req.body.decision], function (err, rows, fields) {
		if (err){
			console.log(err);
			res.end("Already voted...");
		}
		else{

	var vote = 'UPDATE procon SET '+req.body.decision+' = '+req.body.decision+' + 1 WHERE procon.id = '+req.body.id+'';

	connection.query(vote, function(err, rows, fields) {
		if (err) throw err;
			});
		res.end("Vote registered!");
		}
	});
});  

app.post('/getNotif', function(req, res){
	console.log("Checking "+req.ip+"'s votes");

	var votas = 'SELECT * FROM voting WHERE user="'+req.ip+'"';

	connection.query(votas, function(err, rows, fields) {
		if (err) throw err;
		if(!rows[0]){
			console.log("No votes");
			res.end();}
		else{
			console.log("Votes found");
			res.end(JSON.stringify(rows));
		}
	});
});

app.post('/getReview', function(req, res){
	console.log("Gathering "+req.body.game+"'s review");

	var comments = 'SELECT * FROM procon WHERE game="'+req.body.game+'" ORDER BY ((agree+1)/(disagree+1)) DESC';

	connection.query(comments, function(err, rows, fields) {
		if (err) throw err;
		if(!rows[0]){
			console.log("No review");
			res.end();}
		else{
			console.log("Review gathered");
			res.end(JSON.stringify(rows));
		}
	});
});

console.log("Listening to " + ipaddress + ":" + port + "...");

app.listen(port, ipaddress);