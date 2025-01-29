window.addEventListener('DOMContentLoaded', () => {

    function round(num, place) {
        place = Math.max(place, 1);
        return Math.round(num * 10**place) / 10**place || num;
    }

    function toMenu() {
        document.getElementsByClassName('output-container')[0].classList.add('hidden');
        document.getElementsByClassName('calc-choice-container')[0].classList.remove('hidden');
    }

    
    function promptCalc() {
        let firstNum = NaN,
            operator = '',
            secondNum = NaN;
            
        while (Number.isNaN(firstNum)) {
            let input = prompt('Please enter the first number')
            if (input === null) {toMenu(); return;}
            firstNum = parseFloat(input);
        }

        while (!['+', '-', '*', '/'].includes(operator)) {
            let input = prompt('Please enter the operation (+, -, *, /)');
            if (input === null) {toMenu(); return;}
            operator = input
        }

        while (Number.isNaN(secondNum)) {
            let input = prompt('Please enter the second number')
            if (input === null) {toMenu(); return;}
            secondNum = parseFloat(input);
        }

        let outcome;
        if (operator === '+') {
            outcome = firstNum + secondNum;
        } else if (operator === '-') {
            outcome = firstNum - secondNum;
        } else if (operator === '*') {
            outcome = firstNum * secondNum;
        } else if (operator === '/') {
            outcome = firstNum / secondNum;
        }

        let outputElem = document.getElementById('basic-output');
        outputElem.textContent = round(outcome, 8);
    }

    let choiceBasic = document.getElementById('choice-basic');
    choiceBasic.addEventListener('click', e => {
        let btn = e.target;
        btn.parentElement.classList.add('hidden');
        document.getElementsByClassName('output-container')[0].classList.remove('hidden');
        promptCalc();
    })

    let menuButtons = document.querySelectorAll('button.menu');
    for (let elem of menuButtons) {
        elem.addEventListener('click', toMenu);
    }

})