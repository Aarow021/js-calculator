window.addEventListener('DOMContentLoaded', () => {

    //Rounds a number to a given number of decimal places
    function round(num, place) {
        place = Math.max(place, 1);
        return Math.round(num * 10**place) / 10**place || num;
    }

    //Hides all direct children of page wrapper except for the next 'page'
    function goToPage(name) {
        let pageChildren = document.querySelectorAll('.page-wrapper > *');
        for (child of pageChildren) {
            child.classList.add('hidden');
        }
        document.getElementById(name).classList.remove('hidden');
    }

    //Shortcut for changing 'page' to menu
    let toMenu = () => {goToPage('calc-choice-container')}

    //Calculates 2 numbers with a given operation
    function calc(a, b, operator) {
        if (operator === '+') return a + b;
        if (operator === '-') return a - b;
        if (operator === '*') return a * b;
        if (operator === '/') return a / b;
    }
    
    //Runs the basic calculator (prompt based)
    function basicCalc() {
        let firstNum = NaN,
            operator = '',
            secondNum = NaN;
            
        //Makes sure the input is a number
        while (Number.isNaN(firstNum)) {
            let input = prompt('Please enter the first number')
            if (input === null) {toMenu(); return;}
            firstNum = parseFloat(input);
        }

        //Makes sure the input is a valid operator
        while (!['+', '-', '*', '/'].includes(operator)) {
            let input = prompt('Please enter the operation (+, -, *, /)');
            if (input === null) {toMenu(); return;}
            operator = input
        }

        //Makes sure the input is a number
        while (Number.isNaN(secondNum)) {
            let input = prompt('Please enter the second number')
            if (input === null) {toMenu(); return;}
            secondNum = parseFloat(input);
        }

        //Calculates the numbers using chosen operator
        let outcome = calc(firstNum, secondNum, operator);

        //Puts the rounded result onto the page
        let outputElem = document.getElementById('basic-output');
        outputElem.textContent = round(outcome, 8);
    }


    //Makes choose basic button work when clicked
    let choiceBasic = document.getElementById('choice-basic');
    choiceBasic.addEventListener('click', () => {
        goToPage('basic-calc-container');
        basicCalc();
    })

    //makes all menu buttons go to menu when clicked
    let menuButtons = document.querySelectorAll('button.menu');
    for (let elem of menuButtons) {
        elem.addEventListener('click', toMenu);
    }

})