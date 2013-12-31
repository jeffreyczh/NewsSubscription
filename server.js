var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('ready...\n');
  getPage('http://csb.stanford.edu/class/public/pages/sykes_webdesign/05_simple.html', res);
  
}).listen(port);

function getPage(url, res) {
	http.get(url, function(subres) {
		subres.on('data', function (chunk) {
			
			res.write('BODY: ' + chunk);
			console.log('BODY: ' + chunk);
			res.end();
		});
	}).on('error', function(e) {
		res.write("Got error: " + e.message);
		res.end();
	});
	
}