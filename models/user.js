const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  fullname: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String},
  //role of the person in the company
  role: {type: String, default: ''},
  company: {
    name: {type: String, default: ''},
    image: {type: String default: ''}
  },
  //for password reset functionality
  passwordResetToken: {type: String, default: ''},
  passwordResetExpires: {type: Date, default: Date.now}
});


module.exports = mongoose.model('User', userSchema);
