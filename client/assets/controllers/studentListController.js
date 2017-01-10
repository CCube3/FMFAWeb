app.controller("studentListController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http){
    // $scope.rparam = $routeParams;
    $http.get("/get_students_for_class/" + $routeParams.id).then(function(res){
        $scope.student_list = res.data;
        console.log("students:", res.data);
    });
}]);