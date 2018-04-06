var express = require('express');
var router = express.Router();
var JobAssignment = require("../models/JobAssignment");
/* GET home page. */
router.get('/', function(req, res, next) {
  JobAssignment.find({}).exec(function (err, jobassignments) {
	console.log(jobassignments); 
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  res.render('dashboard', { title: 'Express' });
	  
    }
  });
  
});

router.get('/employee', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});



module.exports = router;
