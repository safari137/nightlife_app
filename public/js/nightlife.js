$("#findBars").on('click', function() {
    var area = $("#location").val();
    findAndLoadBars(area);
});

$(".locations").on('click', "button", function() {
    var id = $(this).attr('id');
    sendAttendingPost(id);
});

checkAutoSearch();

var barData = [];
var barAtendees = [];

function findAndLoadBars(area) {
    $.get("/api/search/?find=bar&area=" + area, function(data) {
       data.forEach(function(business, index, arr) {
            barData[index] = { name: business.name, img: business.image_url, snippet: business.snippet_text, id: business.id };
            getUsersAttending(business.id, function(data) {
                barAtendees[index] = data.length;
                tryDisplayBars(true);
            });
            
            if (index === arr.length - 1) {
                tryDisplayBars(true);
            }
       }); 
    });
}

function getUsersAttending(businessId, callback) {
    $.get("/api/attending/" + businessId, function(data) {
        callback(data);
    });
}


function tryDisplayBars(isFading) {
    if (barAtendees.length !== barData.length)
        return;
        
    $(".locations").html('');
    
    for (var i = 0; i < barData.length; i++) {
        
        var html = "<div class='bordered row location'>" +
                   "<div class='col-lg-1 col-md-2 col-sm-4 text-center'><img class='img' src='" + barData[i].img + "'></div>" +
                   "<div class='col-lg-11 col-md-10 col-sm-8'>" +
                   "<div class='location-title'>" + barData[i].name + "<button class='btn btn-success btn-xs' " + "id='" + barData[i].id + "'>" + barAtendees[i] + " Going</button>" + 
                   "<span class='error-message'></span></div>" +
                   "<div class='location-snippet'>\"" + barData[i].snippet + "\"</div></div></div>";
        
        if (isFading)             
            $(".locations").hide().append(html).fadeIn('slow');
        else
            $(".locations").append(html);
        
    }
}

function sendAttendingPost(id) {
    var url = "/api/attending/" + id; 
    $.post(url)
        .done(function() {
            updateAndDisplayAtendees();
        })
        .error(function(msg) {
            $("#" + msg.responseJSON.id).parent(".location-title").children(".error-message").html(msg.responseJSON.error).fadeIn('slow').delay(10000).fadeOut('slow');
        });
}

function updateAndDisplayAtendees() {
    barAtendees = [];
    
    barData.forEach(function(bar, index, arr) {
        getUsersAttending(bar.id, function(data) {
           barAtendees[index] = data.length; 
           tryDisplayBars(false);
        });
    });
}

function checkAutoSearch() {
    var search = $("#hasHomeSearchArea").val();
    
    if (search === 'false') return;
    
    findAndLoadBars(undefined);
}

