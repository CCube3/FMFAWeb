var app = angular.module("myApp", ["ngRoute"]);
 // make a facotry to show the courses from the data bae 
 // students to sign up 


// routes
app.config(function($routeProvider){
   $routeProvider
   
      .when("/course", {
         templateUrl: "/partials/course.html"
      })
      .when("/signup/:id", {
         templateUrl: "/partials/signup.html"
      })
      .otherwise({
         redirectTo:"/course"
      });
})
 //*****Sign up factory *****
 app.factory("signFactory",["$http",  function($http){
  var factory = {};
   factory.add = function (data){
    $http.post("/student_sign_up", data).then(function(res){

    })};
     return factory;

 }])
 //*****calendarFactory*****

app.factory("calendarFactory",["$http", function($http){
  var factory = {};

  factory.reload = function(){
    for(let table of ["categories", "class_descriptions", "class_instances", "locations"])
    {
      $http.get("/"+table).then(function(res){
        console.log(res.data);
        factory.scopeRef[table] = res.data;
      });
    }

    factory.getCalendar = function()
    {
      $http.get("/calendar_data").then(function(res){
        console.log(res.data);
        factory.scopeRef.calendarData = res.data;
      });
    }
  }

  return factory;
}]);

  //***** Signup controller *****
app.controller("signupController",['$scope', 'signFactory', function($scope, signFactory){
// sign up button needs to call the function in the controller
   $scope.newStudent = function(){
      var data = {first_name: $scope.firstname, last_name: $scope.lastname, email: $scope.email, phone: $scope.phone};
      signFactory.add(data);
      console.log("data:", data);
   }
}])
 
 //***** Calendar Controller *****
app.controller("CalendarController",['$scope', 'calendarFactory', function($scope, calendarFactory){
  if($scope.init === undefined)
  {
    $scope.init = true;
    calendarFactory.scopeRef = $scope;
    $scope.categories = [];
    $scope.class_descriptions = [];
    $scope.locations = [];
    $scope.class_instances = [];

    calendarFactory.getCalendar();
  }
}])



