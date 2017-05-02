const async = require('async');
const Company = require('../models/company');

module.exports = (app) => {

  app.get('/review/:id', (req,res) => {
    var messg = req.flash('success');
    Company.findOne({'_id':req.params.id}, (err, data) => {
    res.render('./company/review', {title: 'Company Review', user: req.user, data: data, msg: messg, hasMsg: messg.length>0});
  });
  });
  app.post('/review/:id', (req, res) => {
    async.waterfall([
      function(callback){
        //we are checking the id in the url is the same as the id in db, we save the result inside result obj ad pass it to next function
        Company.findOne({'_id': req.params.id}, (err, result) => {
          callback(err, result);
        });
      },
      function(result, callback){
        Company.update({
          //we want to update the dcument with this particular id
          '_id': req.params.id
        },
        {
          //we want to push value into the companyRating array inside company.js file model
          $push: {companyRating: {
            companyName: req.body.sender,
            userFullname: req.user.fullname,
            userRole: req.user.role,
            companyImage: req.user.company.image,
            userRating: req.body.clickedValue,
            userReview: req.body.review
          },
          ratingNumber: req.body.clickedValue
        },
        //increment operators
        $inc: {ratingSum: req.body.clickedValue}
      }, (err) => {
        req.flash('success', 'Your review has been added.');
        // res.render('./review/' + req.params.id)
        res.redirect('/home');

        })
      }
    ])
  });
}
