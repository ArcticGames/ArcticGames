var Papa = require('babyparse');
var fs = require('fs');
var Chance = require('chance'), chance = new Chance();

var MaleNames = './materials/maleNames.csv', maleNames = fs.readFileSync(MaleNames, { encoding: 'binary' });
var FemaleNames = './materials/femaleNames.csv', femaleNames = fs.readFileSync(MaleNames, { encoding: 'binary' });
var maleNameNum = chance.integer({min: 0, max: 6287});
var femaleNameNum = chance.integer({min: 0, max: 4390});

Papa.parse(maleNames, {
  complete: function(output) {
    mName = output.data;
  }
});
Papa.parse(femaleNames, {
  complete: function(output) {
    fName = output.data;
  }
});

console.log(mName[maleNameNum].toString());
console.log(fName[femaleNameNum].toString());



/*var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve  = serveStatic('../');

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});
server.listen(8000);
*/
