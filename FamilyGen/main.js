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

//Settings, e.g. likelihood
var isBorn = 35;
var tickSpeed = 3000; //Given in Miliseconds
var eras = {medieval: 0, renaissance: 500, industrial: 800, modern: 1000};

var peopleAmount = 0;
var people = {};
var year = 0;

rl.setPrompt('Year is '+year+'.  > ');
//All of the functions are stored here. They should be pretty self-explanatory
function newEntry(name, gender, fname, lastName, birthyear) {
  var foo = chance.natural({min:1, max:999999});
  var id = chance.pad(foo, 6);
  var age = 0; //chance.natural({min:0, max:90})
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
  //DEBUG: console_out('Created Entry: ' + name + ' with ID: ' + id.green + '. Gender is: ' + gender.red);
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
//TODO: Make them be able to die using a new attribute which is checked.
function increaseAge() {
  list = Object.keys(people)
  list.forEach(function(element){
    people[element].age = people[element].age + 1;
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
    var born = chance.bool({likelihood: isBorn});
    //Here it is checked if a child is born this year, and if so which gender it is.
    if(born==true){
      if(gender=='Male'){
        newEntry(mName.toLowerCase() + '_' + sName.toLowerCase(), gender, mName, sName, year);
        console_out(mName+' '+sName+" was born! It's a boy!");
      }else if (gender=='Female') {
        newEntry(fName.toLowerCase() + '_' + sName.toLowerCase(), gender, fName, sName, year);
        console_out(fName+' '+sName+" was born! It's a girl!");
      };
    };
    //All values are increased here and the loop is restarted.
    rl.setPrompt('Year is '+year+'.  > ');
    console_out();
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
  if(input[0]=='info'){
    var dataSource = input[1]
    console.log(dataSource);
    console.log(people[dataSource]);
    console_out(people[dataSource].attributes[0].test)
  }else if (input[0]=='exit') {
    console.log('Exiting...');
    process.exit();
  };
  rl.prompt(true);
});
