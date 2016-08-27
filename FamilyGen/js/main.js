//IDEA: Remove jquery.csv.js?
$(document).ready(function() {
  console.log('loading succesful');


  var maleFront = document.getElementById('maleName');
  var femaleFront = document.getElementById('femaleName');
  var maleNameNum = chance.integer({min: 0, max: 6287});
  var femaleNameNum = chance.integer({min: 0, max: 4390});
  var maleNames = "http://192.168.178.24:8080/js/materials/maleNames.csv";
  var femaleNames = "http://192.168.178.24:8080/js/materials/femaleNames.csv";
  var surnames = "http://192.168.178.24:8080/js/materials/surnames.csv";


  Papa.parse(maleNames, {
    download: true,
    complete: function(output) {
      console.log(output.data);
      var mName = output.data
      maleFront.innerHTML = mName[maleNameNum];
    }
  });
  Papa.parse(femaleNames, {
    download: true,
    complete: function(output) {
      var fName = output.data;
      femaleFront.innerHTML = fName[femaleNameNum];
    }
  });

});
