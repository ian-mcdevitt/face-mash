var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CelebSchema = new Schema({
    url: {type: String, required: true},
    name: {type: String, required: true},
    score: {type: Number, required: true}
});

var Celeb = module.exports = mongoose.model('Celeb', CelebSchema);