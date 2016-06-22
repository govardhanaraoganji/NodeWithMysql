var express = require('express')
    , router = express.Router()
    , db = require('../../mySqlDB')
    , Globals = require('../../globals')
    , mongodb = require('../../db');

log4js.configure(Globals.LoggerConfig);
var logger = log4js.getLogger('relative-logger');

function User() {
    _.bindAll(this, "authenticateUser", "loginUser", "registerUser", 
                    "logout", "getModels");
                    
    router.post('/authenticate', this.authenticateUser);
    router.post('/login', this.loginUser);
    router.post('/register', this.registerUser);
    router.post('/logout', this.logout);

    this.router = router;
    this.getModels();
    return this;
};

User.prototype.getModels = function(){
    if(this.userModel){
        return ;
    }
    var Models = db.getModels();
    this.userModel = Models.User;
};

/**
 * Sample API request params
 * {
 *  "email_id": "xxx@xxx.com"
 * }
 **/
User.prototype.authenticateUser = function (req, res) {
    logger.trace('authenticateUser Start' + JSON.stringify(req.body));
    var that = this;
    var email_id = req.body.email_id.toLowerCase();

    that.userModel.findAll({where: {email_id: email_id}})
        .then(function (docs) {
            docs = docs[0];
            if (!docs) {
                res.send({status: 1, message: "User doesn't exist."});
            }else{
                res.send({status: 1, message: "User exist, Please user another email."});
            }
        })
        .catch(function(err){
            logger.error(err.message);
            res.send({status: 0, message: "Data Base error: " + err.message + ". Please try again."});
        });
    logger.trace('authenticateUser End');
};

/**
 * Sample API request params
 * {
 *  "email_id": "xxx@xxx.com",
 *  "password": "qwerty"
 * }
 **/
User.prototype.loginUser = function (req, res) {
    logger.trace('loginUser Start' + JSON.stringify(req.body));
    var obj = {email_id: req.body.email_id.toLowerCase()}, that = this;

    that.userModel.findAll({where: obj})
        .then(function (arr) {
            if (arr.length === 0) {
                res.send({status: 0, message: "User doesn't exist."});
            } else {
                arr = arr[0];
                if (arr.password !== req.body.password) {
                    res.send({status: 0, message: "Password Incorrect."});
                }else{
                    res.send({status: 1, message: "Login successfully.", user: arr});
                }
            }
        })
        .catch(function(err){
            logger.error(err.message);
            res.send({status: 0, message: "Data Base error: " + err.message + ". Please try again."});
        });
    logger.trace('loginUser End');
};


/**
 * Sample API request params
 * {
 *  "email_id": "xxx@xxx.com",
 *  "password": "qwerty",
 *  "number": 789889899 ,
 *   ...... 
 * }
 **/

User.prototype.registerUser = function (req, res) {
    logger.trace('registerUser Start' + JSON.stringify(req.body));
    var obj = {}, that = this, userDeviceObj = {};
    obj.email_id = req.body.email_id.toLowerCase();
    obj.password = that.encryptPassword(req.body.password);
    obj.phone_no = req.body.number;
    obj.act_enabled = true;
    obj.customer_pin = that.generateCustomerPin(obj.email_id);

    that.userModel.findAll({where: {email_id: obj.email_id}})
        .then(function (arr) {
            if (arr.length === 0) {
                var user = that.userModel.build(obj);
                user.save()
                    .then(function (person) {
                        if (person) {
                            res.send({status: 1, message: "Registration Successful.", user: person, sessionId: null});
                        } else {
                            res.send({status: 0, message: "Registration Failed. Please try again."});
                        }
                    });
            } else {
                res.send({status: 0, message: "User already registered."});
            }
        });
    logger.trace('registerUser End');
};

/**
 * Sample API request params
 * {
 *  "user_id": "564564654",
 *  "sessionId": "131231321"
 *   ...... 
 * }
 **/
User.prototype.logout = function (req, res) {
    logger.trace('logout Start' + JSON.stringify(req.body));
    var that = this
        , user_id = req.body.user_id
        , sessionId = req.body.sessionId;

    that.getModels();
    that.userModel.findAll({where: {user_id: user_id}})
        .then(function (arr) {
            arr = arr[0];
            if(!arr){
                res.send({status: 1, message: "logout Success."});
                logger.info("logout done");
                logger.trace('logout End');
                that.saveLogInOut("logout", user_id, app_device_token_id, null);
                return;
            }
        })
        .catch(function(err){
            logger.error(err.message);
            res.send({status: 0, message: "Data Base error: " + err.message + ". Please try again."});
        });
    logger.trace('logout End');
};

module.exports = new User();