//TODO add time periods
//TODO make first changes towards families
var Papa = require('babyparse');
var fs = require('fs');
var Chance = require('chance'), chance = new Chance();
var prompt = require('prompt');
var colors = require('colors');
var readline = require('readline')

//The variables core variables, used for the names and terminal input
var MaleNames = './materials/maleNames.csv', maleNames = fs.readFileSync(MaleNames, { encoding: 'binary' });
var FemaleNames = './materials/femaleNames.csv', femaleNames = fs.readFileSync(FemaleNames, { encoding: 'binary' });
var Surnames = './materials/surnames.csv', surnames = fs.readFileSync(Surnames, { encoding: 'binary' });
var Values = './materials/values.csv', valuesFile = fs.readFileSync(Values, {encoding:'binary'});
var rl = readline.createInterface(process.stdin, process.stdout);

//Settings, e.g. likelihood; To be replaced with csv files
var isBorn = 35;
var tickSpeed = 3000; //Given in Miliseconds
var eras = {medieval: 0, renaissance: 500, industrial: 800, modern: 1000};

var peopleAmount = 0;
var people = {};
var year = 0;

rl.setPrompt('Year is '+year+'.  > ');

//All of the functions are stored here. They should be pretty self-explanatory
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
  //DEBUG: console_out('Created Entry: ' + name + ' with ID: ' + id.green + '. Gender is: ' + gender.red);
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
          console_out(people[element].name +' '+people[element].lastName+' has died at the age of '+people[element].age);
        }
      }else if (between(age, values[8][2], values[9][2])) {
        var death = chance.bool({likelihood: values[2][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
          console_out(people[element].name +' '+people[element].lastName+' has died at the age of '+people[element].age);
        }
      }else if (between(age, values[8][3], values[9][3])) {
        var death = chance.bool({likelihood: values[3][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
          console_out(people[element].name +' '+people[element].lastName+' has died at the age of '+people[element].age);
        }
      }else if (between(age, values[8][4], values[9][4])) {
        var death = chance.bool({likelihood: values[4][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
          console_out(people[element].name +' '+people[element].lastName+' has died at the age of '+people[element].age);
        }
      }else if (between(age, values[8][5], values[9][5])) {
        var death = chance.bool({likelihood: values[4][1]});
        if(death==true){
          people[element].dead = true;
          people[element].yearOfDeath = year;
          console_out(people[element].name +' '+people[element].lastName+' has died at the age of '+people[element].age);
        }
      }
    }
  })
};

//This function allows for the bottom line of the terminal to stay free of output.
//https://code.tutsplus.com/tutorials/real-time-chat-with-nodejs-readline-socketio--cms-20953
function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (msg !== undefined) {
    console.log(msg);
  };
    rl.prompt(true);
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
          console_out(mName +' '+ sName + ' was stillborn.');
        }else{
          newEntry(cleanFemaleName + cleanSurname, gender, fName, sName, year, true);
          console_out(fName +' ' +sName + ' was stillborn.');
        }
      }else{
        if(gender=='Male'){
          newEntry(cleanMaleName + cleanSurname, gender, mName, sName, year);
          console_out(mName+' '+sName+" was born! It's a boy!");
        }else if (gender=='Female') {
          newEntry(cleanFemaleName + cleanSurname, gender, fName, sName, year);
          console_out(fName+' '+sName+" was born! It's a girl!");
        };
      }
    };
    //All values are increased here and the loop is restarted.
    rl.setPrompt('Year is '+year+'.  > ');
    console_out();
    unleashGrimReaper();
    year++
    increaseAge();
    loop();
  }, tickSpeed);
};

//This kicks of the main loop (no shit sherlock)
loop();

//This is the event handler for pressing enter. All commands are to be stored here.
rl.on('line', function (line) {
  var input = line.split(' ');
  var list = Object.keys(people);
  if(input[0]=='info'){
    if(input[1]==undefined){
      console_out('Please enter a name as well.'.red)
    }else{
      var dataSource = input[1]
      console.log(dataSource);
      console.log(people[dataSource]);
    }
  }else if (input[0]=='exit') {
    console.log('Exiting...');
    process.exit();
  }else if (input[0]=='people') {
    console_out('\n');
    console_out('-----------------------------------------------'.green);
    if(people.length==0){
      console_out('There are currently no people (for whatever reason)');
    }else{
      if(input[1]=='alive'){
        var i = 0;
        list.forEach(function(element){
          if(people[element].dead!==true){
            console_out(element+' is currently ' + people[element].age.toString().green + ' years old.')
            i++
          };
        });
        if(i==0) {
          console_out('There is no one currently alive');
        }
      }else{
        list.forEach(function(element){
          if(people[element].dead==true){
            console_out(element + ', currently ' + 'dead.'.red);
          }else{
            console_out(element + ', currently ' + 'alive.'.green);
          };
        });
      };
    }
    console_out('-----------------------------------------------'.green);
    console_out('\n');
  }else if (input[0]=='help') {
    console_out('\ninfo\nexit\npeople\n')
  };
  rl.prompt(true);
});
