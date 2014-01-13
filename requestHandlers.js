/*
 * The module for handling requests
 */
 var querystring = require('querystring');
 var fileHandlers = require('./fileHandlers');
 var http = require('http');
 var url = require('url');
 var crypto = require('crypto');
 var bufferhelper = require('bufferhelper');
 var iconv = require('iconv-lite');

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
			path: urlObj.path
		};
		var ims = favList[href];
		if (ims.indexOf(' ') != -1) {
			// the 'ims' is not an MD5
			// which means the website supports 'last-modified' field in the response header
			options.headers = {
				'If-Modified-Since': ims
			};
		}
		getPage(options, href);
	}

	// closure function
	function getPage(options, href) {
		console.log('--- GET url: ' + href + ' ---');
		http.get(options, function(res) {
			console.log('GET from ' + href + ' -------');
			console.log('code: ' + res.statusCode);
			var md5sum = '';
			var lm = res.headers['last-modified'];
			if (lm == undefined) {
				// the response header does not contain the 'last-modified' field
				// hash the content for further comparison
				md5sum = crypto.createHash('md5');

			}
			var bufferHelper = new bufferhelper();
			res.on('data', function(chunk){
				//total += chunk;
				bufferHelper.concat(chunk);
				if (lm == undefined) {
					// the response header does not contain the 'last-modified' field
					// hash the content for further comparison
					md5sum.update(chunk);
				}
			}).on('end', function(){
				writeBackObj[href] = '';
				checkArr[href] = true;
				if (lm == undefined) {
					// the response header does not contain the 'last-modified' field
					// hash the content for further comparison
					lm = md5sum.digest('hex');
				}
				if (lm != favList[href]) {
					// compare the versions
					// now the two versions are different
					// there is an update
					var total = iconv.decode(bufferHelper.toBuffer(),'gb2312');
					console.log(total);
					writeBackObj[href] = total;
					//favList[href] = lm;
				}
				
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