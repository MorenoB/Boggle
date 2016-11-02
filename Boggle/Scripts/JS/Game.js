var canSelectButtons = false;
var wordsArray;

var wordListDOM = $("#wordList");

function init() {

    initializePopups();

    initializeWords();

    initializeBoard();

    initializeDefaults();

}

function onButtonClicked(buttonObj) {

    if (!canSelectButtons)
        return;

    var id = buttonObj.data("id");
    var text = buttonObj.data("text");
    var isSelected = buttonObj.data("isSelected");

    if (isSelected) {
        console.log("Button " + text + " is already selected");
        return;
    }

    //Button will be selected.
    buttonObj.data("isSelected", true);

    buttonObj.removeClass("blue");
    buttonObj.addClass("red");

    //Update visual word & store the letter.
    updateWordHeader(text);

    console.log(id + " has letter " + text);
}

function initializeWords()
{
    $.ajax({
        url: "words.txt",
        dataType: "text",
        success: function (data) {

            var splittedData = data.split('\n');

            wordsArray = splittedData;
        }
    });
}

function restartGame()
{
    $("#wordList").empty();


    initializeBoard();
}

function updateWordHeader(addedLetter) {
    var wordHeader = $("#wordDisplay");
    var curWord = wordHeader.data("wordData");
    var newWord = curWord + addedLetter;
    wordHeader.data("wordData", newWord);

    if (newWord.length < 1)
        newWord = "Boggle";

    wordHeader.text(newWord);
}

function resetButtons() {
    var objects = $(".btn-floating.btn-large.waves-effect.waves-light");

    objects.each(function () {
        var buttonObj = $(this);
        var isSelected = buttonObj.data("isSelected");

        if (isSelected) {
            buttonObj.removeClass("red");
            buttonObj.addClass("blue");
            buttonObj.data("isSelected", false);
        }
    });

    $("#wordDisplay").data("wordData", "");
    updateWordHeader("");

    canSelectButtons = false;
}


function initializeBoard() {
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

    var shuffledDice = _.slice(_.shuffle(dice), 0, 4);
    var rows = 4;
    var columns = 4;
    var buttonIndex = 0;

    $("#boggleArea").empty();

    for (var i = 0; i < rows; i++) {

        var $row = $("<div />", {
            class: 'col',
            id: 'buttonRow'
        });

        var diceRow = shuffledDice[i];
        for (var j = 0; j < columns; j++) {
            var buttonText = diceRow[j];
            var $button = $("<div />", {
                class: 'btn-floating btn-large waves-effect waves-light blue',
                id: 'letterButton',
                text: "" + buttonText
            });


            $button.data("id", buttonIndex);
            $button.data("text", buttonText);
            $button.data("isActivated", false);

            $row.append($button);

            buttonIndex++;
        }

        $("#boggleArea").append($row);

        
    }

    $("#boggleArea").on('mouseover', '#letterButton', function () {

        var obj = $(this);
        onButtonClicked(obj);
    });

    $("#boggleArea").on('click', '#letterButton', function () {

        if (canSelectButtons)
        {
            var currentWord = $("#wordDisplay").data("wordData").toLowerCase();

            if (isValidWord(currentWord))
                addPointsForWord(currentWord);

            resetButtons();
            return;
        }


        canSelectButtons = true;

        var obj = $(this);
        onButtonClicked(obj);

    });

}

function initializePopups()
{
    $('#welcomePopup').openModal();

    $('#startButton').click(function() {
        startTimerUpdate();
    });

    $('#restartButton').click(function () {
        initializeBoard();
        startTimerUpdate();
    });
}

function isValidWord(wordToValidate)
{
    console.log("Checking for word " + wordToValidate);
    var savedWordsArray = wordListDOM.data("savedWords");

    //Only allow words > 3
    if (wordToValidate.length < 3)
        return false;

    if ($.inArray(wordToValidate, savedWordsArray) > -1)
    {
        var nicerWord = wordToValidate.toUpperCase();
        Materialize.toast("'" + nicerWord + "' is already used!", 3000, 'rounded');
        return false;
    }

    if ($.inArray(wordToValidate, wordsArray) > -1)
        return true;

    return false;    
}

function addPointsForWord(wordToAnalyze)
{
    var amountOfPoints = 0;

    switch (wordToAnalyze.length)
    {
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

    var wordToShow = wordToAnalyze.toUpperCase() + " (" + amountOfPoints + ")";

    //Add the word to the DOM word list

    var appendedWord = '<a href="#" class="collection-item">' + wordToShow + '</a>';

    wordListDOM.append(appendedWord);

    //Save the word in the 'savedWords' data object inside the wordlist DOM object.

    var wordListDataArray = wordListDOM.data("savedWords");

    wordListDataArray.push(wordToAnalyze);

    wordListDOM.data("savedWords", wordListDataArray);

    //Display a popup for the user.

    var suffix = amountOfPoints == 1 ? "point" : "points";

    Materialize.toast("'" + wordToAnalyze + "' awarded " + amountOfPoints + " " + suffix + "!", 3000, 'rounded');
}

function setProgressbarValue(newValue)
{
    $("#progressbar").progressbar({
        value: newValue
    });
}

function timeIsUp()
{
    $('#timeLeft').text("Done!");

    $('#matchComplete').openModal();
}

function startTimerUpdate()
{
    var start = new Date;
    var totalSeconds = 180;

    var timerInterval = setInterval(function () {
        var secondsPassed = (new Date - start) / 1000;            

        var percentage = (100 * secondsPassed) / totalSeconds;

        if (secondsPassed > totalSeconds) {
            timeIsUp();

            clearInterval(timerInterval);

            return;
        }

        setProgressbarValue(percentage);

        var secondsLeft = Math.round(totalSeconds - secondsPassed);

        if (secondsLeft == 0) return;

        var suffix = secondsLeft < 2 ? "second" : "seconds";

        $('#timeLeft').text("Only " + secondsLeft + " " + suffix + " left!");
    }, 250);
}

function initializeDefaults() {
    $("#wordDisplay").data("wordData", "");

    wordListDOM.data("savedWords", []);

    setProgressbarValue(0);
}


init();