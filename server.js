const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rateme');

require('./config/passport');

//enables us to make use of our static files
app.use(express.static('public'));
app.engine('ejs', engine);
//will go directly into the views folder to get the files
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(validator());

app.use(session({
  secret: 'Thisismytestkey',
  resave: false,
  saveUninitialized: false,
  //our session data will be saved in the database
  store: new MongoStore({mongooseConnection: mongoose.connection})

}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//access to the app variable in express method in line 10
require('./routes/user')(app);

app.listen(3000, function() {
  console.log('Listening on port 3000');
})
