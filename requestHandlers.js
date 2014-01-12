/*
 * The module for handling requests
 */
 var querystring = require('querystring');
 var fileHandlers = require('./fileHandlers');
 var http = require('http');
 var url = require('url');

// get the update for all favorites right now
function updateNow(response, postData) {
	var userName = getUserName(postData);
	console.log('userName:' + userName);
	var favList = fileHandlers.loadFavorites(userName);
	var checkArr = generateCheckingArray(favList);
	var writeBackObj = {};
	for (var href in favList) {
		// update all favorites
		var urlObj = url.parse(href);
		var options = {
			host: urlObj.host,
			headers: {
				'If-Modified-Since': favList[href]
			},
			path: urlObj.path
		};
		getPage(options, href);
	}

	// closure function
	function getPage(options, href) {
		console.log('--- GET url: ' + href + ' ---');
		http.get(options, function(res) {
			console.log('GET from ' + href + ' -------');
			console.log('code: ' + res.statusCode);
			favList[href] = res.headers['last-modified'];
			
			var total = '';
			res.on('data', function(chunk){
				total += chunk;
			}).on('end', function(){
				writeBackObj[href] = total;
				checkArr[href] = true;
				if (isGettingAllPages(checkArr))
				{
					// all favorites' responses are obtained
					// send back the response to the client
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(JSON.stringify(writeBackObj));
					response.end();
					fileHandlers.saveFavorites(favList, userName);
				}
			});
			
		});
	}

}

// get updates for the long-polling request
function update(response, postData){
}


// get the userName from postData
function getUserName(postData) {
	return querystring.parse(postData).userName;
}

// generate the array for checking status
function generateCheckingArray(favList) {
	var arr = new Array();
	for (var href in favList)
	{
		arr[href] = false;
	}
	return arr;
}

// check the checking array
function isGettingAllPages(checkArr) {
	for (var href in checkArr)
	{
		if (checkArr[href] == false)
		{
			return false;
		}
	}
	return true;
}

exports.updateNow = updateNow;
exports.update = update;