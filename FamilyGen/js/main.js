//IDEA: Remove jquery.csv.js?
$(document).ready(function() {
  console.log('loading succesful');
  var csvfile = "http://192.168.178.24:8080/js/materials/maleNames.csv";

   Papa.parse(csvfile, {
    download: true,
    complete: function(output) {
      console.log(output.data);
      var thing = output.data
      alert(thing[6]);
    }
  })


});
