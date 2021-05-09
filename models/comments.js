var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
var commentSchema = mongoose.Schema({
    comment: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    }
});
commentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('comments', commentSchema);