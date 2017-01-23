var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var users = require('./routes/users');
var log4js = require('log4js');

var app = express();

log4js.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'file', //文件输出
            filename: path.join(__dirname, 'logs/access.log'),
            maxLogSize: 4096,
            backups: 3,
            category: 'normal'
        }

    ]
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
logger.info("this is first log info");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: "mongodb://" + settings.host + "/" + settings.db
        // db: settings.db,
        // host: settings.host,
        // port: settings.port
    })
}));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(log4js.connectLogger(logger, {
    level: log4js.levels.INFO, format: ':method :url'
}))
;

// app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
