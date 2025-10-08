const appRoot = '/glits/web/code/iDoseMate/node';
var log = require('../../../../../utils/logmessages');
var std = require('../../../../../utils/standardMessages');
var df = require('../../../../../utils/dflower.utils');
var jsonUtils = require('../../../../../utils/json.utils');
var sqldb = require('../../../../../config/db.config');
var cntxtDtls = df.getModuleMetaData(__dirname, __filename);
var dbutil = require('../../../../../utils/db.utils');

exports.checkPermissionMdl = function (obj, user, callback) {
  var fnm = "checkPermissionMdl"

  var QRY_TO_EXEC = ``;

  return dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, user,fnm);
};