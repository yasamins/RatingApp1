const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secret');
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
//creating the facebook middleware
//secret.facebook is the facebook part in secret file
//call back has req, token, refreshToken, profile and done
passport.use(new FacebookStrategy(secret.facebook, (req, token, refreshToken,
profile,done) => {
  // now we want to check if the profile id of the user is already inside database, if yes login if not create a new user
  User.findOne({facebook: profile.id}, (err, user) =>{
    if(err){
      return done(err)
    }
    if(user){
      return done(null, user);
    } else {
      var newUser = new User();
      //id is the one we have in user.js file
      newUser.facebook = profile.id;
      newUser.fullname = profile.displayName;
      newUser.email = profile._json.email;
      //token is an array as we said in
      newUser.tokens.push({token: token});

      newUser.save((err) => {
        return done(null, newUser);
      })
    }
  })
}
))
