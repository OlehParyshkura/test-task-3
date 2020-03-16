let express = require('express');
let router = express.Router();

let Films = require('../../database/dao/films');
let {statuses, httpStatuses} = require('../../../config/constants');

router.get('/films', (request, response) => {
    Films.getFilms(request.query)
    .then(films=>response.json(films))
    .catch(err => {response.status(httpStatuses.SERVER_ERROR).json({status: statuses.failure, film: {}, error_text: err.message})});
});

router.get('/films/:id', (request, response) => {
    Films.getFilmById(request.params.id)
        .then(film => {response.json({status: statuses.success, film})})
        .catch(err => {response.status(httpStatuses.SERVER_ERROR).json({status: statuses.failure, film: {}, error_text: err.message})});
});

router.post("/films", (request, response) => {
        if(request.files){
            let file = request.files.movies
            let string = file.data.toString('ascii',0,file.size);
            let pattern = /Title: ([^\n]+)\nRelease Year: ([^\n]+)\nFormat: ([^\n]+)\nStars:([^\n]+)\n/gm
            let rez = [];
            let intermediateRez;
            while((intermediateRez = pattern.exec(string))!==null){
                rez.push(intermediateRez)
            }
            rez = rez.map((item)=>{
                let film ={
                    title:item[1],
                    year:item[2],
                    format:item[3],
                    actorsList:item[4].split(", ").map(a=>a.trim())
                }
                return Films.addFilm(film);
            })
            Promise.all(rez)
            .then(rez =>response.json({status: statuses.success, rez:rez}))
            .catch(err => {
                response.status(httpStatuses.SERVER_ERROR).json({
                    status: statuses.failure,
                    film: {},
                    error_text: err.message
                })
            });
        }else{
            Films.addFilm(request.body)
            .then(film => {
                response.json({status: statuses.success, film})
            })
            .catch(err => {
                response.status(httpStatuses.SERVER_ERROR).json({
                    status: statuses.failure,
                    film: {},
                    error_text: err.message
                })
            });
        }

        
});

router.put("/films/:id",(request, response) => {
        Films.editFilm(request.params.id, request.body)
            .then(film =>{response.json({status: statuses.success, film})})
            .catch(err => {response.status(httpStatuses.SERVER_ERROR).json({status: statuses.failure, film: {}, error_text: err.message})});
});

router.delete("/films/:id",(request, response) => {
    Films.deleteFilm(request.params.id)
        .then(result =>{response.json({status: statuses.success, result})})
        .catch(err => { console.log(err);
            response.status(httpStatuses.SERVER_ERROR).json({status: statuses.failure, film: {}, error_text: err.message})});
});

module.exports = router;