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
    
    this.sendBlankOrUserPage = function(req, res) {
        if (!req.isAuthenticated()) {
            res.render("index", { isAuthenticated: false,hasHomeSearchArea: false });
            return;
        }
        
        var user = req.user;
        
        var hasHomeSearchArea = (user.homeSearchArea !== undefined && user.homeSearchArea.length > 0);
        
        res.render("index", {isAuthenticated: true, hasHomeSearchArea: hasHomeSearchArea});
    }
    
    var search = function(area, business, callback) {
        client.search({
            term: business,
            location: area
        })
        .then(function(data) {
           callback(data.businesses);
        });
    }
    
    this.apiSearch = function(req, res) {
        var query = req.query;
        
        if (req.isAuthenticated())
            console.log(req.user.homeSearchArea);
        
        var isMissingCriteria = (!query.hasOwnProperty("area") || !query.hasOwnProperty("find"));
        var hasHomeSearchArea = (req.hasOwnProperty('user[homeSearchArea]')) ? true : false;
        
        if (isMissingCriteria && !hasHomeSearchArea) {
            res.send({error: "Must send info for find and area"});
            return;
        } 
        
        var business = query.find;
        console.log(query.area);
        var area = (query.area !== "undefined") ? query.area : req.user.homeSearchArea;
        
        
        if (req.isAuthenticated() && area !== req.user.homeSearchArea)
            setUserSearch(req.user._id, area);
    
        search(area, business, function(data) {
            res.json(data);
        });
    }
    
    var setUserSearch = function(userId, area) {
        if (area === "undefined")
            return;
            
        console.log('setting search of ' + area);
        
        User.findById(userId, function(err, user) {
            if (err) throw err;
            
            user.homeSearchArea = area;
            user.save();
        });
    }
    
    this.markAttending = function(req, res) {
        var eventId = req.params.id;
        
        if (!req.isAuthenticated()) {
            res.writeHead(400, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({ "error" : "You must be logged in.", "id" : eventId ,"status" : 400 }));
            return;
        }
        
        User.findOne({_id: req.user._id}, function(err, user) {
           if (err) throw err;
           
           var userAlreadyAttending =  (user.attending.id === eventId);
           var noLongerAttending = { id: "", date: Date.now() };
           
           if (userAlreadyAttending) {
               user.attending = noLongerAttending;
           } else {
               user.attending.id = eventId;
               user.attending.date = Date.now();
           }
           
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
