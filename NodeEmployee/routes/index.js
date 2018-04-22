var u = require('underscore');
var express = require('express');
var router = express.Router();
var JobAssignment = require("../models/JobAssignment");
var VdrAnalysis = require("../models/VdrAnalysis");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/employee', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});

router.get('/d3/bar', function(req, res, next) {
	
		var barJson;
		VdrAnalysis.find({}).exec(function (err, vdranalysiss) {
		
		if (err) {
		  console.log("Error:", err);
		}
		else {
			
		  barJson = JSON.parse(JSON.stringify(vdranalysiss));
		  
		}
	
     
      var jsonRes = [];
      u.map(barJson, function(item){
	   var newinserteddt = new Date(item.inserted_at);
        //var len = item.inserted_at.length;
       var newinserteddt = new Date(item.inserted_at);
       var dd = newinserteddt.getDate();
       var month = newinserteddt.getMonth()+1; //January is 0!
       var yyyy = newinserteddt.getFullYear();
       var year = yyyy.toString().substr(-2);
	 
    
       item.year = year; 
       item.quarter = getQuarter(month, year); 
       item.month = month + '-' + year; 
      });

      u.chain(barJson)
          .groupBy("year")
          .map(function(value, key){
              var yearWise = {};
              yearWise.year = key;
              yearWise.yearCount = u.size(value).toString();
              jsonRes.push(yearWise);
          });
      
      res.send(JSON.stringify(jsonRes));
		});
});

router.get('/d3sample', function(req, res, next) {
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
  //console.log(jsonRes);
  /*
  var countByYear = u.countBy(jsonData, function(item) {
    var len = item.create_date.length;
    var year = item.create_date.substring(len-4,len);
    console.log(year);
    return year;
  });
  var jsonFinal = {};
  u.chain(jsonData)
          .groupBy("")

  console.log(countByYear);
  */
  res.send(JSON.stringify(jsonRes));
	});
});

function getBarJsonData() {
  var barJson = [{"_id":"5ad0b1b46fd1cb1fdcc8b3a7","vdr_id":"V18041311","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804061","company":"Agro Financial Services","vdrmake":"JCY","vdrmodel":"1900","analysis_id":"5a90419df36d286fea35c65c","analysis":"Agilitics","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-03-13T13:33:40.322Z"},{"_id":"5ad0b1ca6fd1cb1fdcc8b3a8","vdr_id":"V18041312","auditor_id":"","vessel_id":"5ac745b8734d1d2fb5421176","vessel":"Bunga Kelana 4","company_id":"CL1804062","company":"ABCL","vdrmake":"JCR100","vdrmodel":"2000","analysis_id":"5a90419df36d286fea35c65c","analysis":"Agilitics","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2017-04-13T13:34:02.541Z"},{"_id":"5ad0b2156fd1cb1fdcc8b3a9","vdr_id":"V18041313","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804061","company":"Agro Financial Services","vdrmake":"AWS","vdrmodel":"1221","analysis_id":"5a90419df36d286fea35c65c","analysis":"Agilitics","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-02-13T13:35:17.283Z"},{"_id":"5ad0b22f6fd1cb1fdcc8b3aa","vdr_id":"V18041314","auditor_id":"","vessel_id":"5ac745b8734d1d2fb5421176","vessel":"Bunga Kelana 4","company_id":"CL1804062","company":"ABCL","vdrmake":"QWS","vdrmodel":"2000","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2017-04-13T13:35:43.937Z"},{"_id":"5ad0b2416fd1cb1fdcc8b3ab","vdr_id":"V18041315","auditor_id":"","vessel_id":"5ac745b8734d1d2fb5421176","vessel":"Bunga Kelana 4","company_id":"CL1804062","company":"ABCL","vdrmake":"AS2333","vdrmodel":"4566","analysis_id":"","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2017-11-13T13:36:01.520Z"},{"_id":"5ad0b28b6fd1cb1fdcc8b3ac","vdr_id":"V18041316","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804062","company":"ABCL","vdrmake":"ere","vdrmodel":"3000","analysis_id":"5a90419df36d286fea35c65c","analysis":"Agilitics","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-01-13T13:37:15.855Z"},{"_id":"5ad0b2a36fd1cb1fdcc8b3ad","vdr_id":"V18041317","auditor_id":"","vessel_id":"5ac745b8734d1d2fb5421176","vessel":"Bunga Kelana 4","company_id":"CL1804062","company":"ABCL","vdrmake":"CDE","vdrmodel":"2100","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-02-13T13:37:39.891Z"},{"_id":"5ad0b2c06fd1cb1fdcc8b3ae","vdr_id":"V18041318","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804062","company":"ABCL","vdrmake":"QAW","vdrmodel":"2100","analysis_id":"","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-04-13T13:38:08.218Z"},{"_id":"5ad0b2d46fd1cb1fdcc8b3af","vdr_id":"V18041319","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804062","company":"ABCL","vdrmake":"AWE","vdrmodel":"1222","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2017-11-13T13:38:28.353Z"},{"_id":"5ad0b2e46fd1cb1fdcc8b3b0","vdr_id":"V18041320","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804061","company":"Agro Financial Services","vdrmake":"QWR","vdrmodel":"4000","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-04-13T13:38:44.922Z"},{"_id":"5ad0b2fb6fd1cb1fdcc8b3b1","vdr_id":"V18041321","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804062","company":"ABCL","vdrmake":"AWS","vdrmodel":"1200","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2018-04-13T13:39:07.732Z"},{"_id":"5ad0b3c66fd1cb1fdcc8b3b2","vdr_id":"V18041322","auditor_id":"","vessel_id":"5ac7458f734d1d2fb542114e","vessel":"Unique Infinity","company_id":"CL1804061","company":"Agro Financial Services","vdrmake":"aqw","vdrmodel":"3000","analysis_id":"5a904320f36d286fea35c8aa","analysis":"IDRC","drcvclient":null,"alldocrcvd":null,"dtdatasent":null,"dtanacomp":null,"dtassign":null,"dtdeliver":null,"dtcomp":null,"duedate":null,"status":"Active","__v":0,"inserted_at":"2017-05-13T13:42:30.372Z"}];
  return barJson;
}

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

