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
            
        User.findOne({email: req.params.user}, function(err, user) {
           if (err) throw err;
           
           user.attending = eventId;
           user.save();
           res.send(user);
        });
    }
    
    this.getUsersAttending = function(req, res) {
        var eventId = req.params.id;
        
        User.find({attending: eventId}, function(err, users) {
           if (err) throw err;
           
           res.send(users.map(function(user) {
                return { email: user.email }; 
           }));
        });
    }
}

module.exports = yelpController;