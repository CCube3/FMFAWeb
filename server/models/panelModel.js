let mysql = require('mysql');
let bcrypt = require("bcryptjs");
let crypto = require("crypto");
let adminSessionIDs = require("../adminLoginIDs.js");
let connection = mysql.createConnection({
    port     : 8889,
    host     : "localhost",
    user     : "root",
    password : "root",
    database : "mydb"
});
module.exports = {
    getCalendarData: function(req, res){
        let columns = "class_descriptions.class_name, class_descriptions.class_description, categories.category_name, categories.category_description, class_instances.class_descriptions_id, class_instances.min_students, class_instances.max_students, class_instances.start_date, class_instances.end_date, locations.location_description, locations.location_name"
        let query = "select "+ columns +" from class_instances join locations on class_instances.locations_id = locations.id join class_descriptions on class_instances.class_descriptions_id = class_descriptions.id join categories on class_descriptions.categories_id = categories.id";
        
        try
        {
            connection.query(query, function(err, rows, fields){
                if(err)
                    res.json(err);
                else
                    res.json(rows);
            });
        }
        catch (e)
        {
            printQueryException(e, query);
            res.json([]);
        }
    },

    getClassStudentCount: function(req, res){
        let query = "select count(*), classes_has_students.class_instance_id, class_descriptions.class_name from classes_has_students join class_instances on classes_has_students.class_instance_id = class_instances.id join class_descriptions on class_instances.class_descriptions_id = class_descriptions.id where classes_has_students.waitlisted is not true;";
        
        try
        {
            connection.query(query, function(err, rows, fields){
                if(err)
                    res.json(err);
                else
                    res.json(rows);
            });
        }
        catch (e)
        {
            printQueryException(e, query);
            res.json([]);
        }

    },
    validateLogin: function(req, res){
        let query = "select * from admin_logins where username = '"+ req.body.username +"'";
        try
        {
            connection.query(query, function(err, rows, fields){
                //console.log(req.body);
                //username: admin, password: fmf4__dev
                if(err || rows[0] === undefined)
                {
                    res.redirect("/adminpanel");
                }
                else if(bcrypt.compareSync(req.body.password, rows[0].password))
                {
                    req.session.name = rows[0].username;
                    adminSessionIDs[req.sessionID] = true;
                    res.redirect("/adminpanel");
                }
                else
                    res.sendFile("/static/html/adminlogin_wrong.html", {root: "client"});
            });
        }
        catch (e)
        {
            queryException(e, query);
        }
        return false;
    },
    addCategory: function(req, res)
    {
        let query;
        try
        {
            query = insertQuery("categories", req.body);
            connection.query(query, function(err, result){
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    deleteCategory: function(req, res)
    {
        console.log(req.body.id);
        let query = "DELETE FROM categories where id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    deleteScheduledClass: function(req, res)
    {
        // console.log(req.body, "delete sccheduled class from the BE");
        let query = "DELETE FROM class_instances where id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    deleteClassDescription: function(req, res)
    {
        console.log(req.body.id);
        let query = "DELETE FROM class_descriptions where id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    deleteLocation: function(req, res)
    {
        console.log(req.body.id, "delete location from modal");
        let query = "DELETE FROM locations where id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    updateCategory: function(req, res)
    {
        console.log(req.body.id);
        let query = "UPDATE categories set category_name = " + addQuotes(req.body.category_name) + ", " + "category_description = " + addQuotes(req.body.category_description) + " WHERE id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                // console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    
    scheduleClass: function(req, res)
    {
        var start_date = dateTimeAdjustHours(req.body.start_date.slice(0, 10) + " " + req.body.start_time.slice(11, 19), -8);
        var end_date = dateTimeAdjustHours(req.body.start_date.slice(0, 10) + " " + req.body.end_time.slice(11, 19), -8);
        var insert_body = {
            locations_id : req.body.locations_id,
            class_descriptions_id : req.body.class_descriptions_id,
            start_date : start_date,
            end_date: end_date,
            min_students : req.body.min_students,
            max_students : req.body.max_students
        }
        let query = insertQuery("class_instances", insert_body);
        // console.log(query);
        try
        {
            connection.query(query, function(err, result){
                // console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result + "add class from model"); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    updateLocation: function(req, res)
    {
        let query = "UPDATE locations set location_name = " + addQuotes(req.body.location_name) + ", " + "location_description = " + addQuotes(req.body.location_description) + "WHERE id = " + req.body.id;
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    updateClassDescription: function(req, res)
    {
        console.log(req.body, "EHREHRERERERE");
        let subQuery = "(SELECT id FROM categories WHERE category_name='"+ req.body.category +"' LIMIT 1)";
        let query = "UPDATE class_descriptions set class_name = " + addQuotes(req.body.class_name) + ", class_description = " + addQuotes(req.body.class_description) + ", categories_id = " + subQuery + " WHERE id = " + req.body.id;
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    updateScheduledClass: function(req, res)
    {
        console.log(req.body);
        var startTime = req.body.start_date.slice(0,10);
        var newStartDateTime = startTime + " " + req.body.start_time.slice(11, 19) ;
        var insertnewStartDateTime = dateTimeAdjustHours(newStartDateTime, -8);
        var newEndTimeBefore = req.body.end_time.slice(11, 19);
        var imTiredOfThisShit = startTime + " " + newEndTimeBefore;
        var newEndTimeAfter = dateTimeAdjustHours(imTiredOfThisShit, -8);
        // console.log(newEndTimeAfter);
        let query = "UPDATE class_instances SET class_instances.locations_id = " + addQuotes(req.body.location_id) + ", " + "class_instances.class_descriptions_id = " + addQuotes(req.body.class_description_id) + ", " + 
        "class_instances.start_date = " + addQuotes(insertnewStartDateTime) + ", " +  "class_instances.end_date = " + addQuotes(newEndTimeAfter) + ", " + "class_instances.min_students = " + addQuotes(req.body.min_students)
         + ", " + "class_instances.max_students = " + addQuotes(req.body.max_students) + " WHERE id=" + req.body.id;
        
        console.log(query);
        try
        {
            connection.query(query, function(err, result){
                console.log(err, result);
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    
    addLocation: function(req, res)
    {
        let query;
        try
        {
            query = insertQuery("locations", req.body);
            connection.query(query, function(err, result){
                if(err)
                    res.json(err);
                else
                    res.json(result); //res goes to the frontend directly
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    addDescriptions: function(req, res){
        var subQuery = "(SELECT id FROM categories WHERE category_name='"+ req.body.class_category +"' LIMIT 1)";
        connection.query(subQuery, function(err, result){
            var queryObj = {class_name: req.body.class_name, categories_id: ""+result[0].id, class_description: req.body.class_description};
            let query;
            try
            {
                query = insertQuery("class_descriptions", queryObj);
                connection.query(query, function(err, result){
                    if(err)
                        res.json(err);
                    else{
                        res.json(result); 
                    }
                });
            }
            catch (e)
            {
                queryException(e, query);
                res.json([]);
            }
        })
    },
    getCategories: function(req, res)
    {
        try
        {
            connection.query("SELECT * FROM categories", function(err, rows, fields){
                if(err)
                    res.json(err);
                else
                    res.json(rows);
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },

    getOneStudent: function(req, res)
    {
        console.log(req.body);
        try
        {
            connection.query("SELECT * FROM classes_has_students JOIN students ON students.id = classes_has_students.student_id", function(err, rows, fields){
                if(err)
                    res.json(err);
                else
                    res.json(rows, "getOneStudent from BE model");
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
    getClassDescriptions: function(req, res)
    {
        try
        {
            connection.query("SELECT class_descriptions.id, class_descriptions.class_name, class_descriptions.class_description, categories.category_name FROM class_descriptions JOIN categories ON categories.id = class_descriptions.categories_id", function(err, rows, fields){
                if(err)
                    res.json(err);
                else
                {
                    res.json(rows);
                }
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },
getClassInstances: function(req, res)
    {
        try
        {            
            var insert_query = "SELECT class_instances.id as Class_Instances_ID, class_instances.start_date, class_instances.end_date, class_instances.max_students, class_instances.min_students, class_descriptions.class_name,locations.location_name FROM class_instances INNER JOIN class_descriptions ON class_descriptions.id = class_instances.class_descriptions_id INNER JOIN locations ON class_instances.locations_id = locations.id";
            connection.query(insert_query, function(err, rows, fields){
                if(err)
                    res.json(err);
                else{
                    // console.log(forInLoop(rows));
                    
                    for(let item of rows)
                    {
                        for(let key in item)
                        {
                            if(key === "start_date" || key === "end_date")
                            {
                                item[key] = item[key].toString();
                            }
                        }
                    }
                    //has to be last
                    res.json(rows);
                }
            });
        }
        catch (e)
        {
            queryException(e, query);
            res.json([]);
        }
    },


	getLocations: function(req, res)
	{
		try
		{
			connection.query("SELECT * FROM locations", function(err, rows, fields){
				if(err)
					res.json(err);
				else
					res.json(rows);
			});
		}
		catch (e)
		{
			queryException(e, query);
			res.json([]);
		}
	},


	getStudentsForClass: function(req, res)
	{
        let id = req.params.id;
		try
		{
			connection.query("SELECT * FROM classes_has_students JOIN students ON students.id = classes_has_students.student_id WHERE class_instance_id = " + id, function(err, rows, fields){
				if(err)
					res.json(err);
				else
					res.json(rows);
			});
		}
		catch (e)
		{
			queryException(e, query);
			res.json([]);
		}
	}
}

// HELPER FUNCTIONS BELOW

function addQuotes(strArr)
{
    if(typeof strArr != "object")
        strArr = [strArr];
    strArr.forEach(function(element, index, array) {
        let temp = "'";
        if(element !== undefined)
        {
            let current = "" + element;
            for(ch of current)
            {
                if(ch !== "'")
                    temp += ch;
                else
                    temp += "''";
            }
        }
        temp += "'";
        strArr[index] = temp;
    });
    return strArr;
}

//returns a string to pass to the DB as an insert query
function forInLoop(object){
	for (var key in object){
		console.log(key + "=" + object[key]);
	}
};


function insertQuery(tableName, queryobj)
{
	let columns = " (" + Object.keys(queryobj).join(", ") + ")";
	let values = " VALUES (" + addQuotes(getObjValues(queryobj)).join(", ") + ")";
	let query = "INSERT INTO " + tableName + columns + values;
	return query;
};

function queryException(exception, query)
{
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	console.log("Database error:", exception);
    console.log("-----");
    console.log("-----");
	console.log("Query involved:", query);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    res.status(500).send("DB error:", exception);
};

function getObjValues(obj)
{
	let vals = [];
	for(key in obj)
	{
		vals.push(obj[key]);
	}
	return vals;
};

function dateTimeAdjustHours(dateStr, hourAdjustment)
{
	let hour = (Number.parseInt(dateStr.slice(11, 13)) + hourAdjustment)%24;
	let result = dateStr.slice(0, 11) + hour + dateStr.slice(13);
	return result;
};