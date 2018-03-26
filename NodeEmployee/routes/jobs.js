/* NodeJs mongodb tutorial - insert update delete records */

var express     = require('express');
var router      = express.Router();
var mongodb     = require('mongodb');
var MongoClient = mongodb.MongoClient;

/*var dburl = "mongodb://pragyanAG:pragyan123@ds059365.mlab.com:59365/shippingtest";*/

var dburl = "mongodb://safe:safe123/localhost/safelanes";


/* GET products listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
		db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
           if(err) throw err;
            res.render("../views/jobs/index", {data: docs,data1: docs1});
            db.close();
		});
    });
  });
});

router.get('/fetchdata', function(req, res, next) {
   var id = req.query.id;
   MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('jobcategorys').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
      if(err) throw err;
	  res.send(docs);
      db.close();
    });
  });
});

router.post('/add', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('jobcategorys');
    var jobcategory = { jobcategory: req.body.jobcategory, status: 'Active'};
    collection.insert(jobcategory, function(err, result) {
    if(err) { throw err; }
      
      db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
		  db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
      if(err) throw err;
      res.render("../views/jobs", {data: docs,data1: docs1});
      db.close();
    });
	  });
     });
  });
});
router.post('/edit', function(req, res, next) {
	
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('jobcategorys');
	collection.update({'_id':new mongodb.ObjectID(req.body.id)}, {$set:{'jobcategory': req.body.jobcategory}}, function(err, result) {
    if(err) { throw err; }
    db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
         db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
           if(err) throw err;
            res.render("../views/jobs/index", {data: docs,data1: docs1});
            db.close();
		});
         });
     });
  });
});

router.get('/inactive', function(req, res, next) {
  var id = req.query.id;
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }

    db.collection('jobcategorys', function(err, jobcategorys) {
      jobcategorys.update({_id: new mongodb.ObjectID(id)},{$set:{'status':'Inactive'}}, function(err, result) {
	  
      if (err){
         throw err;
       }else{
	   db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
			  db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
          if(err) throw err;
          res.render("../views/jobs", {data: docs,data1: docs1});
          db.close();
              });
		  });
       }
	  });
    });
  });
});



router.post('/addjob', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
   
	
	var varJobcat;
	 db.collection('jobcategorys').find({_id: new mongodb.ObjectID(req.body.jobcategory1)}).toArray(function(err, docs){
		 
		 varJobcat = docs[0].jobcategory;
		
    var collection = db.collection('jobtypes');
	
    var jobtype = { jobcategory: varJobcat, jobcategory_id: req.body.jobcategory1, jobtype: req.body.jobtype, 
	                    jobdescription: req.body.jobdescription, status:'Active' };
						
				
    collection.insert(jobtype, function(err, result) {
    if(err) { throw err; }
     db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){ 
      db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
      if(err) throw err;
      res.render("../views/jobs", {data1: docs1,data: docs});
      db.close();
       });
	   });
	 });
     });
  });
});

router.get('/fetchdatajob', function(req, res, next) {
   var id = req.query.id;
   MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('jobtypes').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
      if(err) throw err;
	  res.send(docs);
      db.close();
    });
  });
});


router.post('/editjob', function(req, res, next) {
	
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
	
	var varJobcat1;
	
	 db.collection('jobcategorys').find({_id: new mongodb.ObjectID(req.body.jobcategory1)}).toArray(function(err, docs){
console.log(req.body.jobcategory1);
console.log(docs);	
	varJobcat1 = docs[0].jobcategory;
	
    var collection = db.collection('jobtypes');
	 collection.update({'_id':new mongodb.ObjectID(req.body.id1)}, {$set:{'jobcategory': varJobcat1,'jobcategory_id': req.body.jobcategory1,
	                                                                    'jobtype': req.body.jobtype,'jobdescription':req.body.jobdescription}}, function(err, result) {
    if(err) { throw err; }
	db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
         db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
           if(err) throw err;
            res.render("../views/jobs/index", {data: docs,data1: docs1});
            db.close();
		});
         });
	});
     });
  });
});

router.get('/inactivejob', function(req, res, next) {
  var id = req.query.id;
  console.log(id);
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }

    db.collection('jobtypes', function(err, jobtypes) {
      jobtypes.update({_id: new mongodb.ObjectID(id)},{$set:{'status':'Inactive'}}, function(err, result) {
		 
      if (err){
         throw err;
       }else{
          db.collection('jobcategorys').find({status :'Active'}).toArray(function(err, docs){
			  db.collection('jobtypes').find({status :'Active'}).toArray(function(err, docs1){
          if(err) throw err;
          res.render("../views/jobs", {data: docs,data1: docs1});
          db.close();
              });
		  });
       }
	  });
    });
  });
});


module.exports = router;