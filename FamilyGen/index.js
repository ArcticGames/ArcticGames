//TODO add time periods
//TODO make first changes towards families
//TODO switch person identifiers over to ID's
var remote = require('electron').remote;
var main = remote.require('./main.js');
var {ipcRenderer} = require('electron');
var Papa = require('babyparse');
var fs = require('fs');
var Chance = require('chance'), chance = new Chance();
var prompt = require('prompt');
var colors = require('colors');

var MaleNames = './materials/maleNames.csv', maleNames = fs.readFileSync(MaleNames, { encoding: 'binary' });
var FemaleNames = './materials/femaleNames.csv', femaleNames = fs.readFileSync(FemaleNames, { encoding: 'binary' });
var Surnames = './materials/surnames.csv', surnames = fs.readFileSync(Surnames, { encoding: 'binary' });
var Values = './materials/values.csv', valuesFile = fs.readFileSync(Values, {encoding:'binary'});

//Settings, e.g. likelihood; To be replaced with csv files
var isBorn = 35;
var tickSpeed = 3000; //Given in Miliseconds
var eras = {medieval: 0, renaissance: 500, industrial: 800, modern: 1000};

var peopleAmount = 0;
var people = {};
var year = 0;

//All of the functions are stored here. They should be pretty self-explanatory
function newScreenOutput(input, destination, className){
  let element = document.createElement('P');
  var ticker = document.getElementsByClassName('ticker')[0];
  let idName = document.getElementById("ticker")
  element.innerHTML = input;
  if(className !== undefined){
    element.classList.add(className);
  };
  if(destination=='ticker'){
    var isScrolledToBottom = idName.scrollHeight - idName.clientHeight <= idName.scrollTop + 1;
    ticker.appendChild(element);
    if(isScrolledToBottom){
      idName.scrollTop = idName.scrollHeight - idName.clientHeight;
    };
  };
};
function newEntry(name, gender, fname, lastName, birthyear, isDead) {
  var foo = chance.natural({min:1, max:999999});
  var id = chance.pad(foo, 6);
  var age = 0; //chance.natural({min:0, max:90})
  if(isDead==true){
    people[name] = {
      id: id,
      name: fname,
      lastName: lastName,
      gender: gender,
      age: age,
      birthyear: birthyear,
      attributes: [{}],
      str: undefined,
      int: undefined,
      dxt: undefined,
      dead: true,
      yearOfDeath: birthyear
    };
  }else{
    people[name] = {
      id: id,
      name: fname,
      lastName: lastName,
      gender: gender,
      age: age,
      birthyear: birthyear,
      attributes: [{}],
      str: undefined,
      int: undefined,
      dxt: undefined
    };
  };
};
function between(x, min, max) {
  return x >= min && x <= max;
};
//This function checks who will die this year by using values from a CSV file.
function unleashGrimReaper(){
  list = Object.keys(people);
  list.forEach(function(element){
    var age = people[element].age;
    if(people[element].dead!==true){
      if(between(age, values[8][1], values[9][1])) {
        var death = chance.bool({likelihood: values[1][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }else if (between(age, values[8][2], values[9][2])) {
        var death = chance.bool({likelihood: values[2][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }else if (between(age, values[8][3], values[9][3])) {
        var death = chance.bool({likelihood: values[3][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }else if (between(age, values[8][4], values[9][4])) {
        var death = chance.bool({likelihood: values[4][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }else if (between(age, values[8][5], values[9][5])) {
        var death = chance.bool({likelihood: values[4][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }else{
        var death = chance.bool({likelihood: 50});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
        }
      }
    }
  })
};
//TODO: Add a new message for death at birth
function increaseAge() {
  list = Object.keys(people)
  list.forEach(function(element){
    if(people[element].dead!==true){
      people[element].age = people[element].age + 1;
    }
  });
};

//The name.csv lists are parsed and stored in an array here
Papa.parse(maleNames, {
  complete: function(output) {
    mOutName = output.data;
  }
});
Papa.parse(femaleNames, {
  complete: function(output) {
    fOutName = output.data;
  }
});
Papa.parse(surnames, {
  complete: function(output) {
    sOutName = output.data;
  }
});
Papa.parse(valuesFile, {
  complete: function(output) {
    values = output.data;
    //console.log(values[8][1]);
  }
});

//The main loop, created so it would have a 3 second delay before generating a new person.
function loop() {
  setTimeout(function(){
    //The variables that need to be regenerated every 3 seconds.
    var gender = chance.gender();
    var maleNameNum = chance.integer({min: 0, max: 6287});
    var femaleNameNum = chance.integer({min: 0, max: 4390});
    var surnameNum = chance.integer({min: 0, max: 10446})
    var mName = mOutName[maleNameNum].toString();
    var fName = fOutName[femaleNameNum].toString();
    var sName = sOutName[surnameNum].toString();
    var cleanMaleName = mName.toLowerCase().split(' ')[0]+'_';
    var cleanFemaleName = fName.toLowerCase().split(' ')[0]+'_';
    var CleanSurname = sName.toLowerCase(), cleanSurname = CleanSurname.replace(/ /g, '_');
    var born = chance.bool({likelihood: isBorn});
    //Here it is checked if a child is born this year, and if so which gender it is.
    if(born==true){
      var deathAtBirth = chance.bool({likelihood: values[1][1]});
      if(deathAtBirth==true){
        if(gender=='Male'){
          newEntry(cleanMaleName + cleanSurname, gender, mName, sName, year, true);
        }else{
          newEntry(cleanFemaleName + cleanSurname, gender, fName, sName, year, true);
        }
      }else{
        if(gender=='Male'){
          newEntry(cleanMaleName + cleanSurname, gender, mName, sName, year);
          newScreenOutput(mName + ' ' + sName + ' was born.', 'ticker', 'birthMessage');
        }else if (gender=='Female') {
          newEntry(cleanFemaleName + cleanSurname, gender, fName, sName, year);
          newScreenOutput(fName + ' ' + sName + ' was born.', 'ticker', 'birthMessage');
        };
      }
    };
    //All values are increased here and the loop is restarted.
    unleashGrimReaper();
    year++
    increaseAge();
    loop();
  }, tickSpeed);
};

//This kicks of the main loop (no shit sherlock)
loop();
