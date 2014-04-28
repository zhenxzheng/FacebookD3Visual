//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var graph = require('fbgraph');
var conf = {
	client_id: 		process.env.facebook_app_id,
	client_secret: 	process.env.facebook_app_secret,
	redirect_uri: 	process.env.facebook_app_uri,
	scope: 			'email, user_about_me, user_birthday, user_location, user_photos, friends_birthday'	
};

exports.graph = graph;
exports.conf = 	conf;
/**
* Add your authentication apis here with example like the bottom
*/
/**
//add instagram api setup
var ig = require('instagram-node-lib');
ig.set('client_id', process.env.instagram_client_id);
ig.set('client_secret', process.env.instagram_client_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;
**/