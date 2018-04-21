var mongoose = require('mongoose');


var VdrAnalysisSchema = new mongoose.Schema({
  vdr_id: String,
  auditor_id: String,
  auditorname: String,
  vessel_id: String,
  vessel: String,
  company_id: String,
  company: String,
  vdrtype: String,
  vdrmake: String,
  analysis_id: String,
  analysis: String,
  drcvclient: Date,
  alldocrcvd: Date,
  dtdatasent: Date,
  dtanacomp: Date,
  dtassign: Date,
  dtdeliver: Date,
  dtcomp: Date,
  duedate: Date,
<<<<<<< HEAD
  remarks: String,
=======
  inserted_at: { type: Date, default: Date.now },
>>>>>>> 2a3c5f8f8ce0486e21a8ea0ae5848540bc0abdf3
  status: String  
});


module.exports = mongoose.model('VdrAnalysis', VdrAnalysisSchema,'vdranalysis');
