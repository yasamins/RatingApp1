const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const Company = require('../models/company');


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
    newcompany.image = req.body.upload;


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
}
