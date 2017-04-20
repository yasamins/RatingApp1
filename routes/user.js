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
    res.render('user/login', {title: 'Login', messages: errors, hasErrors: errors.length > 0});
  });
  app.post('/login', passport.authenticate('local-login', {
    //if sign up seccessfull it will direct you to the home page
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  }));
}
app.get('/home', (req, res) => {
  res.render('home', {title: 'Home'});
})

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
      messages.push(error.msg);
    });
    req.flash('error', messages);
    res.redirect('/signup');
  } else {
    return next();
  }
}
