$(document).ready(function() {
  var nextEvent = new Date(2016, 7, 27)
  var now = new Date()
  var diff = (nextEvent.getTime()/1000) - (now.getTime()/1000);
  var clock = $('.clock').FlipClock(diff, {
		clockFace: 'DailyCounter',
		countdown: true,
		showSeconds: false
	});

    var time  = clock.getCountdown();
    alert(time);





})
