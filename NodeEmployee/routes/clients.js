var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var client = require("../controllers/ClientController.js");
var path = require('path');
var multer  =   require('multer');
var path = require('path');
var cache = require('memory-cache');
var Client = require("../models/Client");
var fs = require('fs-extra')
var filessystem = require('fs');
var ClientContact = require("../models/ClientContact");
var opn= require('opn');

// file upload destination folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/clientdocuments');
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

function getValueByKey(key, data) {
   for (i in data) {
		 if (data[i]._id == key) {
            return data[i].name;
        }
    }
}

// Get all client
router.get('/', function(req, res) {
  client.list(req, res);
});

// Get single client by id
router.get('/show/:id', function(req, res) {
  client.show(req, res);
});

// Create client
router.get('/create', function(req, res) {
  client.create(req, res);
});

// Save client
router.post('/save',upload.any(),function(req, res,next) {
	
	var obj=cache.get('myjsonobj');
	
	
	
    var client_id;
       
	   mongoose.connection.db.collection("counters").findAndModify( { _id: 'clientid' }, null, { $inc: { sequence_value: 1 } }, function(err, result){
        if(err) console.log("Error:",err);
	         client_id = result.value.sequence_value;
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

             client_id = 'CL' + year + mm + dd + client_id ;
             var client = new Client(req.body);
             client.client_id = client_id;
			 client.companyname = req.body.companyname;
			 client.address = req.body.address;
			 client.country = req.body.country;
			 client.city = req.body.city;
			 client.officeno = req.body.officeno;
			 client.website = req.body.website;
			 client.status = "Active";
			 
			 var dir = './public/uploads/clientdocuments/'+ client.client_id ;
			          
			 filessystem.mkdirSync(dir);
			 
			 var dir1 = './public/uploads/clientdocuments/'+ client.client_id +'/Proposal&Contract';
			 filessystem.mkdirSync(dir1);
			
			 
               client.save(function(err) {
				  if(err) {
                      console.log(err);
                      res.render("../views/clients/create");
                    }else {
						
						 if(req.files.length > 0)
			            {
						  for(var i = 0; i < req.files.length ;i++)
				           {
							  
							fs.move('./public/uploads/clientdocuments/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
							 if (err) return console.error(err)
							 console.log("success!")
							});
							  
							  var uploaddoc = {columnmap: client.client_id, document: req.files[i].filename, 
							  filepath: '/uploads/clientdocuments/'+ client.client_id + '/Proposal&Contract' + '/' + req.files[i].filename,
							  status:'Active' ,typeofdoc: 'Proposal/Contract'};
							  console.log(uploaddoc);
							  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						      if(err){
						        console.log("err",err);
							  }
							  
							  });
						   }
					    }
						
						
						 if(req.body.id1.length > 0)
		                  {
							  var obj1 = JSON.parse(req.body.id1);
			
			
								for (var i = 0;i < obj1.length; i++)
								{
									
									console.log(obj1[i]["Office Number"]);
									console.log(obj1[i]["Mobile Number"]);
									
									var clientcontact = {client_id: client.client_id, firstname: obj1[i]["First Name"],  
												   lastname: obj1[i]["Last Name"],designation: obj1[i]["Designation"],
												   email: obj1[i]["Email"],officeno: obj1[i]["Office Number"],
												   mobileno: obj1[i]["Mobile Number"],status:'Active'};
												   
												   mongoose.connection.db.collection("clientcontact").insert(clientcontact, function(err, result){
													  if(err){
														console.log("err",err);
													  }
													  
												  });
								}
						  }
						
					    
					  console.log("Successfully created a client.");
                      Client.find({}).exec(function (err, clients) {
                          if (err) {
                             console.log("Error:", err);
                             }
                          else {
							 cache.del('myjsonobj');
                             res.render("../views/clients/index", {clients: clients});
                             }
                      });
                    }
			 });
	   });
      
});

