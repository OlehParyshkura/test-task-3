let mongoose = require('mongoose');
let mongoConfig = require('../../../config/mongo');
mongoose.connect(`mongodb+srv://oleh_paryshkura:oleg911119@cluster0-ettw7.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true });
