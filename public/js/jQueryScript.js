var daysArr = [];

// ICONS
var hIcon = {
    url: 'http://findicons.com/files/icons/2016/vista_style_objects/256/hotel.png', // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
};

var rIcon = {
    url: 'http://proprofs-cdn.s3.amazonaws.com/images/games/user_images/misc/5211927825.png', // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
};

var aIcon = {
    url: 'http://www.myiconfinder.com/uploads/iconsets/256-256-3cea34f4f64da133115b80638b96a2be.png', // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
};

function dayCreator() {
    // Pushes a blank new day to the days Array
    daysArr.push({
        hotels: [],
        restaurants: [],
        activities: []
    });
}

function populate(day) {
    var img, blockName, arr;
    for (var key in day) {
        arr = day[key];
        switch (key) {
            case "hotels":
            	img = hIcon;
                //img = '/images/lodging_0star.png';
                blockName = "hotels-itin";
                break;
            case "restaurants":
                img = rIcon;
                blockName = "restaurants-itin";
                break;
            case "activities":
                img = aIcon;
                blockName = "activities-itin";
                break;
        }
        // Now change the DOM
        arr.forEach(function(elem) {
                $("#"+blockName).append(
                    '<span class="title">' + elem.name + '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></span>'
                );

                drawLocation(elem.place.location, {
                    icon: img
                })
            })
        };
}

var currDay; 

function reset(something) {
	// Change text in header
    $("#day-title span").text('Day ' + something.text());
    // Remove the current-day class from previous element
    $(".current-day").removeClass("current-day");
    // Make the day current
    something.addClass("current-day");
    currDay = parseInt($(".current-day").text());
    console.log("current day is now", currDay)
    // Remove everything from the sidebar
    $('.itinerary-item').empty();
    console.log($('.itinerary-item'))
    // Remove markers from map
    markers.forEach(function(elem) {
        elem.setMap(null);
    });
    markers = [];
    // Add info for clicked day
    populate(daysArr[currDay - 1]);
}


$(document).ready(function() {
            // Start with one day
            dayCreator();
            // Save current day #
            currDay = parseInt($(".current-day").text());

            $(".hotel_add").click(function() {
                var hotelcontent = $("#hotel_dropdown option:selected").val();
                $("#hotels-itin").append(
                    '<span class="title">' + hotelcontent + '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></span>'
                );
                var foundHotel;
                for (var i = 0; i < hotels.length; i++) {
                    if (hotels[i].name == hotelcontent) {
                        foundHotel = hotels[i];
                    }
                }
                drawLocation(foundHotel.place.location, {
                    icon: hIcon
                })

                // ADD TO ARRAY
                daysArr[currDay - 1].hotels.push(foundHotel);
            });

            $(".rest_add").click(function() {
                var restcontent = $("#rest_dropdown option:selected").val();
                $("#restaurants-itin").append(
                    '<span class="title">' + restcontent + '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></span>'
                );
                var foundRest;
                for (var i = 0; i < restaurants.length; i++) {
                    if (restaurants[i].name == restcontent) {
                        foundRest = restaurants[i];
                    }
                }
                drawLocation(foundRest.place.location, {
                    icon: rIcon
                })

                // ADD TO ARRAY
                daysArr[currDay - 1].restaurants.push(foundRest);
            });

            $(".act_add").click(function() {
                var actContent = $("#act_dropdown option:selected").val();
                $("#activities-itin").append(
                    '<span class="title">' + actContent + '<button class="btn btn-xs btn-danger remove btn-circle pull-right">x</button></span>'
                );
                var foundAct;
                for (var i = 0; i < activities.length; i++) {
                    if (activities[i].name == actContent) {
                        foundAct = activities[i];
                    }
                }
                drawLocation(foundAct.place.location, {
                    icon: aIcon
                });

                // ADD TO ARRAY
                daysArr[currDay - 1].activities.push(foundAct);
            });

            // REMOVE FROM ITINERARY
            $(".itinerary-item").on("click", "button", function() {
            	var item = $(this).closest(".title");
            	var itinType = item.closest("div").attr("id").slice(0,-5);
            	var itinName = item.text().slice(0,-1);
            	var itinObj = {};


            	// Remove from DOM
                item.remove();

                

                // Remove from daysArr
                daysArr[currDay-1][itinType] = daysArr[currDay-1][itinType].filter(function(obj) {
                	if (obj.name == itinName) {
                		itinObj = obj;
                	}
                	return (obj.name !== itinName);
                });

                // Remove from map
                markers.forEach(function(marker) {
                	var ObjLat = itinObj.place.location[0].toFixed(4);
                	var ObjLng = itinObj.place.location[1].toFixed(4);
                	if (ObjLat == marker.position.lat().toFixed(4) 
                	&& ObjLng == marker.position.lng().toFixed(4)) {
                		marker.setMap(null);
                	}
                })
            })

            $(".day-buttons").on("click", ".add-btn", function() {

                // Create new day
                var nextday = parseInt($(this).prev(".day-btn").text()) + 1;
                $(this).before(
                    '<button class="btn btn-circle day-btn enum-btn">' + nextday + '</button> '
                );
                dayCreator();
            });

            $(".day-buttons").on("click", ".enum-btn", function() {
            	reset($(this))
            });

            $("#day-title").on("click", "button", function() {
            	// delete index from daysArr
            	daysArr.splice(currDay - 1, 1);
            	// Get previous button to pass to reset()
				reset($(".enum-btn.current-day").prev(".enum-btn"));

            	// Delete last button
            	$(".enum-btn").last().remove();

        });
})