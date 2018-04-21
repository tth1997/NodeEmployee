var mongoose = require('mongoose');
var ClientContactSchema = new mongoose.Schema({
	client_id: String,
	firstname: String,
	lastname: String,
	designation: String,
	email: {
	  type:[String],
	  usePushEach: true},
	officeno: String,
	mobileno: String,
	status: String
	
});

module.exports = mongoose.model('ClientContact', ClientContactSchema,'clientcontact');
