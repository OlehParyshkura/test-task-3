// dependencies
const express = require('express');
const fileUpload = require('express-fileupload');
const log = require('./app/routes/middleware/log')


// app initialization
const serverConfig = require('./config/server');
const app = express();

// connect database
require('./app/database/connection/mongoose');

app.use(fileUpload());
app.use(express.json());
// // routers
app.use(log);
let filmsRoutes = require('./app/routes/api/films');
app.use('/api', filmsRoutes);
app.use(express.static('app/react-front/build'));
app.listen(serverConfig.port);
console.log(`listening on port ${serverConfig.port}`)