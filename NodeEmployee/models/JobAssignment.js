var mongoose = require('mongoose');


var JobAssignmentSchema = new mongoose.Schema({
  job_Assignid: String,
  company_id: String,
  company: String,
  vessel_id: String,
  vessel: String,
  job_catid: String,
  jobcategory: String,
  job_typeid: String,
  jobtype: String,
  employee_id: String,		
  employeename: String,
  travelfromdate: Date,
  traveltodate: Date,
  vesselschedule: String,
  destf_id: String,
  destfrom: String,
  destt_id: String,
  destto: String,
  airdestfrom: String,
  airdestto: String,
  status: String,
<<<<<<< HEAD
  dtdmb: Date,
  dtcomp: Date,
  dtdue: Date,
  dtdeliver: Date,
  remarks: String,
=======
>>>>>>> 2a3c5f8f8ce0486e21a8ea0ae5848540bc0abdf3
  inserted_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('JobAssignment', JobAssignmentSchema,'jobassignments');
