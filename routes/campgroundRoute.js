const { render } 	= require('ejs');
var express 		= require('express'),
    router  		= express.Router({mergeParams: true}),
	passport		= require('passport'),
	users       	= require('../models/users'),
    camps       	= require('../models/campsDB'),
    comments    	= require('../models/comments'),
	middleware		= require('../middleware')
router.get("/campgrounds", function (req, res) {
	camps.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", { camps: allCampgrounds });
		}
	});
});
router.post('/campgrounds', middleware.isLoggedIn, function (req, res) {
	camps.create({ 
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		description: req.body.description,
		author: req.user
	});
	req.flash('success', 'Campground ' + req.body.name + ' created');
	res.redirect('/campgrounds');
});
router.get('/campgrounds/new', middleware.isLoggedIn, function (req, res) {
  	res.render('form');
});
router.get('/campgrounds/:id/update', middleware.isLoggedIn, function(req, res){
	camps.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render('update', {camps: foundCamp});
		}
	});
});
router.post('/campgrounds/:id/update', middleware.isLoggedIn, function(req, res){
	camps.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			foundCamp.name = req.body.name;
			foundCamp.price = req.body.price;
			foundCamp.image = req.body.image;
			foundCamp.description = req.body.description;
			foundCamp.save();
			req.flash('success', 'Campground has been updated');
			res.redirect('/campgrounds');
		}
	});
});
router.get('/campgrounds/:id', middleware.isLoggedIn, function (req, res) {
	camps.findById(req.params.id).populate(['comments', 'author', {
		path: 'comments',
		populate: {
			path: 'author',
			model: 'users'
		}
	}]).exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render('show', {camps: foundCamp});
		}
	});
});
router.get('/campgrounds/:id/delete', middleware.isLoggedIn, function(req, res){
	camps.findById(req.params.id, function(err, foundCamp){
		if(foundCamp.comments){
			foundCamp.comments.forEach(function(commentId){
				comments.findByIdAndDelete(commentId, function(err, res){});
			});
		}
		camps.findByIdAndDelete(req.params.id, function(err, res){});
		req.flash('success', 'Campground ' + foundCamp.name + ' Deleted successfuly')
		res.redirect('/campgrounds');
	});
});
module.exports = router;