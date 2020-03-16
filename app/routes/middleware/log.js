let colors = require('colors');
let methodcolors = {
    GET:colors.green
}
module.exports = (request, response, next) => {
    method = request.method;
    color = methodcolors.GET;
    switch (request.method){
        case "GET":
            console.log(`${request.method} ${request.url}`.green);
            break
        case "POST":
            console.log(`${request.method} ${request.url}`.blue);
            break
        case "DELETE":
            console.log(`${request.method} ${request.url}`.red);
            break
        case "PUT":
            console.log(`${request.method} ${request.url}`.yellow);
            break
        default:
            console.log(`${request.method} ${request.url}`);
            break
    }
    next();
};