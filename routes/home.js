var auth = require('../auth');
var graph = auth.graph;
var conf = auth.conf;

exports.auth = function(req, res) {
	// we don't have a code yet
	// so we'll redirect to the oauth dialog
	if (!req.query.code) {
	var authUrl = graph.getOauthUrl({
		"client_id":     conf.client_id,
	    "redirect_uri":  conf.redirect_uri,
	    "scope":         conf.scope
	});
	if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
		res.redirect(authUrl);
	}
	else {  //req.query.error == 'access_denied'
		res.send('access denied');
	}
	return;
	}

	// code is set
	// we'll send that and get the access token
	graph.authorize({
		"client_id":      auth.conf.client_id,
	 	"redirect_uri":   auth.conf.redirect_uri,
		"client_secret":  auth.conf.client_secret,
	  	"code":           req.query.code
		}, 
		function (err, facebookRes) {
		res.redirect('/fbloggedin');
	});
}

exports.getFriendsBirthday = function(req,res) {
		graph.get("me/friends?fields=name,birthday,gender", function(err, response) {
			var friends = [];
			friends = response;
			var name = [];
			var gender = [];
			var birthday = [];
			conole.log(friends.data[5]);
			// for(var i=0; i<friends.data.length; i++){
			// 	name.push(friends.data[i].name);
			// 	gender.push(friends.data[i].gender);
			// 	if (friends.data[i].birthday)
			// 		birthday.push(friends.data[i].birthday);
			// 	else
			// 		birthday.push()
			// }

	  		res.render('index', {response:response, loggedin: true});
		});
	// console.log(data);
	// res.render("facebook", data);
}