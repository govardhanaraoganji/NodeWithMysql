var Sequelize = require('sequelize');
var Users = require('./Models/users');

var models = {};

exports.connect = function(host, port, dbName, userName, password, cb){
    var sequelize = new Sequelize(dbName, userName, password, {
        // default db values
        // host: localhost,
        // port: 3306,
        host: host,
        port: port,
        dialect: 'mysql',
        logging: false,
        syncOnAssociation: true,
        define: { timestamps: false } 
    });
    models.User = sequelize.define('User', Users.getSchema(), {tableName: Users.getTableName()});
    
    // sequelize.sync({force:true}).then(function(){    // Note: This will delete the tables and create them again.
    sequelize.sync().then(function(){
        cb();
    }).catch(function(err){
        console.log("Error while connecting to Db: " + err.message);
    });
};

exports.getModels = function(){
    return models;
};

exports.getUserModel = function(){
    return models.User;
};

exports.getUserHubModel = function(){
    return models.UserHub;
};

exports.getUserDeviceModel = function(){
    return models.UserDev;
};