let mongoose = require('mongoose');

let filmsSchema = {
    title: { type: String, required: true },
    lowerTitle: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        min: 1850,
        max: 2020
    },
    format: { type: String, required: true },
    actorsList: [String],
};

module.exports = mongoose.model('Film', filmsSchema);