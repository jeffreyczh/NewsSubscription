/*
 * Functions here are used for handlering operations related to files
 * e.g. getting the list of users, lists of favorites
 */
var fs = require('fs');
// loads the favorites of the user
// returns the array of these favorites
function loadFavorites(userName) {
	var favList = new Array();
	var contentString = '';
	try
	{
		var readObj = new Object();
		readObj.encoding = 'utf-8';
		contentString = fs.readFileSync('./data/fav/' + userName, readObj);
	}
	catch (e) {}
	favList = contentString.split('\n');
	return favList;
}

exports.loadFavorites = loadFavorites;