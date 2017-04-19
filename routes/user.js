
module.exports = (app) => {
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/signup', function(req, res, next) {
    res.render('user/signup');
  });
  app.get('/login', function(req, res, next) {
    res.render('user/login');
  });
}
