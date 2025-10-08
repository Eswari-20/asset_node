var nconf = require('nconf') 
fs = require('fs'),
  path = require('path');



// add multiple files, hierarchically. notice the unique key for each file
var loadConfigFiles = function () {
  nconf.file('app', appRoot + '/config/app.config.json');
}



/*****************************************************************************
* Function 		  : getSettings
* Description   : get all the settings
* Arguments		  : callback function
******************************************************************************/
exports.getSettings = function (callback) {
  loadConfigFiles();
  var t_settings = {
    "app": nconf.get('app'),
  }

  return t_settings;
};


