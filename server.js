var http = require('http');
var port = process.env.PORT || 1215; // for Windows Azure to deploy
var url = require('url');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/updateNow'] = requestHandlers.updateNow;

http.createServer(onRequest).listen(port);

console.log('Server has started.');

function onRequest(request, response) {
	var pathName = url.parse(request.url).pathname; 
	console.log('Request for ' + pathName + ' received.');
	// get the post string
	var postData = '';
	request.on('data', function(chunk){
		postData += chunk;
	}).on('end', function(){
		console.log('data: ' + postData);
		router.route(handle, pathName, postData, response);
	});
	
}
