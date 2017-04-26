const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
  app.get('/company/create', (req,res) => {
    res.render('./company/company', {title: 'Company Registration'});
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
