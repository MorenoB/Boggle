(function () {
    var app = angular.module('boggle', []);

    //Add words function
    app.factory('wordsSvc', function () {
        return {
            words: [],
            addWord: function (word) {

                if (_.includes(this.words, word)) {
                    console.log("Already contains word " + word);
                    return;
                }
                this.words.push(word);
            }
        };
    });

    //Scrambling and generating of letter buttons.
    app.factory('boardSvc', function () {

        var dice = [

      ['R', 'I', 'F', 'O', 'B', 'X'],

      ['I', 'F', 'E', 'H', 'E', 'Y'],

      ['D', 'E', 'N', 'O', 'W', 'S'],

      ['U', 'T', 'O', 'K', 'N', 'D'],

      ['H', 'M', 'S', 'R', 'A', 'O'],

      ['L', 'U', 'P', 'E', 'T', 'S'],

      ['A', 'C', 'I', 'T', 'O', 'A'],

      ['Y', 'L', 'G', 'K', 'U', 'E'],

      ['Q', 'B', 'M', 'J', 'O', 'A'],

      ['E', 'H', 'I', 'S', 'P', 'N'],

      ['V', 'E', 'T', 'I', 'G', 'N'],

      ['B', 'A', 'L', 'I', 'Y', 'T'],

      ['E', 'Z', 'A', 'V', 'N', 'D'],

      ['R', 'A', 'L', 'E', 'S', 'C'],

      ['U', 'W', 'I', 'L', 'R', 'G'],

      ['P', 'A', 'C', 'E', 'M', 'D']];

      
        //Scramble/shuffle the dice
        svc = {
            rows: [['A', 'B', 'C', 'D'],
                   ['E', 'F', 'G', 'H'],
                   ['I', 'J', 'K', 'L'],
                   ['M', 'N', 'O', 'P']],
            scramble: function () {
                var shuffledDice = _.slice(_.shuffle(dice), 0, 4);
                var i, j;
                var rows = this.rows;
                for (i = 0; i < rows.length; i++) {
                    for (j = 0; j < rows[i].length; j++) {
                        rows[i][j] = shuffledDice[i][j];
                    }
                }
            }
        };
        svc.scramble();
        return svc;
    })

    //Timer handling
    app.factory('timerSvc', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            maxTime: 180,
            timeRemaining: 0,
            startTimer: function () {
                var timer = this;
                var updateInterval = 250; /* ms */

                timer.timeStartedMillis = Date.now();
                timer.timeRemaining = timer.maxTime;
                $rootScope.$broadcast('timer:update', timer);

                function updateTimer() {
                    var timeElapsed = (Date.now() - timer.timeStartedMillis) / 1000;

                    timer.timeRemaining = Math.max(0, timer.maxTime - timeElapsed);
                    $rootScope.$broadcast('timer:update', timer);

                    if (timer.timeRemaining > 0) {
                        $timeout(updateTimer, updateInterval);
                    }
                } // updateTimer()
                $timeout(updateTimer, updateInterval);
            } // startTimer()
        };
    }]);

    app.controller('GameCtrl', ['boardSvc', 'timerSvc', '$scope', function (boardSvc, timerSvc, $scope) {
        var gameCtrl = this;
        this.inProgress = false;

        //Start game function
        this.startGame = function () {
            gameCtrl.inProgress = true;
            boardSvc.scramble();
            timerSvc.startTimer();
        };

        //Timer update function.
        $scope.$on("timer:update", function () {
            if (timerSvc.timeRemaining == 0) {
                gameCtrl.inProgress = false;
            }
        });
    }]);

    //Words container for the words panel.
    app.controller('WordsPanelCtrl', ['wordsSvc', function (wordsSvc) {
        this.words = wordsSvc.words;
    }]);

    //Timer container for the timer that is shown to the user.
    app.controller('TimerCtrl', ['timerSvc', '$scope', function (timerSvc, $scope) {
        this.percentRemaining = 0;

        var timerCtrl = this;
        $scope.$on('timer:update', function () {
            timerCtrl.percentRemaining = 100 * timerSvc.timeRemaining / timerSvc.maxTime;
        });
    }]);

    //Validation checks for the board controller.
    app.controller('BoardCtrl', ['wordsSvc', 'boardSvc', function (wordsSvc, boardSvc) {
        this.rows = boardSvc.rows;

        //Click cell funciton
        this.clickCell = function (rowIx, colIx) {
            if (this.isValidClick(rowIx, colIx)) {
                this.currentWord += this.rows[rowIx][colIx];
                this.clicked[rowIx][colIx] = true;
                this.lastClicked = { row: rowIx, col: colIx };
            }
            else
            {
                this.clear();
            }
        };

        //Check in our multi dimensional array if this cell is clicked.
        this.isClicked = function (rowIx, colIx) {
            return this.clicked[rowIx][colIx];
        };

        //Check if this cell is clicked the last time
        this.isLastClicked = function (rowIx, colIx) {
            return rowIx == this.lastClicked.row && colIx == this.lastClicked.col;
        };

        //General cell validity check
        this.isValidClick = function (rowIx, colIx) {
            return !this.isClicked(rowIx) &&
                  (this.lastClicked.row < 0 || Math.abs(rowIx - this.lastClicked.row) <= 1) &&
                  (this.lastClicked.col < 0 || Math.abs(colIx - this.lastClicked.col) <= 1)
        }

        // Will check if given word is considered valid.
        this.isValidWord = function (word) {

            //Dont allow words with letter count lesser than three since there will be no points given.
            if(word.length < 3)
                return false;
            // TODO : Check for word in dictionairy.


            return true;
        }

        //Will return points for a given word. 
        this.calculatePoints = function (wordToAnalyze) {
            var amountOfPoints = 0;

            switch (wordToAnalyze.length) {
                case 3:
                case 4:
                    amountOfPoints = 1;
                    break;

                case 5:
                    amountOfPoints = 2;
                    break;

                case 6:
                    amountOfPoints = 3;
                    break;

                case 7:
                    amountOfPoints = 5;
                    break;

                default:
                    amountOfPoints = 11;
                    break;
            }

            return amountOfPoints;
        }

        //Will call the addword function will clear up the selections.
        this.addWord = function () {
            if (this.isValidWord(this.currentWord)) {
                wordsSvc.addWord(this.currentWord);
            }
            this.clear();
        };
        this.clear = function () {
            this.lastClicked = { row: -1, col: -1 };
            this.currentWord = '';
            this.clicked = [
              [false, false, false, false],
              [false, false, false, false],
              [false, false, false, false],
              [false, false, false, false]
            ];
        };
        this.clear();
    }]);
})()
