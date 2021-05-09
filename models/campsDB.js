var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');
    user                  = require('./users');
require('dotenv').config();
// connecting to mongoDB
mongoose.connect(process.env.MONGODBONLINEURL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
// Data schema
var campSchema = mongoose.Schema({
    name: String,
    price: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments'
        }
    ]
});
campSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('camps', campSchema);