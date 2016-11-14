var canSelectButtons = false;

var wordListDOM = $("#wordList");
var pointsDOM = $("#points");
var boggleAreaDOM = $("#boggleArea");
var wordHeaderDOM = $("#wordDisplay");

var lastSelectedButtonId = -1;

function init() {

    initializePopups();

    getAndPopulateBoardData();

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

    if (!selectedButtonIsInRange(id)) {
        console.log("Button " + text + " is not in range. Id : " + id + " lastselected id : " + lastSelectedButtonId);
        return;
    }

    lastSelectedButtonId = id;

    //Button will be selected.
    buttonObj.data("isSelected", true);

    buttonObj.removeClass("blue");
    buttonObj.addClass("red");

    //Update visual word & store the letter.
    updateWordHeader(text);

    //console.log(id + " has letter " + text);
}

function getAndPopulateBoardData()
{

    //Retrieving boggle box data.
    $.ajax({
        url: "http://localhost:52213/api/boggle/getBoggleBox",
        type: 'GET',
        contentType: "application/json",
        dataType: 'jsonp'
    }).done(function (data, textStatus, jqXHR) {
        var boardData = data;
        initializeBoard(boardData);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Error: " + textStatus + "\t" + errorThrown.toString());
    });


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

function restartGame() {
    resetButtons();

    boggleAreaDOM.off();

    wordListDOM.empty();

    connectToWebService();

    initializeDefaults();
}

function updateWordHeader(addedLetter) {
    
    var curWord = wordHeaderDOM.data("wordData");
    var newWord = curWord + addedLetter;
    wordHeaderDOM.data("wordData", newWord);

    if (newWord.length < 1)
        newWord = "Boggle";

    wordHeaderDOM.text(newWord);
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

    wordHeaderDOM.data("wordData", "");
    updateWordHeader("");

    canSelectButtons = false;


    lastSelectedButtonId = -1;
}


function initializeBoard(boardData) {

    var dice = boardData.dies;
    var rows = 4;
    var columns = 4;
    var buttonIndex = 0;

    boggleAreaDOM.empty();

    boggleAreaDOM.data("boardID", boardData.boggleBoxID);

    for (var i = 0; i < rows; i++) {

        var $row = $("<div />", {
            class: 'col',
            id: 'buttonRow'
        });

        var diceRow = dice[i];
        for (var j = 0; j < columns; j++) {
            var buttonText = diceRow[j].value;
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

        boggleAreaDOM.append($row);


    }

    boggleAreaDOM.on('mouseover', '#letterButton', function () {

        var obj = $(this);
        onButtonClicked(obj);
    });

    boggleAreaDOM.on('click', '#letterButton', function () {

        if (canSelectButtons) {
            var currentWord = wordHeaderDOM.data("wordData").toLowerCase();

            checkForValidWord(currentWord);

            resetButtons();
            return;
        }


        canSelectButtons = true;

        var obj = $(this);
        onButtonClicked(obj);

    });

}

function initializePopups() {
    $('#welcomePopup').openModal();

    $('#startButton').click(function () {
        startTimerUpdate();
    });

    $('#restartButton').click(function () {
        restartGame();
        startTimerUpdate();
    });
}

function checkForValidWord(wordToValidate) {
    console.log("Checking for word " + wordToValidate);

    var boardID = boggleAreaDOM.data("boardID");

    $.ajax({
        url: "http://localhost:52213/api/boggle/isValidWord",
        type: 'POST',
        dataType: "jsonp",
        data: { boggleBoxId: boardID, word: wordToValidate }
    }).done(function (data) {
        if(data === true)
            addPointsForWord(wordToValidate);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Error: " + textStatus + "\t" + errorThrown.toString());
    });
}

function addPointsForWord(wordToAnalyze) {
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

    var wordToShow = wordToAnalyze.toUpperCase() + " (" + amountOfPoints + ")";

    //Add the word to the DOM word list

    var appendedWord = '<a href="#" class="collection-item">' + wordToShow + '</a>';

    wordListDOM.append(appendedWord);

    //Save the word in the 'savedWords' data object inside the wordlist DOM object.

    var wordListDataArray = wordListDOM.data("savedWords");

    wordListDataArray.push(wordToAnalyze);

    wordListDOM.data("savedWords", wordListDataArray);

    //Handle the total points counter.

    var newPoints = pointsDOM.data("totalPoints");

    newPoints++;

    pointsDOM.text("Points : " + newPoints);

    pointsDOM.data("totalPoints", newPoints);

    //Display a popup for the user.

    var suffix = amountOfPoints === 1 ? "point" : "points";

    Materialize.toast("'" + wordToAnalyze + "' awarded " + amountOfPoints + " " + suffix + "!", 3000, 'rounded');
}

function setProgressbarValue(newValue) {
    $("#progressbar").progressbar({
        value: newValue
    });
}

function timeIsUp() {
    $('#timeLeft').text("Done!");

    $('#yourPoints').text("Your points : " + pointsDOM.data("totalPoints"));

    $('#matchComplete').openModal();
}

function startTimerUpdate() {
    var start = new Date;
    var totalSeconds = 180;
    var timeLeftDOM = $('#timeLeft');

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

        if (secondsLeft === 0) return;

        var suffix = secondsLeft < 2 ? "second" : "seconds";

        timeLeftDOM.text("Only " + secondsLeft + " " + suffix + " left!");
    }, 250);
}

function initializeDefaults() {
    wordHeaderDOM.data("wordData", "");

    wordListDOM.data("savedWords", []);

    pointsDOM.data("totalPoints", 0);

    pointsDOM.text("Points : 0");

    setProgressbarValue(0);
}


init();