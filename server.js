var http = require('http');
var port = process.env.PORT || 1215; // for Windows Azure to deploy
var fileHandlers = require('./fileHandlers');


http.createServer(function(req, res) {
	res.on('close', function(){
		console.log('the connection is closed');
		res.write('Close!!!');
	});
	var favList = fileHandlers.loadFavorites('jeffreyczh');
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write(favList.toString());
	res.end();
  //getPage('http://csb.stanford.edu/class/public/pages/sykes_webdesign/05_simple.html', res);
  
}).listen(port);



/*function getPage(url, res) {
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
	
}*/
