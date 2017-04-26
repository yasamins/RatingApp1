const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  name: {type: String},
  address: {type: String},
  city: {type: String},
  country: {type: String},
  sector: {type: String},
  website: {type: String},
  image: {type: String},
  employees: [{
    employeeId: {type: String, default: ''},
    employeeFullname: {type: String, default: ''},
    employeeRole: {type: String, default: ''}
  }],
  //info of the user of another company rating a compoany
  companyRating: [{
    companyName: {type: String, default: ''},
    userFullname: {type: String, default: ''},
    userRole: {type: String, default: ''},
    companyImage: {type: String, default: ''},
    userRating: {type: Number, default: 0},
    userReview: {type: String, default: ''}
  }],
  //whenever a new employee add a rating it will be saved into this array
  ratingNumber: [Number],
  ratingSum: {type: Number, default: 0}


});

module.exports = mongoose.model('Company', companySchema);
