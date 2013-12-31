var http = require('http')
var port = process.env.PORT || 1337;
var totalData = '';
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('ready...\n');
  getPage('http://csb.stanford.edu/class/public/pages/sykes_webdesign/05_simple.html', res);
  
}).listen(port);

function getPage(url, res) {
	http.get(url, function(subres) {
		subres.on('data', function (chunk) {
			totalData += chunk;
		});
		subres.on('end', function() {
			res.write(totalData);
			res.end();
		});
	}).on('error', function(e) {
		res.write("Got error: " + e.message);
		res.end();
	});
	
}