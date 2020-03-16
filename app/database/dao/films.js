let Film = require('../models/films');
module.exports = {
    ...Film
};

module.exports.getFilms = (query) => {
    const getFindProps = ({ sortBy, order, ...rest }) => {
        if (typeof rest.title !== "undefined") {
            rest.title = { $regex: rest.title, $options: 'i' }
        }
        if(typeof rest.actorsList!== "undefined") {
            rest.actorsList = { $regex: rest.actorsList, $options: 'i' }
        }
        return rest
    };
    const { sortBy, order } = query;
    return Film.find(getFindProps(query))
        .sort({
            [sortBy]: order
        })
        .exec();
}

module.exports.getFilmById = (id) =>
    Film.findById(id)
        .exec();

module.exports.editFilm = (id, newFilm) =>
    Film.findOneAndUpdate({
        _id: id
    }, newFilm)
        .exec();

module.exports.addFilm = (film) =>
    new Film(film).save();


module.exports.deleteFilm = (id) =>
    Film.deleteOne({
        _id: id
    }).exec();

module.exports.findFilmByTitle = (title) =>
    Film.findOne({ title: title }).exec();