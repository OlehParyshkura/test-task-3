let Film = require('../models/films');
module.exports = {
    ...Film
};

const getFindProps = ({ sortBy, order, limit, page, ...rest }) => {
    if (typeof rest.title !== "undefined") {
        rest.title = { $regex: rest.title, $options: 'i' }
    }
    if (typeof rest.actorsList !== "undefined") {
        rest.actorsList = { $regex: rest.actorsList, $options: 'i' }
    }
    return rest
};
module.exports.getFilms = (query) => {
    let { sortBy, order, page, limit } = query;
    if (sortBy == 'title') {
        sortBy = 'lowerTitle'
    }
    page = parseInt(page);
    limit = parseInt(limit)
    page--;
    return Film.find(getFindProps(query))
        .sort({
            [sortBy]: order
        })
        .limit(limit)
        .skip(limit * page)
        .exec();
}

module.exports.getCount = (query) =>
    Film.countDocuments(getFindProps(query)).exec();


module.exports.getFilmById = (id) =>
    Film.findById(id)
        .exec();

function checkUnique(film) {
    return Film.find(film).then((films) => { return films.length === 0 })
}

module.exports.editFilm = async (id, newFilm) => {
    newFilm.lowerTitle = newFilm.title.toLowerCase();
    if (await checkUnique(newFilm)) {
        return Film.findOneAndUpdate({
            _id: id
        }, newFilm)
            .exec();
    }
    else throw new Error("film already exist");

}

module.exports.addFilm = async (film) => {
    film.actorsList = [...new Set(film.actorsList)];
    film.lowerTitle = film.title.toLowerCase();
    if (await checkUnique(film)) {
        return new Film(film).save();
    }
    else throw new Error("film already exist");

}

module.exports.deleteFilm = (id) =>
    Film.deleteOne({
        _id: id
    }).exec();

module.exports.findFilmByTitle = (title) =>
    Film.findOne({ title: title }).exec();