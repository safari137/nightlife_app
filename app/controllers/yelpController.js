var yelp = require("node-yelp"),
    User = require("../models/user");

var yelpController = function() {

    var client = yelp.createClient({
        oauth: {
            consumer_key:       process.env.YELP_CKEY,
            consumer_secret:    process.env.YELP_CSECRET,
            token:              process.env.YELP_TOKEN,
            token_secret:       process.env.YELP_TOKENSECRET
        }
    });
    
    this.search = function(req, res) {
        var query = req.query;
        
        if (!query.hasOwnProperty("area") || !query.hasOwnProperty("find")) {
            res.send({error: "Must send info for find and area"});
            return;
        }
        
        var search = query.find;
        var area = query.area;
    
        client.search({
            term: search,
            location: area
        })
        .then(function(data) {
           res.json(data.businesses);
        });
    }
    
    this.markAttending = function(req, res) {
        var eventId = req.params.id;
            
        User.findOne({_id: req.user._id}, function(err, user) {
           if (err) throw err;
           
           user.attending.id = eventId;
           user.attending.date = Date.now();
           user.save();
           res.end();
        });
    }
    
    this.getUsersAttending = function(req, res) {
        var eventId = req.params.id;
        
        User.find({"attending.id" : eventId}, function(err, users) {
           if (err) throw err;

           res.send(users.filter(function(value) {
               return (isSameDay(value.attending.date, Date.now()))
           }).map(function(user) {
                return { email: user.email }; 
           }));
        });
    }
}

module.exports = yelpController;

function isSameDay(day1, day2) {
    var timeDifference = day2 - day1;
    var hours = timeDifference/3600000;
    
    return (hours < 24)
}
