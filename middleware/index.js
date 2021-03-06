var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error', 'You need to be signed in before');
        res.redirect('/login');
    }
}
module.exports = middlewareObj;