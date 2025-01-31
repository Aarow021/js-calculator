window.addEventListener('DOMContentLoaded', () => {

    let currentOperator = '+';
    let displayValue = '';    //Current value being displayed on screen
    let currentValue = 0;     //Current value of the calculation
    let lastAction = '';      //Records the last calculator button pressed
    
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
        if (operator === 'sqrt') return a ** (1 / b);
    }

    //Refreshes the calculator display with current values
    function updateDisplay(value=displayValue) {
        let prefix = ' ';
        let roundedVal = value.substring(0, 15)
        if (value.substring(0, 1) === '-') {
            prefix = '-';
            roundedVal = roundedVal.substring(1);
        }
        document.getElementById('advanced-output').textContent = prefix + roundedVal;
    }

    function resetCalc() {
        displayValue = '0';
        currentOperator = '+';
        currentValue = 0;
        updateDisplay();
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

    //Adds a number to the calculator display
    function displayAdd(number) {
        if (displayValue.length < 15) {
            displayValue += number;
            updateDisplay();
        }
    }

    //Calculates display value and current value
    function advancedCalc(a=currentValue, b=Number(displayValue), operator=currentOperator) {
        return calc(a, b, operator);
    }

    //Handles what happens when a calculator button is pressed
    function buttonHandler(button) {
        let value = button.value;
        if (Number(value) == value) { //Number buttons
            if (displayValue === '0' && value != '0') {
                displayValue = '';
            }
            displayAdd(value);
        } else if (value === 'c') { //Clears display
            displayValue = '0';
            updateDisplay();
        } else if (value === 'ce') { //Clears display and stored values
            resetCalc();
        } else if (value === '.') { //Decimal button
            if (!displayValue.includes('.')) {displayAdd(value)};
        } else if (['+', '-', '*', '/'].includes(value)) { //Operation buttons
            if (lastAction === value || Number(lastAction) == lastAction) {
                let newValue = advancedCalc();
                currentValue = newValue;
                displayValue = '0';
                updateDisplay(currentValue.toString());
            }
            currentOperator = value;
        } else if (value === '+-') {
            if (displayValue.includes('-')) {
                displayValue = displayValue.substring(1);
            } else {
                displayValue = '-' + displayValue;
            }
            updateDisplay();
        } else if (value === '=') {
            let newValue = advancedCalc();
            currentValue = newValue;
            displayValue = '0';
            updateDisplay(currentValue.toString());
        }

        lastAction = value; //Records the current action for use on next button press
    }

    //Adds onClick event to the calculator buttons
    function initAdvancedCalc() {
        let buttons = document.querySelectorAll('#calculator .buttons button');
        for (let button of buttons) {
            button.addEventListener('click', (e) => {
                buttonHandler(e.target);
            })
        }
    }

    //Makes choose basic button work when clicked
    let choiceBasic = document.getElementById('choice-basic');
    choiceBasic.addEventListener('click', () => {
        goToPage('basic-calc-container');
        basicCalc();
    })

    //Sets up advanced calculator settings
    initAdvancedCalc();

    //Goes to advanced calculator and resets it
    let choiceAdvanced = document.getElementById('choice-advanced');
    choiceAdvanced.addEventListener('click', () => {
        resetCalc();
        goToPage('advanced-calc-container');
    })

    //makes all menu buttons go to menu when clicked
    let menuButtons = document.querySelectorAll('button.menu');
    for (let elem of menuButtons) {
        elem.addEventListener('click', toMenu);
    }

})