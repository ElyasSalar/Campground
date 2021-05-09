var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    passport    = require('passport'),
    users       = require('../models/users'),
    camps       = require('../models/campsDB'),
    comments    = require('../models/comments'),
    middleware  = require('../middleware')
router.get("/", function (req, res) {
    res.render("landing");
});
router.get('/login', function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/campgrounds');
    }
    res.render('login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(){});
// router.post('/login', function(req, res){
//     if(req.isAuthenticated()){
//         res.redirect('/campgrounds');
//     }else{
//         var userLogin = user({
//             username: req.body.username,
//             password: req.body.password
//         });
//         req.login(userLogin, function(err){
//             if(err){
//                 req.flash('error', err);
//                 res.redirect('/login');
//             }else{
//                 passport.authenticate('local')(req, res, function(){
//                     req.flash('success', 'You are Logged in');
//                     res.redirect('/campgrounds');
//                 });
//             }
//         });
//     }
// });
router.get('/logout', middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash('success', 'Signed you out');
    res.redirect('/login');
});
router.get('/register', function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/campgrounds');
    }
    res.render('register');
});
router.post('/register', function(req, res){
    users.register(new users({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req, res, function(){
                req.flash('success', 'Welcome');
                res.redirect('/campgrounds');
            });
        }
    });
});
module.exports = router;