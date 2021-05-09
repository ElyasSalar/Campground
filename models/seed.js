var mongoose = require('mongoose'),
    camps    = require('./campsDB'),
    comments = require('./comments');
comments.find({}, function(err, foundComment){
    camps.find({}, function(err, foundcamp){
        var i = 0;
        foundcamp.forEach(function(camp){
            camps.create(camp, function(err, camp){
                camp.comments.push(foundComment[i]);
                camp.save();
                i++;
            });
        });
    });
});