router.post('/update/:id',upload.any(), function(req,res,next) {
	
  console.log("start");
  Client.findById(req.params.id, function(err, data) {	
  
  
  data.companyname=req.body.companyname;
  data.address = req.body.address;
  data.officeno = req.body.officeno;
  data.country = req.body.country;
  data.city = req.body.city;
  data.website = req.body.website;
  
  var dir1 = './public/uploads/clientdocuments/'+ data.client_id + '/Proposal&Contract' ;
 
  
  data.save(function(err, data) {
	  console.log("i am coming here");
        if (err) {
          return next(err);
        }
		
		
		
		
		if(req.body.id1.length > 0)
		{
			console.log("req.body.id1.length");
			 var obj1 = JSON.parse(req.body.id1);
			 var obj2 = JSON.parse(req.body.id1);
		
		     if (obj1!= null){
				 
				 
				 
				 ClientContact.find({client_id: data.client_id}).exec(function (err, clientcontact) {
                  if (err) {
                   console.log("Error:", err);	
                  }
                  else{
					 
					  if (clientcontact.length > 0 && obj1.length == 0 )
					  {
						  ClientContact.remove({client_id: data.client_id}, function(err) {
										if(err) {
										  console.log(err);
										}
										else {
										  console.log("child deleted!1c ");
										  
										}	
						  });
					  }
				    }
				  
                  });
							  if(obj1.length > 0)
							   
							   {
									 console.log("obj1",data.client_id);
									
										ClientContact.remove({client_id: data.client_id}, function(err) {
										if(err) {
										  console.log(err);
										}
										else {
										  console.log("child deleted!1c ");
										  
										}
									  
								                        				  
								console.log(obj2);
								console.log("obj2",data.client_id);
								for (var i = 0;i < obj2.length; i++)
								{
									console.log("insert2a child records",obj2.length);
									console.log("insert2b child records",i);
									
									var clientcontact = {client_id: data.client_id, firstname: obj2[i]["First Name"],  
												   lastname: obj2[i]["Last Name"],designation: obj2[i]["Designation"],
												   email: obj2[i]["Email"],officeno: obj2[i]["Office Number"],
												   mobileno: obj2[i]["Mobile Number"],status:'Active'};
										console.log("child records2c", i, clientcontact);	   
								    mongoose.connection.db.collection("clientcontact").insert(clientcontact, function(err, result){
									  if(err){
										console.log("err2d",err);
										}
									  else{console.log("suceess child record insert 2e", i);}
									});
								}
                                });
							   }
		     }
		}
							   
			if(req.files.length > 0)
               {
	            for(var i = 0; i < req.files.length ;i++)
					 {
						 
					  fs.move('./public/uploads/clientdocuments/' + req.files[i].filename , dir1 + '/' + req.files[i].filename , function (err) {
											 if (err) return console.error(err)
											 console.log("success!")
											});
					  var uploaddoc = {columnmap: data.client_id, document: req.files[i].filename,
									   filepath: '/uploads/clientdocuments/'+ data.client_id + '/Proposal&Contract' + '/' + req.files[i].filename,
									   status: 'Active',typeofdoc: 'Proposal/Contract' };
					  mongoose.connection.db.collection("uploaddocuments").insert(uploaddoc, function(err, result){
						if(err){
						   console.log("err",err);
						}
					 });
					}
			   }
		
		
		
        Client.find({}).exec(function (err, clients) {
                  if (err) {
                   console.log("Error:", err);	
                  }
                  else {
				   cache.del('myjsonobj');
		           res.render("../views/clients/index", {clients: clients});
	              }
                });
      });
    });
  });







// Edit client
router.get('/edit/:id', function(req, res) {
  client.edit(req, res);
});


// Edit update
router.post('/inactive/:id', function(req, res, next) {
  client.inactive(req, res);
});
router.get('/returncity', function(req, res, next) {
   var country_name = req.query.country_name;
   
   var cities = require ('countries-cities').getCities(country_name); 
   
   res.send(cities);
   
});


module.exports = router;
