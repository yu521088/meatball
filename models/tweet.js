var mongodb = require('./db');
function Tweet(content, user, time){
	this.content = content;
	this.user = user;
	if(time){
		this.time = time;
	}else{
		this.time = new Date().getTime();
	}
}

module.exports = Tweet;

Tweet.prototype.save = function(callback){
	var tweet = {
		content: this.content,
		user: this.user,
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
			collection.ensureIndex('time', function(){console.log('error in ensureIndex');});
			collection.insert(tweet, {safe: true},function(err, tweet){
				mongodb.close();
				return callback(err, tweet);
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
					var tweet = new Tweet(doc.content, doc.user, new Date(doc.time).toLocaleDateString());
					tweets.push(tweet);
				});
				callback(null, tweets);
			});
		});
	});
}