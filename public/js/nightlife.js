$("#findBars").on('click', function() {
    findAndLoadBars();
});

var barNames = [];
var barAtendees = [];

function findAndLoadBars() {
    var area = $("#location").val();
    $.get("/api/search/?find=bar&area=" + area, function(data) {
       data.forEach(function(business, index, arr) {
            barNames[index] = business.name;
            getUsersAttending(business.id, index);
            
            if (index === arr.length - 1) {
                tryDisplayBars();
            }
       }); 
    });
}

function getUsersAttending(businessId, index) {
    $.get("/api/attending/" + businessId, function(data) {
        barAtendees[index] = data.length;
        tryDisplayBars();
    });
}


function tryDisplayBars() {
    if (barAtendees.length !== barNames.length)
        return;
    
    for (var i = 0; i < barNames.length; i++) {
        var html = "<div class='location'><strong>" + barNames[i] + "</strong> - " + barAtendees[i] + "</div>";
        $(".locations").append(html);
    }
}

