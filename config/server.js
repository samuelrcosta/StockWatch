let express = require('express');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

let app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.set('json spaces', 2);

app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());

// Insert routes in application
require('./../app/routes/web')(app);
require('./../app/routes/api')(app);

module.exports = app;