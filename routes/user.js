
module.exports = (app) => {
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/signup', function(req, res, next) {
    res.render('user/signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    //if sign up seccessfull it will direct you to the home page
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/login', function(req, res, next) {
    res.render('user/login');
  });
}
