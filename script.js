// another way of coding it is using early returns
const calculator = document.querySelector(".calculator");
const display = document.querySelector(".calculator__display");
const keys = calculator.querySelector(".calculator__keys");

const calculate = (n1, operator, n2) => {
  //you can remove the {} from if statements
  //istead of calling parseFloat eight times in the function. We can simplify it by creating
  // two variables to contain float values

  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === "add") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
};
//---------------------------------------------------------------------------------//
//This function should return the type of key that was clicked.
const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  )
    return "operator";
  // For everything else, return the action
  return action;
};

//--------------------------------------------------------------------------------//
//Here, createResultString is a pure function that returns what needs to be displayed on the calculator.
const createResultString = (key, displayedNum, state) => {
  /*
   Variables & properties required are:
     1. keyContent
     2. displayedNum
     3. previousKeyType
     4. action
     5. calculator.dataset.firstValue
     6. calculator.dataset.operator
     7. calculator.dataset.modValue
  
     */

  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = state;

  if (keyType === "number") {
    return displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "decimal") {
    if (!displayedNum.includes(".")) return displayedNum + ".";
    if (previousKeyType === "operator" || previousKeyType === "calculate")
      return "0.";

    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "clear") return 0;

  if (keyType === "calculate") {
    return firstValue
      ? previousKeyType === "calculate"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

//----------------------------------------------------------------//
//updateCalculatorState is a function that changes the calculator's visual appearance and custom attributes.
const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } =
    calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
        ? calculatedValue
        : displayedNum;
  }

  if (keyType === "calculate") {
    calculator.dataset.modValue =
      firstValue && previousKeyType === "calculate" ? modValue : displayedNum;
  }

  if (keyType === "clear" && key.textContent === "AC") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.previousKeyType = "";
  }
};

//----------------------------------------------------------------//
/*We changed three kinds of values in updateCalculatorState:
  1-calculator.dataset
  2-The class for pressing/depressing operators
  3-AC vs CE text
  If you want to make it cleaner, you can split (2) and (3) into another function — updateVisualState.           */
const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  if (keyType === "operator") key.classList.add("is-depressed");
  if (keyType === "clear" && key.textContent !== "AC") key.textContent = "AC";
  if (keyType !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "CE";
  }
};

/* to be able to (1) listen for all keypresses and (2) determine 
  the type of key that is pressed.
   In this case, we can use an event delegation pattern to liste  */

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  // to show the clicked number on the display div we can use the textContent proprety
  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});

/*this was all inside addEventListener 

//you can use cosole.log here to see first if the script it functioning right

  //If the key has a data-action that is either add, subtract, multiply or divide,
  // we know the key is an operator.

  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) {
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    const secondValue = displayedNum;

    // Note: It's sufficient to check for firstValue and operator because secondValue always exists
    if (firstValue && operator) {
      return calculate(firstValue, operator, secondValue);
    }
    //To prevent the calculator from performing a calculation on subsequent clicks on
    //the operator key, we need to check if the previousKeyType is an operator.
    // If it is, we don’t perform a calculation.

    if (
      firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
    ) {
      const calcValue = calculate(firstValue, operator, secondValue);
      return calcValue;

      // Update calculated value as firstValue
      calculator.dataset.firstValue = calcValue;
    } else {
      // If there are no calculations, set displayedNum as the firstValue
      calculator.dataset.firstValue = displayedNum;
    }

    // to highlight the clicked operator to know its active so you can press another number
    //you need to add it to a class
    key.classList.add('is-depressed');
    // Add custom attribute as we want to update the display to the clicked key. Before we do this,
    //we need a way to tell if the previous key is an operator key.
    calculator.dataset.previousKeyType = 'operator';

    //To get the first number, we need to store the calculator’s displayed
    // value before we wipe it clean. One way to save this first number
    //is to add it to a custom attribute when the operator button gets clicked
    calculator.dataset.firstValue = displayedNum;
    calculator.dataset.operator = action;
  }

  if (action === 'decimal' || previousKeyType === 'calculate') {
    if (!displayedNum.includes('.')) {
      return displayedNum + '.';
    } else if (previousKeyType === 'operator') {
      // display.textContent = '0.';
      // it can be rewritten with early return way

      return '0.';
    }

    calculator.dataset.previousKey = 'decimal';

    //if you hit any number after hitting a decimal key, the number should be
    // appended on the display as well.
    return displayedNum + '.';
  }

  if (action === 'clear') {
    //hits CE, the display should read 0. At the same time,
     //CE should be reverted to AC so Tim can reset the calculator to its initial state.

    if (key.textContent === 'AC') {
      calculator.dataset.firstValue = '';
      calculator.dataset.modValue = '';
      calculator.dataset.operator = '';
      calculator.dataset.previousKeyType = '';
    } else {
      key.textContent = 'AC';
    }
    return '0';

    calculator.dataset.previousKeyType = 'clear';
  }

  //hitting a key (any key except clear), AC should be changed to CE
  if (action !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]');
    return 'CE';
  }

  if (action === 'calculate') {
    //to correctly identify if previousKeyType is an operator, we need to update previousKeyType for each clicked key.

    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    //the second number — that is, the currently displayed number
    const secondValue = displayedNum;

    if (firstValue) {
      if (previousKeyType === 'calculate') {
        firstValue = displayedNum;
        secondValue = calculator.dataset.modValue;
      }

      return calculate(firstValue, operator, secondValue);
    }

    //secondValue to persist to the next calculation, 
    //  we need to store it in another custom attribute.
     //  Let’s call this custom attribute modValue (stands for modifier value).
    calculator.dataset.modValue = secondValue;

    calculator.dataset.previousKeyType = 'calculate';
  }

  //To check if the string already has a dot, Do nothing if string has a dot
  if (!displayedNum.includes('.')) {
    return displayedNum + '.';
  }

  if (!action) {
    //If the calculator shows 0, we want to replace the calculator’s display with the clicked key
    //We can do so by replacing the display’s textContent property.

    // If the key does not have a data-action attribute, it must be a number key.

    calculator.dataset.previousKey = 'number';

    //If the previousKeyType is an operator, we want to replace the displayed number with clicked number.
    const previousKeyType = calculator.dataset.previousKeyType;
    if (
      displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
    ) {
      return keyContent;
    }
    //If the calculator shows a non-zero number, we want to append the clicked key to the displayed number.
    // To append a number, we concatenate a string.
    else {
      return displayedNum + keyContent;
    }
  }    */

//-----------------------------------------------------------------------------------------//
// function to perform calculation and return calculated value
/*
const calculate = (n1, operator, n2) => {
  let result = '';

  /we used parseFloat to convert the n1 n2 string into float number
  if (operator === 'add') {
    result = parseFloat(n1) + parseFloat(n2);
  } else if (operator === 'subtract') {
    result = parseFloat(n1) - parseFloat(n2);
  } else if (operator === 'multiply') {
    result = parseFloat(n1) * parseFloat(n2);
  } else if (operator === 'divide') {
    result = parseFloat(n1) / parseFloat(n2);
  }

  return result;
};
*/
