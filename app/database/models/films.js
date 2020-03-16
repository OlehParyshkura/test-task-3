let mongoose = require('mongoose');

let filmsSchema = {
    title: {type:String ,required: true},
    year: {type:Number ,required: true},
    format: {type:String ,required: true},
    actorsList: [String],
};

module.exports = mongoose.model('Film', filmsSchema);