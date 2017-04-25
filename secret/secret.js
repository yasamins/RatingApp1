// we will have secret keys inside this file
module.exports = {
  auth: {
    user: 'yasamin.sa77@gmail.com',
    pass: '0458907707'
  },
  facebook: {
    clientID: '755104534664184',
    clientSecret: 'b3ca5c86948e6737fa7402efa3995442',
    profileFields: ['email', 'displayName'],
    //the /auth/facebook is in both login and signup ejs file as the path
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
  }
}
