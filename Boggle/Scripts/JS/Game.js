function init() {
    var that = this;
    initializeBoard();
}

function onButtonClicked(buttonObj) {
    var id = buttonObj.data("id");
    var text = buttonObj.data("text");
    var isSelected = buttonObj.data("isSelected");

    if (isSelected) {
        console.log("Button " + text + " is already selected");
        resetButtons();
        return;
    }

    buttonObj.data("isSelected", true);

    buttonObj.removeClass("blue");
    buttonObj.addClass("red");

    console.log(id + " has letter " + text);
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
            class: 'col s6'
        });

        var diceRow = shuffledDice[i];
        for (var j = 0; j < columns; j++) {
            var buttonText = diceRow[j];
            var $button = $("<div />", {
                class: 'btn-floating btn-large waves-effect waves-light blue',
                text: "" + buttonText
            });


            $button.data("id", buttonIndex);
            $button.data("text", buttonText);
            $button.data("isActivated", false);

            $row.append($button);

            //console.log($button);

            buttonIndex++;
        }

        $("#boggleArea").append($row);
    }

    $(".col.s6").on('mouseover', 'div', function () {

        var obj = $(this);
        onButtonClicked(obj);
    });

    $(".col.s6").on('click', 'div', function () {

        var obj = $(this);
        onButtonClicked(obj);
    });

}


init();