var canSelectButtons = false;
var wordsArray;

function init() {
    var that = this;

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
        resetButtons();
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
            console.log(splittedData);

            wordsArray = splittedData;
        }
    });
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

function isValidWord(wordToValidate)
{
    console.log("Checking for word " + wordToValidate);

    //Only allow words > 3
    if (wordToValidate.length < 3)
        return false;

    if ($.inArray(wordToValidate, wordsArray) > -1)
        return true;

    return false;    
}

function addPointsForWord(wordToAnalyze)
{
    Materialize.toast("'" + wordToAnalyze + "' correct!", 3000, 'rounded');

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

    var appendedWord = '<a href="#" class="collection-item">' + wordToShow + '</a>';

    $("#wordList").append(appendedWord);
}

function initializeDefaults() {
    $("#wordDisplay").data("wordData", "");
}


init();