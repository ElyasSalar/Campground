var express 	= require('express'),
    router  	= express.Router({mergeParams: true}),
	passport	= require('passport'),
	users       = require('../models/users'),
    camps       = require('../models/campsDB'),
    comments    = require('../models/comments'),
	middleware	= require('../middleware')
router.get('/campgrounds/:id/comment/new', middleware.isLoggedIn, function(req, res){
	camps.findById(req.params.id, function(err, foundCamps){
		if(err){
			console.log(err);
		}else{
			res.render('comment', {camps: foundCamps})
		}
	});
});
router.post('/campgrounds/:id/comment', middleware.isLoggedIn, function(req, res){
	comments.create(
		{
			author: req.user,
			comment: req.body.comment
		}
	, function(err, createdComment){
		if(err){
			req.flash('error', err);
			res.redirect('/campgrounds/' + req.params.id);
		}else{
			camps.findById(req.params.id, function(err, foundCamp){
				if(err){
					console.log(err);
				}else{
					foundCamp.comments.push(createdComment);
					foundCamp.save();
					req.flash('success', 'successfuly created comment');
					res.redirect('/campgrounds/'+ req.params.id);
				}
			});
		}
	});
});
router.get('/campgrounds/:camp_id/:comment_id/comment/edit', middleware.isLoggedIn, function(req, res){
	comments.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		}else{
			camps.findById(req.params.camp_id, function(err, foundCamp){
				if(err){
					console.log(err);
				}else{
					res.render('edit-comment', {comment: foundComment, camp: foundCamp});
				}
			});
		}
	});
});
router.post('/campgrounds/:camp_id/:comment_id/comment/edit', middleware.isLoggedIn, function(req, res){
	comments.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		}else{
			foundComment.comment = req.body.comment;
			foundComment.save();
			req.flash('success', 'successfuly edited comment');
			res.redirect('/campgrounds/' + req.params.camp_id);
		}
	});
});
router.get('/campgrounds/:camp_id/:comment_id/comment/delete', middleware.isLoggedIn, function(req, res){
	comments.findByIdAndDelete(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		}else{
			req.flash('success', 'Comment has been deleted');
			res.redirect('/campgrounds/' + req.params.camp_id);
		}
	});
});
module.exports = router;