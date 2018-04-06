var express = require('express');
var router = express.Router();
var jobassignment = require("../controllers/JobAssignmentController.js");
var path = require('path');
var multer  =   require('multer');
var JobAssignment = require("../models/JobAssignment");
var cache = require('memory-cache');
var mongoose = require('mongoose');
var fs = require('fs-extra')
var filessystem = require('fs');


// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/vesseljobtrackers');
  },
  // file upload extension
  filename: function(req, file, cb) {
	  cb(null, (file.originalname).replace(/ /g,"_"));
  }
});
// file upload variable
var upload = multer({
  storage: storage
});

//common function for save and update

function getEmpByKey(key, data) {
    for (i in data) {
		 if (data[i].employee_id == key) {
            return data[i].firstname + ' ' + data[i].lastname;
        }
    }
}
function getJobCategoryByKey(key, data) {
   
	 for (i in data) {
		 if (data[i]._id == key) {
            return data[i].jobcategory;
        }
    }
}
function getJobTypeByKey(key, data) {
   
	 for (i in data) {
		 if (data[i]._id == key) {
            return data[i].jobtype;
        }
    }
}

function getValueByKey(key, data) {
  for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}
function getClientByKey(key, data) {
  for (i in data) {
		 if (data[i].client_id == key) {
            return data[i].companyname;
        }
    }
}





// Get all employees
router.get('/', function(req, res) {
  jobassignment.list(req, res);
});

// Get single employee by id
router.get('/show/:id', function(req, res) {
  jobassignment.show(req, res);
});

// Create employee
router.get('/create', function(req, res) {
  jobassignment.create(req, res);
    
});

// Save employee
router.post('/save',upload.any(),function(req, res,next) {
	 
	var obj=cache.get('myjsonobj');
	 
	 
	  var job_Assignid;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'jobassignid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         job_Assignid = result.value.sequence_value;
			 var uploads;
			 var today = new Date();
             var dd = today.getDate();
             var mm = today.getMonth()+1; //January is 0!
             var yyyy = today.getFullYear();
             var year = yyyy.toString().substr(-2);

             if(dd<10) {
                 dd = '0'+dd;
             } 

             if(mm<10) {
                 mm = '0'+mm;
             } 

            job_Assignid = year + mm + dd + job_Assignid ;
			console.log(req.body);
			var jobassignment = new JobAssignment({
		    job_Assignid: job_Assignid,
		    company_id: req.body.company,
            company: getClientByKey(req.body.company, obj.company),
            vessel_id: req.body.vessel,
			vessel: getValueByKey(req.body.vessel, obj.vessel),
			job_catid: req.body.jobcategory,
			jobcategory: getJobCategoryByKey(req.body.jobcategory, obj.jobcategory),
			job_typeid: req.body.jobtype,
			jobtype: getJobTypeByKey(req.body.jobtype, obj.jobtype),
			employee_id: req.body.employeename,
            employeename: getEmpByKey(req.body.employeename, obj.employee),
			travelfromdate: req.body.travelfromdate,
            traveltodate: req.body.traveltodate,
			vesselschedule: req.body.contact,
			destfrom: req.body.destfrom,
            destto: req.body.destto,
			airdestfrom: req.body.airdestfrom,
			airdestto: req.body.airdestto,
            status:'Active'
            });
			 if(jobassignment.travelfromdate != null)
			 {
			   jobassignment.travelfromdate = jobassignment.travelfromdate.toLocaleDateString("en-US");
			 }
			  if(jobassignment.traveltodate != null)
			 {
			   jobassignment.traveltodate = jobassignment.traveltodate.toLocaleDateString("en-US");
			 }
			 
			   var dir = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid ;
	    
			   filessystem.mkdirSync(dir);
					
			   var dir1 = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/SEQ' ;
				
			   filessystem.mkdirSync(dir1);
							
			   var dir2 = './public/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/AdditionalDocuments';
				
			   filessystem.mkdirSync(dir2); 
					 
			console.log(jobassignment);
			jobassignment.save(function(err) {
              if(err) {
                console.log(err);
                res.render("../views/jobassignments/create");
                }
              else
			  {
				if(req.files.length > 0){
					
					 for(var i = 0; i < req.files.length ;i++)
					   {
						   if(req.files[i].fieldname == "doc")
						{
							console.log("SEQ part");
							fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
					
							var uploaddoc = {columnmap: jobassignment.job_Assignid, document: req.files[i].filename, 
							                 filepath: '/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/SEQ' + '/' + req.files[i].filename,
											 status:'Active' ,typeofdoc: 'SEQ'};
							mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								
								});
						}
						if(req.files[i].fieldname == "files[]")
							{	   
					              console.log("ADC part");
								  fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename, function (err) {
						             if (err) return console.error(err)
						             console.log("success!")
						          });
					
							
								  var uploaddoc = {columnmap: jobassignment.job_Assignid, document: req.files[i].filename, 
								                   filepath: '/uploads/vesseljobtrackers/'+ jobassignment.job_Assignid + '/AdditionalDocuments' + '/' + req.files[i].filename,
												   status:'Active' ,typeofdoc: 'Additional Documents'};
								  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
								  if(err){
									console.log("err",err);
								  }
							  	  });
							}
					 }
						   
				}
				console.log("Successfully created an jobAssignment.");
                JobAssignment.find({}).exec(function (err, jobassignments) {
					if (err) {
                   console.log("Error:", err);
                  }
				   else {
				   cache.del('myjsonobj');
				   res.redirect("/jobassignments");
	              }
				});
			  }				  
			});
			 
	   });
	
});
	
	
// Edit employee
router.get('/edit/:id', function(req, res) {
  jobassignment.edit(req, res);
});

