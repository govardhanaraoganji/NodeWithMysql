var express    = require('express'),
    app        = express(),
    db = require('./mySqlDB'),
    mongodb = require('./db'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080,
    Globals = require('./globals'),
    log4js = require('log4js');

log4js.configure(Globals.LoggerConfig);
var logger = log4js.getLogger('relative-logger');

app.set('views', __dirname + '/Views');
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logResponseBody);
app.use(require('./Controllers'));

function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end,
        chunks = [],
        t1 = new Date();

    res.write = function (chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);

       var body = Buffer.concat(chunks).toString('utf8');
        var t2 = new Date();
       logger.trace((t2 - t1) + " : Path: " + req.path + " :Req.body:::: " + JSON.stringify(req.body) + " : ResponseBody:::: "+ body);

        oldEnd.apply(res, arguments);
    };

    next();
};


process.on('SIGINT', function() {
    mongodb.close(function(){
        logger.info('closing db');
        process.exit(0);
    });
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    logger.info(err.stack);
});

mongodb.connect(Globals.MongoHost, Globals.MongoPort, Globals.MongoDB, function(err){
    if(err){
        logger.info("Problem in connecting MongoDB.");
    }else{
        logger.info("Connected to MongoDB.");        
    }
});


db.connect(Globals.MySqlHost, Globals.MySqlPort, Globals.MySqlDB, Globals.MySqlUser, Globals.MySqlPass, function (err) {
    if (err) {
        logger.error('Unable to connect to MySql.');
        process.exit(1);
    } else {
        logger.info('connected to MySql.');
        app.listen(port, function () {
            logger.info('API\'s work at http://localhost:' + port + " url.");
        });
    }
});