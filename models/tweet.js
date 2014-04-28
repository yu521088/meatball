var mongodb = require('./db');
function Tweet(content, user, time){
	this.post = content;
	this.user = user;
	if(time){
		this.time = time;
	}else{
		this.time = new Date();
	}
}

module.exports = Tweet;

Tweet.prototype.save = function(callback){
	var tweet = {
		user: this.user,
		content: this.content,
		time: this.time
	}
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('tweet',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user', function(err){});
			collection.insert(tweet, {safe: true},function(err, tweet){
				mongodb.close();
				return callback(null, tweet);
			});
		});
	});
}

Tweet.get = function(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('tweet',function(err, collection){
			if(err){
				mongodb.close();
				callback(err,null);
			}
			var query = {};
			if(username){
				query.user = username;
			}
			collection.find(query).sort({time:-1}).toArray(function(err, docs){
				mongodb.close();
				var tweets = [];
				docs.forEach(function(doc, index){
					var tweet = new Tweet(doc.post, doc.user, doc.time);
					tweets.push(tweet);
				});
				callback(null, tweets);
			});
		});
	});
}