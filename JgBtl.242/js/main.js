$(document).ready(function() {
  var d = new Date();
  var nextEvent = new Date(
  $('.clock').attr('date-timer', )
  $('.clock').TimeCircles({
    "animation": "ticks",
    "bg_width": 0.7,
    "fg_width": 0.04,
    "circle_bg_color": "#90989F",
    "time": {
        "Days": {
            "text": "Days",
            "color": "#40484F",
            "show": true
        },
        "Hours": {
            "text": "Hours",
            "color": "#40484F",
            "show": true
        },
        "Minutes": {
            "text": "Minutes",
            "color": "#40484F",
            "show": true
        },
        "Seconds": {
            "text": "Seconds",
            "color": "#40484F",
            "show": true
        }
    }
}).addListener(function(unit, value, total) {
    if(total < 1500) {
      console.log('It appears to work');
    };
  });

  console.log(d.getSeconds());




});
