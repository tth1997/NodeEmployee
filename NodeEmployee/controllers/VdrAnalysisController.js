var mongoose = require("mongoose");
var VdrAnalysis = require("../models/VdrAnalysis");
var Job = require("../models/Job");
var Vessel = require("../models/Vessel");

var Company=require("../models/Client");
var Country=require("../models/Country");
var Analysis = require("../models/Analysis");
var Employee = require("../models/Employee");
var Doc=require("../models/Doc");
var cache = require('memory-cache');


var obj = {};



var vdranalysisController = {};




// Show list of VdrAnalysis
vdranalysisController.list = function(req, res) {
  VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
    if (err) {
      console.log("Error:", err);
    }
    else {
	  res.render("../views/vdranalysiss/index", {vdranalysiss: vdranalysiss});
    }
  });
};

// Show VdrAnalysis by id
vdranalysisController.show = function(req, res) {
  VdrAnalysis.findOne({_id: req.params.id}).exec(function (err, vdranalysis) {
    if (err) {
      console.log("Error:", err);
    }
	
	Doc.find({columnmap: vdranalysis.vdr_id,status: 'Active'}).exec(function (err, listofdoc) {
    if (err) {
      console.log("Error:", err);
    }
    else {
	  console.log(vdranalysis);
      res.render("../views/vdranalysiss/show", {vdranalysis: vdranalysis,listofdoc: listofdoc});
    }
	});
  });
};

// Create new jobAssignments
vdranalysisController.create = function(req, res) {

    Analysis.find({}).exec(function(err,analysis){
		    if(err){
				console.log("Error:",err);
			}
    Employee.find({status:'Active'}).exec(function(err,employee){
		    if(err){
				console.log("Error:",err);
			}

						
    Vessel.find({}).exec(function(err,vessel){
	        if(err){
				console.log("Error:",err);
			}
				
    Company.find({status:'Active'}).exec(function(err,company){
	        if(err){
				console.log("Error:",err);
			}
				
    
							
			
			obj['vessel'] = vessel;
            obj['company'] = company;
			
			obj['analysis'] = analysis;
            obj['employee'] = employee;
			cache.put('myjsonobj', obj);
        
    		res.render("../views/vdranalysiss/create",{employee: employee,vessel:vessel,company:company,
			                                           analysis:analysis});
			
	
	
	
	});
	});	
	});
	});
	//to store data or json object into cache
    
	
};



   

// Edit an jobAssignments
vdranalysisController.edit = function(req, res) {
	
     Analysis.find({}).exec(function(err,analysis){
		    if(err){
				console.log("Error:",err);
			}
     Employee.find({status:'Active'}).exec(function(err,employee){
		    if(err){
				console.log("Error:",err);
			}

		
				
    Vessel.find({}).exec(function(err,vessel){
	        if(err){
				console.log("Error:",err);
			}
				
    Company.find({status:'Active'}).exec(function(err,company){
	        if(err){
				console.log("Error:",err);
			}
				
   
							
			obj['employee'] = employee;
            obj['vessel'] = vessel;
            obj['company'] = company;
			obj['analysis']= analysis;
            
			cache.put('myjsonobj', obj);
	
    VdrAnalysis.findOne({_id: req.params.id}).exec(function (err, vdranalysis) {
    if (err) {
      console.log("Error:", err);
    }
     Doc.find({columnmap: vdranalysis.vdr_id,status: 'Active'}).exec(function (err, listofdoc) {
    if (err) {
      console.log("Error:", err);
    } 
      res.render("../views/vdranalysiss/edit", {vdranalysis:vdranalysis,employee:employee,vessel:vessel,company:company,
			                                           analysis:analysis,listofdoc:listofdoc});
    
	
	});
	});
	});
	});	
	});
	});
	
  
};


// Delete a job
vdranalysisController.complete = function(req, res) {
	 VdrAnalysis.findById(req.params.id, function(err, data) {	
	 
	  console.log(data);
	 
	 var newvalues;
	 var valStatus = data.status;
	 var newStatus;
	 console.log(data.status);
	 if(valStatus == "Inactive"){
		 console.log("valStatus1",valStatus);
	      newStatus = 'Active';
	      newvalues = {$set: {status: "Active"} };
	 }
	 if(valStatus == "Active"){
		  console.log("avc",valStatus);
		  newStatus = 'Inactive';
	      newvalues = {$set: {status: "Inactive"} };
	 }
	 data.status=newStatus;	  
	 console.log(data);
	 
	var myquery = { columnmap: data.vdr_id };
	
    
    mongoose.connection.db.collection("uploaddocuments").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " document(s) updated");
    
  });
	 data.save(function(err, data) {
        if (err) {
          console.log("Error:", err);
        }
	 
        else {
          console.log("Vessel job tracker inactivated!");
          VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
		           res.render("../views/vdranalysiss/index", {vdranalysiss: vdranalysiss});
	              }
                });
    }
  });
  });
};
	
  
module.exports = vdranalysisController;
