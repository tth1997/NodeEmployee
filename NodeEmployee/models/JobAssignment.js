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
  status: String
});


module.exports = mongoose.model('JobAssignment', JobAssignmentSchema,'jobassignments');