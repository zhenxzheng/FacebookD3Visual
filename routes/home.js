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

exports.getBirthday = function(req,res) {
		graph.get("me/friends?fields=name,birthday,gender", function(err, response) {
			/*
				initialize essential vairables
			*/
			var friends = [];
			var sortedList=[];
			var Jan = [];
			var Feb = [];
			var Mar = [];
			var Apr = [];
			var May = [];
			var Jun = [];
			var Jul = [];
			var Aug = [];
			var Sept = [];
			var Oct = [];
			var Nov = [];
			var Dec = [];
			var valid = [];
			var unknown = [];

			friends = response;
			var Nfriends = friends.data.length

			/*
				seperate all valid and unknown birthdays
			*/
			var birthdayDate=[];
			for(var i=0; i<Nfriends; i++){
				//temp var to store date
				var date;
				//checks if birthday exists, assign date then push
				if (friends.data[i].birthday) {
					date=parseInt(friends.data[i].birthday.slice(0,2)+friends.data[i].birthday.slice(3,5));
					valid.push(friends.data[i]);
					birthdayDate.push(date);
				}
				else {unknown.push(friends.data[i]);}
			};
			
			/*
				sort valid birthday date
			*/
			birthdayDate.sort(function(a,b){return a-b;});

			//find birthday in frindlist and mark already inserted
			for (var i=0; i<birthdayDate.length; i++){
				var j=0;
				while (j<valid.length){
					if (valid[j] == null || birthdayDate[i] != parseInt(valid[j].birthday.slice(0,2)+valid[j].birthday.slice(3,5))){
						j++;
					}
					else{
						sortedList.push(valid[j]);
						valid[j] = null;
						break;
					}
				};
			};

			/*
				sort list into monthly variables
			*/
			for (var i=0; i<sortedList.length; i++){
				//look at th month
				var month = sortedList[i].birthday.slice(0,2);
				//assign birthday month according
				if 		(month == "01"){Jan.push(sortedList[i]);}
				else if (month == "02"){Feb.push(sortedList[i]);}
				else if (month == "03"){Mar.push(sortedList[i]);}
				else if (month == "04"){Apr.push(sortedList[i]);}
				else if (month == "05"){May.push(sortedList[i]);}
				else if (month == "06"){Jun.push(sortedList[i]);}
				else if (month == "07"){Jul.push(sortedList[i]);}
				else if (month == "08"){Aug.push(sortedList[i]);}
				else if (month == "09"){Sept.push(sortedList[i]);}
				else if (month == "10"){Oct.push(sortedList[i]);}
				else if (month == "11"){Nov.push(sortedList[i]);}
				else if (month == "12"){Dec.push(sortedList[i]);}
				else {unknown.push(friends.data[i]);}
			};

			var percentage = [];
			percentage.push((Jan.length/Nfriends*100).toFixed(2));
			percentage.push((Feb.length/Nfriends*100).toFixed(2));
			percentage.push((Mar.length/Nfriends*100).toFixed(2));
			percentage.push((Apr.length/Nfriends*100).toFixed(2));
			percentage.push((May.length/Nfriends*100).toFixed(2));
			percentage.push((Jun.length/Nfriends*100).toFixed(2));
			percentage.push((Jul.length/Nfriends*100).toFixed(2));
			percentage.push((Aug.length/Nfriends*100).toFixed(2));
			percentage.push((Sept.length/Nfriends*100).toFixed(2));
			percentage.push((Oct.length/Nfriends*100).toFixed(2));
			percentage.push((Nov.length/Nfriends*100).toFixed(2));
			percentage.push((Dec.length/Nfriends*100).toFixed(2));
			percentage.push((unknown.length/Nfriends*100).toFixed(2));
			
			var data = {
				birthday:{
					"Jan":Jan,
					"Feb":Feb,
					"Mar":Mar,
					"Apr":Apr,
					"May":May,
					"Jun":Jun,
					"Jul":Jul,
					"Aug":Aug,
					"Sept":Sept,
					"Oct":Oct,
					"Nov":Nov,
					"Dec":Dec,
					"unknown":unknown
				},
				percentage:percentage
			};
			var sum = 0;
			for (var i=0; i<percentage.length;i++){
				sum = sum + data.percentage[i];
			}
			// var birthday = data.birthday;
			 console.log(data);
	  		res.render('home', data);
		});
	// console.log(data);
	// res.render("facebook", data);
}