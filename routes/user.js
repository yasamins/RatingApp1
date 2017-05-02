const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const async = require('async');
//for creating a random token
const crypto = require('crypto');
const User = require('../models/user');
const secret = require('../secret/secret');

const passport = require('passport');
module.exports = (app) => {
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/signup', function(req, res, next) {
    //error message
    var errors = req.flash('error');
    console.log(errors);
    res.render('user/signup', {title: 'Sign Up', messages: errors, hasErrors: errors.length > 0});
  });
// we enable the validation here before passport authentication
  app.post('/signup', validate, passport.authenticate('local-signup', {
    //if sign up seccessfull it will direct you to the home page
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res, next) {
    var errors = req.flash('error');
    res.render('user/login', {title: 'Login', messages: errors, hasErrors:
  errors.length > 0});
  });
  app.post('/login', loginValidation, passport.authenticate('local-login', {
    //if sign up seccessfull it will direct you to the home page
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/login',
    //display flsh messages
    failureFlash: true
  }));

app.get('/home', (req, res) => {
  res.render('home', {title: 'Home'});
});

app.get('/forgot', (req, res) => {
  var errors = req.flash('error');
  var info = req.flash('info');
  res.render('user/forgot', {title: 'Request Password Reset', messages: errors, hasErrors:
errors.length > 0, info: info, noErrors: info.length > 0});
});
app.post('/forgot', (req,res, next) => {
  async.waterfall([
    function(callback){
      //generate a random value of 20 vharacters long
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        callback(err, token);
      });
    },
    function(token, callback) {
      //check if the email is valid in db, if the user email found in db we store the object inside the user variable
      User.findOne({'email': req.body.email}, (err, user) => {
        if(!user) {
          req.flash('error', 'Email is invalid');
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        //after this time token will become invalid, here is 1 hour
        user.passwordResetExpires = Date.now() + 60*60*1000;

        //save these into the db
        user.save((err) => {
          callback(err, token, user)
        });
      })
    },
    //sending the email to the user
    function(token, user, callback){
      var smtpTransport = nodemailer.createTransport({
        //gmail service
        service: 'Gmail',
        //we want this to be private so we make them inside secret.js file
        auth: {
          user: secret.auth.user,
          pass: secret.auth.pass
        }
      });
      var mailOptions = {
        //where the email is going to and where the email is coming from
        to: user.email,
        from: 'RateMe' + '<' + secret.auth.user + '>',
        subject: 'RateMe Application password reset Token',
        //content of the email
        text: 'You have requested for password reset token. \n\n' +
        'Please click on the link to complete the process: \n\n' +
        'http://localhost/reset/' + token + '\n\n'
      };
      //when the email has been sent successfully this message will be displayed to the user
      smtpTransport.sendMail(mailOptions, (err, response) => {
        req.flash('info', 'A password reset token has been sent to' + user.email);
        return callback(err, user);
      });
    }

  ], (err) => {
    if(err){
      return next(err);
    }
    res.redirect('/forgot');
  })

});


app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.redirect('/');
  });
})
}

function validate(req, res, next) {
  req.checkBody('fullname', 'Fullname is required').notEmpty();
  req.checkBody('fullname', 'Fullname must not be less than 5').isLength({min:5});
  req.checkBody('email', 'Email is required').notEmpty();
  //check if email is valid
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5').isLength({min:5});
  // req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");


  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach((error) => {
      //push error message to the messages array
      messages.push(error.msg);
    });
    req.flash('error', messages);
    res.redirect('/signup');
  } else {
    return next();
  }
}
function loginValidation(req, res, next) {
  req.checkBody('email', 'Email is required').notEmpty();
  //check if email is valid
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5').isLength({min:5});
  // req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");


  var loginErrors = req.validationErrors();
  if(loginErrors){
    var messages = [];
    loginErrors.forEach((error) => {
      messages.push(error.msg);
    });
    req.flash('error', messages);
    res.redirect('/login');
  } else {
    return next();
  }
}
