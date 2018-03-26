var mongoose = require('mongoose');


var EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  firstname: String,
  lastname: String,
  address: String,
  officelocation: String,
  country: String,
  city: String,
  dateofbirth: Date,
  dateofjoining: Date,
  passportno: String,
  nationality: String,
  maritalstatus: String,
  permitstatus: String,
  comment: String,
  photo: String,
  fathername: String,
  mothername: String,
  spousename: String,
  noofkids: String,
  status: String,
  updated_at: { type: Date, default: Date.now }
  
});


module.exports = mongoose.model('Employee', EmployeeSchema);
