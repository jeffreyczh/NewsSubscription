var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var iconv = require('iconv-lite');
var parseString = require('xml2js').parseString;
var util = require('util');

var post_data = querystring.stringify({
    'userName': 'jeffreyczh'
});
// for local test

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

// for windows azure
/*
var options = {
	host: 'czhnews.azurewebsites.net',
	port: 80,
	path: '/updateNow',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
	}
};
*/
var post_req = http.request(options, function(res) {
    var total = '';
		res.on('data', function(chunk){
		total += chunk;
	}).on('end', function(){
		var json_data = JSON.parse(total);
		var str = '';
		for (var key in json_data) {
			str += 'Source: ' + key + ' -----\n';
			str += json_data[key] + '\n';
			console.log(json_data[key]);
			/*parseString(json_data[key], function(err, result){
				var title = result.rss.channel[0].item[1].description[0];
				title = iconv.encode(title, 'gb2312');
				//title = iconv.decode(title, 'gb2312');
				console.log('title: ' + title);
			});*/
		}
		fs.writeFileSync('./response_updateNow', str);
	});
});

  // post the data
post_req.write(post_data);
post_req.end();
