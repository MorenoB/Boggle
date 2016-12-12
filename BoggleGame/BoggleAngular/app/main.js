(function () {
    'use strict';

    angular
        .module('app')
        .controller('Main', main);

    main.$inject = ['$scope', '$compile'];

    function main($scope, $compile) {
        /* jshint validthis:true */
        var vm = this;
        var debugIsEnabled = true;
        var lastSelectedButtonId = -1;

        vm.boggleWord = '';


        activate();

        function initBoard()
        {
            var columns = 4;
            var rows = 4;
            var rowElement = document.getElementById('row');
            var boggleAreaElement = document.getElementById('boggleBoxArea');
            var id = 0;

            var dice = [['R', 'I', 'F', 'O', 'B', 'X'],['I', 'F', 'E', 'H', 'E', 'Y'],['D', 'E', 'N', 'O', 'W', 'S'],['U', 'T', 'O', 'K', 'N', 'D'],['H', 'M', 'S', 'R', 'A', 'O'],['L', 'U', 'P', 'E', 'T', 'S'],['A', 'C', 'I', 'T', 'O', 'A'],['Y', 'L', 'G', 'K', 'U', 'E'],['Q', 'B', 'M', 'J', 'O', 'A'],['E', 'H', 'I', 'S', 'P', 'N'],['V', 'E', 'T', 'I', 'G', 'N'],['B', 'A', 'L', 'I', 'Y', 'T'],['E', 'Z', 'A', 'V', 'N', 'D'],['R', 'A', 'L', 'E', 'S', 'C'],['U', 'W', 'I', 'L', 'R', 'G'],['P', 'A', 'C', 'E', 'M', 'D']];
            var shuffledDice = _.slice(_.shuffle(dice), 0, 4);

            for (var j = 0; j < rows; j++) {

                var rowObject = angular.element('<li id="row"></li>');
                var diceRow = shuffledDice[j];

                for (var i = 0; i < columns; i++) {
                    id++;
                    var btnhtml = '<button class="letterButton" type="button" ng-click="onSelectButton($event)">Letter</button>';
                    var temp = $compile(btnhtml)($scope);

                    temp.data("Id", id);

                    temp.data("Letter", diceRow[i]);
                    temp.text(diceRow[i]);

                    angular.element(rowObject).append(temp);
                }

                angular.element(boggleAreaElement).append(rowObject);

                
            }


        }

        $scope.onSelectButton = function ($event) {
            var element = angular.element($event.currentTarget);
            var id = element.data("Id");
            var letter = element.data("Letter");
            var isSelected = element.data("IsSelected");

            if(isSelected)
            {
                log("Already selected letter " + letter + " ( id = " + id + " )")
                return;
            }

            if (!selectedButtonIsInRange(id))
            {
                log("Button is out of range. " + letter + " ( id = " + id + " )");
                return;
            }


            lastSelectedButtonId = id;

            element.data("IsSelected", true);
            log("Selected letter " + letter + " ( id = " + id + " )");
            



            vm.boggleWord += letter;
        };

        function resetLetters()
        {
           /* var buttonDOMElements = document.getElementsByClassName("letterButton");

            for (var DOMElement in buttonDOMElements) {
                var angularButtonElement = angular.element(DOMElement);
                angularButtonElement.data("IsSelected", false);
            }*/
        }

        function selectedButtonIsInRange(selectedButtonId) {
            if (selectedButtonId === lastSelectedButtonId || lastSelectedButtonId === -1)
                return true;

            //Left
            if (selectedButtonId === lastSelectedButtonId - 1)
                return true;
            //Right
            if (selectedButtonId === lastSelectedButtonId + 1)
                return true;
            //Up
            if (selectedButtonId === lastSelectedButtonId - 4)
                return true;
            //Down
            if (selectedButtonId === lastSelectedButtonId + 4)
                return true;

            //Diagonal bottom right
            if (selectedButtonId === lastSelectedButtonId + 5)
                return true;

            //Diagonal Upper left
            if (selectedButtonId === lastSelectedButtonId - 5)
                return true;

            //Diagonal bottom left
            if (selectedButtonId === lastSelectedButtonId + 3)
                return true;

            //Diagonal Upper right
            if (selectedButtonId === lastSelectedButtonId - 3)
                return true;

            return false;
        }

        function log(loggingData)
        {
            if (!debugIsEnabled)
                return;

            console.log(loggingData);
        }

        function activate()
        {
            initBoard();
        }
    }
})();
