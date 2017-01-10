var panelControllers = require('../controllers/panelControllers.js');

var staticRoutes = {
	"/": "index.html",
	"/CustomJiraTraining": "CustomJiraTraining.html",
	"/JiraTraining": "JiraTraining.html",
	"/ScrumTraining": "ScrumTraining.html",
	"/SVPTITraining": "SVPTITraining.html",
	"/about": "about.html",
	"/calendar": "calendar.html",
	"/contact" : "contact.html"
};

module.exports = function(app){
	
	for(let route in staticRoutes)
	{
		console.log("route", route);
		console.log("file", staticRoutes[route]);
		app.get(route, function(req, res){
			console.log("right server");
			res.sendFile(staticRoutes[route], {root: "client/static/html"});
		});
	}

	app.get("calendar_data", panelControllers.getCalendarData);

	app.get("/adminpanel", panelControllers.adminpanel);
	app.get("/categories", panelControllers.getCategories);

	app.get("/adminlogin", function(req, res){
		panelControllers.adminlogin(req, res);
	});

	app.get("/get_students_for_class/:id", function(req, res){
		panelControllers.getStudentsForClass(req, res);
	});

	app.get("/class_descriptions", function(req, res)
	{
		panelControllers.getClassDescriptions(req, res);
	});

	app.get("/students", function(req, res)
	{
		panelControllers.getStudents(req, res);
	});

	app.post("/get_one_student", function(req, res)
	{
		panelControllers.getOneStudent(req, res);
	});

	app.get("/class_instances", function(req, res)
	{
		panelControllers.getClassInstances(req, res);
	});

	app.get("/locations", function(req, res)
	{
		panelControllers.getLocations(req, res);
	});

	app.post("/edit_category", panelControllers.updateCategory);
	app.post("/schedule_class", panelControllers.scheduleClass);
	app.post("/edit_location", panelControllers.updateLocation);
	app.post("/edit_class_description", panelControllers.updateClassDescription);
	app.post("/edit_scheduled_class", panelControllers.updateScheduledClass);
	app.post("/delete_category", panelControllers.deleteCategory);
	app.post("/delete_class_description", panelControllers.deleteClassDescription);
	app.post("/delete_location", panelControllers.deleteLocation);
	app.post("/categories", panelControllers.addCategory);
	app.post("/locations", panelControllers.addLocation);
	app.post("/descriptions", panelControllers.addDescriptions);
	app.post("/adminlogin", function(req, res){
		panelControllers.adminloginPost(req, res);
	});	
};