function getJsonData() {
  var json = [{
    "company":"aaaa",
    "create_date":"20-Oct-2017",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"22-Oct-2017",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Oct-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Oct-2019",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Oct-2019",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Oct-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Oct-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Nov-2017",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"02-Oct-2017",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Jun-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Mar-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Feb-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Aug-2018",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Apr-2019",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Jan-2019",
    "status":"Active"
  },
  {
    "company":"aaaa",
    "create_date":"20-Sep-2019",
    "status":"Active"
  }
];
  return json;
  // return [{"_id":"5ab8e45093c7dc119408e7cc","job_Assignid":"1803261","company_id":"CL1803263","company":"a","vessel_id":"5a66f28c815eb9ab77fa440e","vessel":"Unique Infinity","job_catid":"5ab8e42193c7dc119408e7ca","jobcategory":"Inspection","job_typeid":"5ab8e42b93c7dc119408e7cb","jobtype":"Audit","employee_id":"SL18005","employeename":"aaaaaaaa aaaaaaaaaaa","travelfromdate":null,"traveltodate":null,"vesselschedule":"completed","destfrom":"Bangladesh","destto":"Colombia","airdestfrom":"Chittagong Airport","airdestto":"Sesquicentenario Airport","status":"Active","__v":0},{"_id":"5ab8e4e993c7dc119408e7cf","job_Assignid":"1803262","company_id":"CL1803263","company":"a","vessel_id":"5a66f28c815eb9ab77fa440e","vessel":"Unique Infinity","job_catid":"5ab8e42193c7dc119408e7ca","jobcategory":"Inspection","job_typeid":"5ab8e42b93c7dc119408e7cb","jobtype":"Audit","employee_id":"SL18005","employeename":"aaaaaaaa aaaaaaaaaaa","travelfromdate":null,"traveltodate":null,"vesselschedule":"planned","destfrom":"","destto":"","status":"Active","__v":0},{"_id":"5ab9af4b8252ee3250e4d883","job_Assignid":"1803273","company_id":"CL1803263","company":"a","vessel_id":"5a66f28c815eb9ab77fa440e","vessel":"Unique Infinity","job_catid":"5ab8e42193c7dc119408e7ca","jobcategory":"Inspection","job_typeid":"5ab8e42b93c7dc119408e7cb","jobtype":"Audit","employee_id":"SL18005","employeename":"aaaaaaaa aaaaaaaaaaa","travelfromdate":null,"traveltodate":null,"vesselschedule":"planned","destfrom":"","destto":"","status":"Active","__v":0}];
}

module.exports = router;