// Edit update
router.post('/update/:id',upload.any(), function(req,res,next) {
	var obj=cache.get('myjsonobj');
  JobAssignment.findById(req.params.id, function(err, data) {	
  
  
  
    data.company_id = req.body.company;
    data.company = getClientByKey(req.body.company, obj.company);
	data.vessel_id = req.body.vessel;
    data.vessel = getValueByKey(req.body.vessel, obj.vessel);
	data.job_catid = req.body.jobcategory;
    data.jobcategory = getJobCategoryByKey(req.body.jobcategory, obj.jobcategory);
    data.job_typeid = req.body.jobtype;
    data.jobtype = getJobTypeByKey(req.body.jobtype, obj.jobtype);
	data.employee_id = req.body.employeename;
    data.employeename = getEmpByKey(req.body.employeename, obj.employee);
	data.vesselschedule = req.body.contact;
    data.travelfromdate = req.body.travelfromdate;
    data.traveltodate = req.body.traveltodate;
	data.destfrom = req.body.destfrom;
	data.destto = req.body.destto;
	data.airdestfrom = req.body.airdestfrom;
	data.airdestto = req.body.airdestto;
  
    if(data.travelfromdate != null)
	 {
	   data.travelfromdate = data.travelfromdate.toLocaleDateString("en-US");
	 }
	 if(data.traveltodate != null)
	 {
	   data.traveltodate = data.traveltodate.toLocaleDateString("en-US");
	 }
    data.save(function(err, data) {
        if (err) {
          return next(err);
        }
		if(req.files.length > 0){
			    var dir1 = './public/uploads/vesseljobtrackers/'+ data.job_Assignid + '/SEQ' ;
			    var dir2 = './public/uploads/vesseljobtrackers/'+ data.job_Assignid + '/AdditionalDocuments';	
					 for(var i = 0; i < req.files.length ;i++)
			          {	
				        if(req.files[i].fieldname == "doc")
						{
							fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							var uploaddoc = {columnmap: data.job_Assignid, document: req.files[i].filename, 
							                 filepath: '/uploads/vesseljobtrackers/'+ data.job_Assignid + '/SEQ' + '/' + req.files[i].filename,
											 status:'Active' ,typeofdoc: 'SEQ'};
									  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
									  if(err){
										console.log("err",err);
									  }
								
							});
						}
                        if(req.files[i].fieldname == "files[]")
				         {	
                            fs.move('./public/uploads/vesseljobtrackers/' + req.files[i].filename , dir2 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  var uploaddoc = {columnmap: data.job_Assignid, document: req.files[i].filename, 
							                   filepath: '/uploads/vesseljobtrackers/'+ data.job_Assignid + '/AdditionalDocuments' + '/' + req.files[i].filename,
											   status:'Active' ,typeofdoc: 'Additional Documents'};
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  	                       
				              });
						 }					 
					
					  }
				}
        JobAssignment.find({}).exec(function (err, jobassignments) {
                  if (err) {
                   console.log("Error:", err);
                  }
                  else {
				   cache.del('myjsonobj');
		           res.render("../views/jobassignments/index", {jobassignments: jobassignments});
	              }
                });
      });
    });
  });

// Edit update
router.post('/complete/:id', function(req, res, next) {
  jobassignment.complete(req, res);
});

module.exports = router;
