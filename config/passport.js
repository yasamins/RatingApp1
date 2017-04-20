const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//in order to access the schema
const User = require('../models/user');
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//to retrieve the user data using a method by mongo called findById
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });

});
//middleware
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField:  'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  //we wanna check if user data already exist (findOne is mongoose method)
  User.findOne({'email':email}, (err, user) => {
    if(err){
      return done(err);
    }
//if the user data was found
    if(user) {
      return done(null, false)
    }
    //otherwise make a new user and save it to the db
    var newUser = new User();
    newUser.fullname = req.body.fullname;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);


    newUser.save((err) => {
      return done(null, newUser);
    });
  });
}));
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField:  'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  //we wanna check if user data already exist (findOne is mongoose method)
  User.findOne({'email':email}, (err, user) => {
    if(err){
      return done(err);
    }
    var messages = [];
//if the user data was found or if the password is not valid
    if(!user || !user.validPassword(password)) {
      messages.push('Email Does not exist or password is invalid')
      return done(null, false, req.flash('error', messages));
    }
    return done(null, user);
  });
}));
