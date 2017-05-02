const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const async = require('async');

const Company = require('../models/company');
const User = require('../models/user');



module.exports = (app) => {

  app.get('/company/create', (req,res) => {
    var success = req.flash('success');
    res.render('./company/company', {title: 'Company Registration', success:success, noErrors: success.length > 0});
  });

  app.post('/company/create', (req, res) => {
      //new instance of the Company model
    var newcompany = new Company();
    newcompany.name = req.body.name;
    newcompany.address = req.body.address;
    newcompany.city = req.body.city;
    newcompany.country = req.body.country;
    newcompany.sector = req.body.sector;
    newcompany.website = req.body.website;
    // newcompany.image = req.body.upload;


    newcompany.save((err) => {
      if(err){
        console.log(err);
      }
      console.log(newcompany);
      req.flash('success', 'Company data has been added.');
      res.redirect('/home');
    })
  });

  app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
//the path where we want to save the file
    form.uploadDir = path.join(__dirname, '../public/uploads');
//rename the file because once the file is uploaded the name is changed we have to change it back to original name
    form.on('file', (field, file) =>{
      fs.rename(file.path, path.join(form.uploadDir, file.name));
    });
    form.on('error', (err) => {
      console.log('An error occured', err);
    });
    form.on('end', () =>{
      console.log('File has been uploaded');
    });
    //parse incoming request containing form data
    form.parse(req);
  });

  app.get('/companies', (req, res) => {
    //get all data from company collection
    Company.find({},(err, result) => {
      console.log(result);
    res.render('./company/companies', {title: 'All Companies', data: result});
  });
});
// we are gonna use this id to fetch companies data from db
app.get('/company-profile/:id', (req, res) => {
  Company.findOne({'_id': req.params.id}, (err, data) => {
  res.render('company/company-profile', {title: 'Company Profile',user: req.user, id: req.params.id,
data: data});
});
app.get('/company/register-employee/:id', (req, res) => {
  Company.findOne({'_id': req.params.id}, (err, data) => {
  res.render('company/register-employee', {title: 'Register Employee',user:req.user, data: data});

});
});

app.post('/company/register-employee/:id', (req, res, next) => {
  async.parallel([
    function(callback){
      //we ant to update inside Company collection
      Company.update({
        //it will go through Company collection and look for any documents that has this id
        '_id': req.params.id,
        //inside employees array in models/company.js file, it will check that employeeId is Not already saved in the session
        'employees.employeeId': {$ne: req.user._id}
      },
      {

//push the data to database
//employeeId is equal to id of the user saved in the session
$push: {employees: {employeeId: req.user._id, employeeFullname: req.user.fullname, employeeRole: req.user.role}}
    }, (err, count) => {
      if (err) {
          return next(err);
      }
      callback(err, count);
    });
},
  function(callback){
    async.waterfall([
      function(callback){
        //find the company based on the id
        Company.findOne({'_id': req.params.id}, (err, data) => {
          callback(err, data);
        })
      },
      //we pass the result into this second function
      function(data,callback){
        //id in db is equal to id in user session,find the user registered as an employee
        User.findOne({'_id': req.user._id}, (err, result) => {
          //we gonna update user role, company name and image(schema)
          result.role = req.body.role;
          result.company.name = data.name;
          result.company.image = data.image;

          result.save((err) => {
            res.redirect('/home');
          });
        })
      }
    ]);
}
  ]);
});
});
app.get('/:name/employees', (req, res) => {
  res.render('company/employees', {title: 'Company Employees', user: req.user});
})
}
