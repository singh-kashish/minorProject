// Import Dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('volleyball');
var cors = require('cors');
var auth_middleware = require('./routes/api/auth/middleware');
require('dotenv').config();

// Import Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/api/auth');
var sessionRouter = require('./routes/api/session');
var propertyRouter = require('./routes/api/property');
var screeningRouter = require('./routes/api/background-screening');
var landregistryRouter = require('./routes/api/land-registry');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth_middleware.verify_token);

// Configure Routing
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/screening', screeningRouter);
app.use('/api/users', auth_middleware.verify_login_status, usersRouter);
app.use('/api/sessions', auth_middleware.verify_requester, sessionRouter);
app.use('/api/properties', auth_middleware.verify_login_status, propertyRouter);
app.use('/api/land-registry', auth_middleware.verify_requester, landregistryRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// Error handling
app.use(function(err, req, res, next) {

	// set locals, only providing error in development
	console.log(err);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
