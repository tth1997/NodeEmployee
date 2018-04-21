var u = require('underscore');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.get('/employee', function(req, res, next) {
  res.render('employee', { title: 'Express' });
});

router.get('/d3sample', function(req, res, next) {
  var jsonData = getJsonData();
  var jsonSingle = {};
  var jsonRes = [];
  u.map(jsonData, function(item){
    var len = item.create_date.length;
    var year = item.create_date.substring(len-4,len);
    var month = item.create_date.substring(len-8,len-5);
    console.log(item.create_date);
    console.log(year + '-' + month);
    item.year = year; 
    item.quarter = getQuarter(month, year); 
    item.month = month + '-' + year; 
  });
  // console.log(jsonData);
  u.chain(jsonData)
      .groupBy("year")
      .map(function(value, key){
          var yearWise = {};
          yearWise.year = key;
          yearWise.yearCount = u.size(value).toString();
          yearWise.quarterlist = [];
          u.chain(value)
            .groupBy("quarter")
            .map(function(quarterData, quarterName){
              var qdata = {};
              qdata.quarter = quarterName;
              qdata.quarterCount = u.size(quarterData).toString();
              qdata.monthlist = [];
              u.chain(quarterData)
                .groupBy("month")
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
