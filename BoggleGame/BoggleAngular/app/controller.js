(function () {
    'use strict';

    angular
        .module('app')
        .controller('controller', controller);

    controller.$inject = ['$scope', '$compile'];

    function controller($scope, $compile) {
        $scope.title = 'controller';

        $scope.name = 'World';

        $scope.addButton = function () {
            alert("button clicked");
            var btnhtml = '<button type="button" ng-click="addButton()">Click Me</button>';
            var temp = $compile(btnhtml)($scope);
            angular.element(document.getElementById('foo')).append(temp);
        };
        

        activate();

        function activate() { }
    }
})();
