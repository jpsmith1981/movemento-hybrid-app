angular.module('starter.directives', [])


.directive('venmo', function(){
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'templates/componets/venmo.html',
        controller: function($scope, $element){
            console.log('Loaded');
            $scope.clicked = 0;
            $scope.venmo = function(){
                console.log('venmo');

                $scope.$emit('go');
            }
        }
    }
})


.directive('myCustomer', function() {
    return {
        template: '<h1>Here</h1>'
    };
});