/*
 * Functions here are used for handlering operations related to files
 * e.g. getting the list of users, lists of favorites
 */
var fs = require('fs');
var path = require('path');
var seperator = '_#,#_'; // the seperator for the xml and the last-modified time
// loads the favorites of the user
// returns the array of these favorites
// NOTE: the returned array is an associative array, 
// the key is the URL of the xml file
function loadFavorites(userName) {
	var favList = new Array();
	var contentString = '';
	try
	{
		var readObj = new Object();
		readObj.encoding = 'utf-8';
		contentString = fs.readFileSync('./data/fav/' + userName, readObj);
		var tempList = contentString.split('\n');
		// set 'max' to length -1 to escape the final empty line
		for (var i = 0, max = tempList.length - 1; i < max; i++)
		{
			var tempArr = tempList[i].split(seperator);
			favList[tempArr[0]] = tempArr[1];
		}
	}
	catch (e) {}
	
	return favList;
}

// save favorites to the favorites file
function saveFavorites(favList, userName) {
	var dirPath = './data/fav/';
	try
	{
		var data = '';
		for (var key in favList)
		{
			data += key + seperator + favList[key] + '\n';
		}
		fs.writeFileSync(dirPath + userName, data);
	}
	catch (e)
	{
		// missing directories
		// create those missing directories
		if (e && e.errno === 34)
		{
			mkdirsSync(dirPath);
			saveFavorites(favList, userName);
		}
	}
}

// create multiple directories (Synchronous version)
function mkdirsSync(dirPath, mode) {
  //Call the standard fs.mkdir
  try
  {
	fs.mkdirSync(dirPath, mode);
  }
  catch (error)
  {
	  if (error && error.errno === 34) {
      //Create all the parents recursively
      mkdirsSync(path.dirname(dirPath), mode);
      //And then the directory
      mkdirsSync(dirPath, mode);
    }
  }
}

exports.loadFavorites = loadFavorites;
exports.saveFavorites = saveFavorites;