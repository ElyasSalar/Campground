// importing packages
var express 			  = require("express"),
	app 				  = express(),
	mongoose 			  = require('mongoose'),
	bodyParser 			  = require('body-parser'),
	camps 				  = require('./models/campsDB'),
	comments 			  = require("./models/comments"),
	users				  = require("./models/users"),
	campgroundsRoute	  = require('./routes/campgroundRoute'),
	commentsRoute		  = require('./routes/commentsRoute'),
	indexRoute			  = require('./routes/indexRoute'),
	session				  = require('express-session'),
	passport			  = require('passport'),
	LocalStrategy		  = require('passport-local'),
	flash				  = require('connect-flash')
// configuring
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + 'public'));
app.set("view engine", "ejs");
app.use(flash());
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});
app.use(commentsRoute);
app.use(campgroundsRoute);
app.use(indexRoute);
// server is ready
app.listen(process.env.PORT || 3000, function () {
  	console.log("server started running...");
});