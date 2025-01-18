// Access DOM elements of calc
const inputbox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');

// define expression and result vars
let expression = '';
let result = '';

//define event handler for btn clicks

function buttonClick(event) {
    // get values from click buttons
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
   // console.log(target, action, value);

   // switch case to control calc
   switch (action) {
    case 'number':
        addValue(value);
        break;
    case 'clear':
        clear()
        break;
    case 'backspace':
        backspace()
        break;
        // add the result to expression as a starting point if expres is empty
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'divison':
        if (expression === '' && result !== '') {
            startFromResult(value);
        } else if (expression !== '' && !isLastCharacterOperator()) {
            addValue(value);
        }
        break;
    case 'submit': 
        submit();
        break;
    case 'negate': 
        negate();
        break;
    case 'mod':
        percentage();
        break;
    case 'decimal':
        decimal(value);
        break;
   }
   //update display
   updateDisplay(expression, result)
}

inputbox.addEventListener('click', buttonClick);

function addValue(value) {
    if (value === '.') {
        const lastOperatorIndex = expression.search(/[+\-*/]/);
        const lastDecimalIndex = expression.lastIndexOf('.');
        const lastnumberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
        );
        // check if this is first decimal in the current num or expres is empty
        if (
            (lastDecimalIndex < lastOperatorIndex || 
                lastDecimalIndex < lastnumberIndex || 
                lastDecimalIndex === -1) && 
                (expression === '' || 
                    expression.slice(lastnumberIndex + 1).indexOf('-') 
                    === -1)
         ) {
    expression += value
   }
 } else {
    expression += value;
 }
}

function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
}

function clear() {
    expression = '';
    result = '';
}

function backspace() {
    expression = expression.slice(0, -1);
} 

function isLastCharacterOperator() {
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
    expression += result + value;
}

function submit() {
    result = evaluateExpression();
    expression = '';
}

function evaluateExpression() {
    const evalResult = eval(expression);
    return isNaN(evalResult) || !isFinite(evalResult) ? '' : evalResult < 1 ? parseFloat(evalResult.toFixed(10)) : parseFloat(evalResult.toFixed(2));
}

function negate() {
    //Negate result if expres is empty and result present
    if (expression === '' && result !== '') {
        result = -result
        // toggle sign of expression if not already negative
    } else if ( !expression.startsWith('-') && expression !== '') {
        expression = '-' + expression;
        // remove negative sign if already negative
    } else if (expression.startsWith('-')) {
        expression = expression.slice(1);
    }
}

function percentage() {
    //Eval the expression, else it will take the % of only 1st num
    if (expression !== '') {
        result = evaluateExpression();
        expression = '';
        if (!isNaN(result) && isFinite(result)) {
            result /= 100;
        } else {
            result = '';
        }
    } else if (result !== '') {
        result = parseFloat(result) / 100;
    }
}

function decimal(value) {
    if (!expression.endsWith('.' && !isNaN(expression.slice(-1)))) {
        addValue(value);
    }
}
