var u = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var JobAssignment = require("../models/JobAssignment");
/* GET home page. */
router.get('/', function(req, res, next) {
	 mongoose.connection.db.collection("year").find({}).toArray(function(err, year){
     if(err) console.log("Error:",err);
	 res.render('dashboard', { year:year });
	 });
});

router.get('/employee', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});

router.get('/d3sample/datetime', function(req, res, next) {
	var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
	
  
  var jsonSingle = {};
  var jsonRes = [];
  console.log(jsonData);
  u.map(jsonData, function(item){
	
	var newinserteddt = new Date(item.inserted_at);
	console.log("hi",newinserteddt);
	
    
   
	 var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
    console.log(item.inserted_at);
    console.log(year + '-' + month);
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
  // console.log(jsonData);
  u.chain(jsonData)
      .groupBy("vesselschedule","year")
      .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("vesselschedule","quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("vesselschedule","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
 
  res.send(JSON.stringify(jsonRes));
	});
});

function getQuarter(month, year){
  if(month == 'Jan' || month == 'Feb' || month == 'Mar'){
    return "Q1-" + year;
  }
  if(month == 'Apr' || month == 'May' || month == 'Jun'){
    return "Q2-" + year;
  }
  if(month == 'Jul' || month == 'Aug' || month == 'Sep'){
    return "Q3-" + year;
  }
  if(month == 'Oct' || month == 'Nov' || month == 'Dec'){
    return "Q4-" + year;
  }
}



	


router.get('/d3sample/datetime', function(req, res, next) {
	
	
	
	var jsonData;
	JobAssignment.find({}).exec(function (err, jobassignments) {
	
    if (err) {
      console.log("Error:", err);
    }
    else {
		
	  jsonData = JSON.parse(JSON.stringify(jobassignments));
	  
    }
	
  
  var jsonSingle = {};
  var jsonRes = [];
  
  u.map(jsonData, function(item){
	
	var newinserteddt = new Date(item.inserted_at);
	console.log("hi",newinserteddt);
	
    
   
	 var dd = newinserteddt.getDate();
     var month = newinserteddt.getMonth()+1; //January is 0!
     var yyyy = newinserteddt.getFullYear();
     var year = yyyy.toString().substr(-2);
	 
    console.log(item.inserted_at);
    console.log(year + '-' + month);
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
  // console.log(jsonData);
  u.chain(jsonData)
      .groupBy("vesselschedule","year")
      .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("vesselschedule","quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("vesselschedule","month")
                .map(function(monthData, monthName){
                  var mdata = {};
                  mdata.month = monthName;
                  mdata.monthCount = u.size(monthData).toString();
                  qdata.monthlist.push(mdata);
                });
                yearWise.quarterlist.push(qdata);
              });
          jsonRes.push(yearWise);
        });
 
  res.send(JSON.stringify(jsonRes));
	});
  
});

function getQuarter(month, year){
  if(month == 'Jan' || month == 'Feb' || month == 'Mar'){
    return "Q1-" + year;
  }
  if(month == 'Apr' || month == 'May' || month == 'Jun'){
    return "Q2-" + year;
  }
  if(month == 'Jul' || month == 'Aug' || month == 'Sep'){
    return "Q3-" + year;
  }
  if(month == 'Oct' || month == 'Nov' || month == 'Dec'){
    return "Q4-" + year;
  }
}



	


module.exports = router;