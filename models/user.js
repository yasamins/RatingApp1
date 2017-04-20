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
    image: {type: String, default: ''}
  },
  //for password reset functionality
  passwordResetToken: {type: String, default: ''},
  passwordResetExpires: {type: Date, default: Date.now}
});
//password will be added and encrypted before the data will be saved in db
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
//compare the user's password with encrypted password(this.password is the excrypted pass)
userSchema.methods.validPassword = function(password) => {
  //comparing new password with encrypted password
  return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);
