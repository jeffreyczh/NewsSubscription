var http = require('http');
var querystring = require('querystring');


var post_data = querystring.stringify({
    'userName': 'jeffreyczh'
});

var options = {
	host: 'localhost',
	port: 1215,
	path: '/updateNow',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
	}
};

var post_req = http.request(options, function(res) {
    //res.setEncoding('utf8');
    var total = '';
		res.on('data', function(chunk){
		total += chunk;
	}).on('end', function(){
		var json_data = JSON.parse(total);
		for (var key in json_data) {
			console.log('Source: ' + key + ' -----');
			console.log(json_data[key]);
		}
	});
});

  // post the data
post_req.write(post_data);
post_req.end();
