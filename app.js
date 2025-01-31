window.addEventListener('DOMContentLoaded', () => {

    let currentOperator = ' ';
    let displayValue = '';    //Current value being displayed on screen
    let currentValue = 0;     //Current value of the calculation
    let lastAction = '';      //Records the last calculator button pressed
    let pendingValue = 0;
    
    //Rounds a number to a given number of decimal places
    function round(num, place) {
        place = Math.max(place, 1);
        return Math.round(num * 10**place) / 10**place || num;
    }

    //Hides all direct children of page wrapper except for the next 'page'
    function goToPage(name) {
        let pageChildren = document.querySelectorAll('.page-wrapper > *');
        for (child of pageChildren) {
            if (!child.className.includes('hidden')) {
                child.classList.add('hidden');
                child.classList.add('falling');
            }
        }
        document.getElementById(name).classList.add('rising');
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
    function updateDisplay(value=displayValue, useRaw=false) {
        let prefix = ' ';
        let exponent = '';

        for (let element of document.querySelectorAll('.screen > *')) {
            element.classList.add('showing');
        }

        if (value.substring(0, 1) === '.') {
            value = '0' + value;
        }

        if (value === '') {
            value = '0';
        }

        if (value === '-0' || value === '-') {
            document.getElementById('advanced-output').textContent = '-0';
            return;
        }

        if (value === '-0.') {
            document.getElementById('advanced-output').textContent = '-0.';
            return;
        }

        let numVal = Number(value);
        if (isNaN(numVal) || Math.abs(numVal) == Infinity) {
            document.getElementById('advanced-output').textContent = ' -E-';
            document.getElementById('notation').textContent = ''
            return;
        }
        
        if (!useRaw && Math.abs(numVal) >= 10e13 || (Math.abs(numVal) <= 10e-7 && Math.abs(numVal) != 0)) {
            exponent = Math.floor(Math.log10(numVal));
            numVal /= 10 ** exponent;
        }
        
        let roundedVal = useRaw ? value : String(round(numVal, 12)).substring(0, Math.min(14, value.length));

        if (value.substring(0, 1) === '-') {
            prefix = '-';
            roundedVal = roundedVal.substring(1);
        }

        if (roundedVal.substring(roundedVal.length-1) === '.' && !useRaw) {
            roundedVal = roundedVal.substring(0, roundedVal.length-1);
        }
    
        document.getElementById('advanced-output').textContent = prefix + roundedVal;
        document.getElementById('notation').textContent = String(exponent || '');
    }

    function resetCalc() {
        displayValue = '';
        currentOperator = '';
        lastAction = '';
        pendingValue = 0;
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
        if (displayValue.length < 14 && displayValue != '-0') {
            displayValue += number;
        }

        if (displayValue === '-0') {
            displayValue = number === '.' ? '-0' + number : '-' + number;
        }

        updateDisplay(displayValue, true);
    }

    //Calculates display value and current value
    function advancedCalc(a=currentValue, b=pendingValue, operator=currentOperator) {
        if (operator === '') {return b}
        return calc(a, b, operator);
    }

    //Handles what happens when a calculator button is pressed
    function buttonHandler(button) {
        let value = button.value;
        if (Number(value) == value) { //Number buttons
            displayAdd(value);
            pendingValue = Number(displayValue);
        } else if (value === 'c') { //Clears display
            displayValue = '';
            pendingValue = 0;
            updateDisplay();
        } else if (value === 'ce') { //Clears display and stored values
            resetCalc();
        } else if (value === '.') { //Decimal button
            if (!displayValue.includes('.')) {
                displayAdd(value);
            }
        } else if (['+', '-', '*', '/'].includes(value)) { //Operation buttons
            if (Number(lastAction) == lastAction || lastAction === '=' || lastAction === '+=') {
                let newValue = advancedCalc();
                currentValue = newValue;
                displayValue = '';
                updateDisplay(currentValue.toString());
            }
            currentOperator = value;
        } else if (value === '+-') { //Toggles negativity of number
            if (displayValue.includes('-')) {
                displayValue = displayValue.substring(1);
            } else {
                displayValue = '-' + (displayValue || '0');
            }
            pendingValue = Number(displayValue);
            updateDisplay(displayValue);
        } else if (value === '=') { //Calculates [currentValue (operator) pendingValue]
            let newValue = advancedCalc();
            currentValue = newValue;
            displayValue = newValue.toString();
            updateDisplay();
        } else if (value === 'sqrt') {
            let newValue = pendingValue ** 0.5
            currentValue = newValue;
            pendingValue = currentValue;
            displayValue = newValue.toString();
            updateDisplay(currentValue.toString());
            currentOperator = '';
        }

        lastAction = value; //Records the current action for use on next button press
    }

    //Handles animations
    function animationHandler(e) {
        let animationName = e.animationName;
        if (animationName === 'fall') {
            e.target.classList.remove('falling');
            e.target.classList.add('hidden');
        } else if (animationName === 'rise') {
            e.target.classList.remove('rising');
        } else if (animationName === 'show') {
            e.target.classList.remove('showing');
        }
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
    
    //Adds animation handler to top-level and other selected elements
    let animatedElems = document.querySelectorAll('.page-wrapper > *, .screen > *');
    for (element of animatedElems) {
        element.addEventListener('animationend', animationHandler)
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