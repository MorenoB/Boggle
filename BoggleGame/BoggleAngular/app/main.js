(function () {
    'use strict';

    angular
        .module('app')
        .controller('Main', main);

    main.$inject = ['$scope', '$compile'];

    function main($scope, $compile) {
        /* jshint validthis:true */
        var vm = this;
        vm.boggleWord = 'test';

        activate();

        function initBoard()
        {
            var columns = 4;
            var rows = 4;
            var rowElement = document.getElementById('row');
            var boggleAreaElement = document.getElementById('boggleBoxArea');

            for (var j = 0; j < rows; j++) {

                var rowObject = angular.element('<li id="row"></li>');

                for (var i = 0; i < columns; i++) {
                    var btnhtml = '<button type="button" ng-click="addButton()">Letter</button>';
                    var temp = $compile(btnhtml)($scope);
                    angular.element(rowObject).append(temp);
                }

                angular.element(boggleAreaElement).append(rowObject);

                
            }


        }

        function activate()
        {
            initBoard();
        }
    }
})();
