var electron = require('electron');
var {app, BrowserWindow, ipcMain} = electron;
var remote = require('electron').remote;

//The variables core variables, used for the names
exports.openWindow = function(){
  let win = new BrowserWindow({width:300, height:300});
  win.loadURL('https://google.com');
};

app.on('ready',function(){
  let win = new BrowserWindow({width:800, height:600});
  win.loadURL(`file://${__dirname}/index.html`);
});

/*electron.app.on('browser-window-created',function(e,window) {
    window.setMenu(null);
});*/
