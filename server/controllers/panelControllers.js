let panelModel = require('../models/panelModel.js');
let adminSessionIDs = require("../adminLoginIDs.js");

module.exports = {
	adminpanel: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			res.sendFile("adminpanel.html", {root: "./"});
		else
			res.redirect("/adminlogin");
	},

	adminlogin: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			res.redirect("adminpanel");
		else
			res.sendFile("adminlogin.html", {root: "client/static/html"});
		
		console.log(req.sessionID);
	},
	adminloginPost: function(req, res){
		//admin login
		//username: admin, password: fmf4__dev
		panelModel.validateLogin(req, res);
	},

	getCalendarData: function(req, res){
		panelModel.getCalendarData(req, res);
	},

	getStudentsForClass: function(req, res){
		if(adminSessionIDs[req.sessionID] === true)
			panelModel.getStudentsForClass(req, res);
		else
			res.status(401).send("plz login");
	},

	addCategory: function(req, res){
		panelModel.addCategory(req, res);
	},
	deleteClassDescription: function(req, res){
		panelModel.deleteClassDescription(req, res);
	},

	deleteScheduledClass: function(req, res){
		panelModel.deleteScheduledClass(req,res);
	},
	deleteCategory: function(req, res){
		panelModel.deleteCategory(req, res);
	},
	deleteLocation: function(req, res){
		panelModel.deleteLocation(req, res);
	},

	updateCategory: function(req, res){
		panelModel.updateCategory(req, res);
	},

	updateScheduledClass: function(req, res){
		console.log("edit scheulded class BE controller")
		panelModel.updateScheduledClass(req, res);
	},
	updateLocation: function(req, res){
		panelModel.updateLocation(req, res);
	},
	updateClassDescription: function(req, res){
		panelModel.updateClassDescription(req, res);
	},
	getCategories: function(req, res){
		panelModel.getCategories(req, res);
	},
	getOneStudent: function(req, res){
		console.log(req, "from BE controllers" );
		panelModel.getOneStudent(req, res);
	},
	getClassInstances: function(req, res){
		panelModel.getClassInstances(req, res);
	},
	getLocations: function(req, res){
		panelModel.getLocations(req, res);
	},
	addLocation: function(req, res){
		panelModel.addLocation(req, res);
	},

	addDescriptions: function(req, res){
		panelModel.addDescriptions(req, res);
	},

	getClassDescriptions: function(req, res){
		panelModel.getClassDescriptions(req, res);
	},
	scheduleClass: function(req, res){
		panelModel.scheduleClass(req, res);
	}
}
