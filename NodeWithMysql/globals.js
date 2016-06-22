var Path = require('path');

function Globals() {
};

//DB configurations
Globals.prototype.MongoPort = 27017;
Globals.prototype.MongoHost = '127.0.0.1';
Globals.prototype.MongoDB = 'test1';

//Mysql DB configurations
Globals.prototype.MySqlPort = 3306;
Globals.prototype.MySqlHost = '127.0.0.1';
Globals.prototype.MySqlDB = "SampleApp";
Globals.prototype.MySqlUser = "root";
Globals.prototype.MySqlPass = "root";

Globals.prototype.LoggerConfig = {
    appenders: [
        {type: 'console'},
        {
            "type": "file",
            "filename": Globals.prototype.appRoot + "/logs/log_file.log",
            "maxLogSize": 10485760,
            "backups": 100,
            "category": "relative-logger"
        }
    ]
};

module.exports = new Globals();
