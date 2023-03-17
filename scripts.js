/* to be able to (1) listen for all keypresses and (2) determine 
the type of key that is pressed.
 In this case, we can use an event delegation pattern to liste  */
const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");

const display = document.querySelector(".calculator__display");

keys.addEventListener("‘click’", (e) => {
  if (e.target.matches("button")) {
    // to show the clicked number on the display div we can use the textContent proprety

    const key = e.target;
    //data-action attribute to determine the type of key
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
  }

  // Remove .is-depressed class from all keys
  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-depressed")
  );

  //! I used cosole.log here to see first if the script it functioning right

  //If the key has a data-action that is either add, subtract, multiply or divide,
  // we know the key is an operator.

  if (
    action === "add" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  ) {
    console.log("operator key!");

    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    const secondValue = displayedNum;

    // Note: It's sufficient to check for firstValue and operator because secondValue always exists
    if (firstValue && operator) {
      display.textContent = calculate(firstValue, operator, secondValue);
    }
    //To prevent the calculator from performing a calculation on subsequent clicks on
    //the operator key, we need to check if the previousKeyType is an operator.
    // If it is, we don’t perform a calculation.

    if (
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "calculate"
    ) {
      const calcValue = calculate(firstValue, operator, secondValue);
      display.textContent = calcValue;

      // Update calculated value as firstValue
      calculator.dataset.firstValue = calcValue;
    } else {
      // If there are no calculations, set displayedNum as the firstValue
      calculator.dataset.firstValue = displayedNum;
    }

    // to highlight the clicked operator to know its active so you can press another number
    //you need to add it to a class
    key.classList.add("is-depressed");
    // Add custom attribute as we want to update the display to the clicked key. Before we do this,
    //we need a way to tell if the previous key is an operator key.
    calculator.dataset.previousKeyType = "operator";

    //To get the first number, we need to store the calculator’s displayed
    // value before we wipe it clean. One way to save this first number
    //is to add it to a custom attribute when the operator button gets clicked
    calculator.dataset.firstValue = displayedNum;
    calculator.dataset.operator = action;
  }

  if (action === "decimal" || previousKeyType === "calculate") {
    console.log("decimal key!");

    if (!displayedNum.includes(".")) {
      display.textContent = displayedNum + ".";
    } else if (previousKeyType === "operator") {
      display.textContent = "0.";
    }

    calculator.dataset.previousKey = "decimal";

    //if you hit any number after hitting a decimal key, the number should be
    // appended on the display as well.
    display.textContent = displayedNum + ".";
  }

  if (action === "clear") {
    console.log("clear key!");

    /*hits CE, the display should read 0. At the same time,
     CE should be reverted to AC so Tim can reset the calculator to its initial state.*/

    if (key.textContent === "AC") {
      calculator.dataset.firstValue = "";
      calculator.dataset.modValue = "";
      calculator.dataset.operator = "";
      calculator.dataset.previousKeyType = "";
    } else {
      key.textContent = "AC";
    }
    display.textContent = 0;

    calculator.dataset.previousKeyType = "clear";
  }

  //hitting a key (any key except clear), AC should be changed to CE
  if (action !== "clear") {
    const clearButton = calculator.querySelector("[data-action=clear]");
    clearButton.textContent = "CE";
  }

  if (action === "calculate") {
    console.log("equal key!");

    //to correctly identify if previousKeyType is an operator, we need to update previousKeyType for each clicked key.

    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    //the second number — that is, the currently displayed number
    const secondValue = displayedNum;

    if (firstValue) {
      if (previousKeyType === "calculate") {
        firstValue = displayedNum;
        secondValue = calculator.dataset.modValue;
      }

      display.textContent = calculate(firstValue, operator, secondValue);
    }

    /* secondValue to persist to the next calculation, 
      we need to store it in another custom attribute.
       Let’s call this custom attribute modValue (stands for modifier value).*/
    calculator.dataset.modValue = secondValue;

    calculator.dataset.previousKeyType = "calculate";
  }

  //To check if the string already has a dot, Do nothing if string has a dot
  if (!displayedNum.includes(".")) {
    display.textContent = displayedNum + ".";
  }

  if (!action) {
    //If the calculator shows 0, we want to replace the calculator’s display with the clicked key
    //We can do so by replacing the display’s textContent property.

    // If the key does not have a data-action attribute, it must be a number key.

    calculator.dataset.previousKey = "number";

    //If the previousKeyType is an operator, we want to replace the displayed number with clicked number.
    const previousKeyType = calculator.dataset.previousKeyType;
    if (
      displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "calculate"
    ) {
      display.textContent = keyContent;
    }
    //If the calculator shows a non-zero number, we want to append the clicked key to the displayed number.
    // To append a number, we concatenate a string.
    else {
      display.textContent = displayedNum + keyContent;
    }
  }
});

//-----------------------------------------------------------------------------------------//
// function to perform calculation and return calculated value
const calculate = (n1, operator, n2) => {
  let result = "";

  //we used parseFloat to convert the n1 n2 string into float number
  if (operator === "add") {
    result = parseFloat(n1) + parseFloat(n2);
  } else if (operator === "subtract") {
    result = parseFloat(n1) - parseFloat(n2);
  } else if (operator === "multiply") {
    result = parseFloat(n1) * parseFloat(n2);
  } else if (operator === "divide") {
    result = parseFloat(n1) / parseFloat(n2);
  }

  return result;
};
