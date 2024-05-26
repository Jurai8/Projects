// 1. Store all numbers in an array
const buttons = document.querySelectorAll('.symbol');

let prevResult;

const symbolArray = Array.from(buttons);

// where the numbers are shown
const input = document.getElementById("calculator-text")

// 2. iterate over buttons
for (const symbol of symbolArray) {

  // - when specific button clicked...
  symbol.addEventListener("click", () => {

    if (input.value === prevResult) {
      input.value = "";
    }

    // if "C" is clicked, clear the input
    if (symbol.value === "C") {
      input.value = "";
      return;
    }

    // if value = error, replace it with what user clicks
    if (input.value === "error") {
      input.value = "";
    } 


    // if "=" clicked
    if (symbol.value === "=") {
      
      let calc = input.value;

      // if the final input is not a number...error
      if (calc[calc.length - 1] === "+" || calc[calc.length - 1] === "-" ||
      calc[calc.length - 1] === "*" || calc[calc.length - 1] === "/") {

        input.value = "error";
        return;
      }

      answer = toInfix(calc);

      input.value = answer;
      prevResult = input.value;
      return;
    }

    // Add the value of that button to the input
    input.value += symbol.value;
  })
}



function toInfix(calc) {
  let arr = [];
  let str = "";
  for (let i = 0; i < calc.length; i++) {
    // if the char in calc = an operator
    
    if ("+-*/".indexOf(calc[i]) > -1) {
      // if there is an operand (number)
      if(str.length > 0) {
        // add the number to the array
        str = Number(str);
        arr.push(str);
      }
      // afterwards, add the operator
      arr.push(calc[i]);
      // reset the string
      str = "";
    } else {
      // add the operand to the string
      str += calc[i];
    }
  }

  // if there are operands (numbers)
  if (str.length > 0){
    // add them to the arrary
    str = Number(str);
    arr.push(str);
  }

  // return final answer to main
  return polish(arr);
}


function polish(arr) {
  let infix = arr;
  let opStack = [];
  let queue = [];

  for (let i = 0; i < infix.length; i++) {

    if (!"+/-*".includes(infix[i])) {
      // convert infix to an int
      infix[i] = Number(infix[i]);
    }

    // if it's a number
    if (!isNaN(infix[i])) {
      // add it to the queue
      queue.push(Number(infix[i]));
    
    } else { 

      switch(infix[i]) {
        case "/":
            opStack.push(infix[i]);
            break;
          
        case "*":
            opStack.push(infix[i]);
            
            break;
  
        case "+":
            // if operator in stack has higher precedence 
            if (opStack[opStack.length - 1] === "*" || opStack[opStack.length - 1] === "/" ) {
              // push the higher op to the queue
              queue.push(opStack[opStack.length - 1]);
              // pop the higher op from opStack
              opStack.pop();
              // push the lower op onto opStack
              opStack.push(infix[i]);
            } else {
              opStack.push(infix[i]);
            }
  
            break;
  
        case "-":
          if (opStack[opStack.length - 1] === "*" ||opStack[opStack.length - 1] === "/" ) {
            // push the higher op to the queue
            queue.push(opStack[opStack.length - 1]);
            // pop the higher op from opStack
            opStack.pop();
            // push the lower op onto opStack
            opStack.push(infix[i]);
          } else {
            opStack.push(infix[i]);
          }
          
          break;
      }

    }
  }

  while(opStack.length > 0) {
    queue.push(opStack[opStack.length - 1])
    opStack.pop();
  }

  // return final answer to "toinfinix"
  return calculate(queue);

}


function calculate(outPutQueue) {

  let tokenList = outPutQueue;
  let stack = [];
  let tempAnswer;

  // loop over the queue
  for (let i = 0; i < tokenList.length; i++){

    let secondOperand;
    let firstOperand;
    // if it's a number add to stack 
    if (!isNaN(tokenList[i])) {
      stack.push(tokenList[i])
    }

    
    // if it's an operator
    switch(tokenList[i]){
      case "+":
        // calculate using the two last operands on stack
        secondOperand = Number(stack.pop());
        firstOperand = Number(stack.pop());

        tempAnswer = firstOperand + secondOperand;

        stack.push(tempAnswer)

        break;

      case "-":
        secondOperand = Number(stack.pop());
        firstOperand = Number(stack.pop());

        tempAnswer = firstOperand - secondOperand;

        stack.push(tempAnswer)

        break;

      case "*": 
        secondOperand = Number(stack.pop());
        firstOperand = Number(stack.pop());

        tempAnswer = firstOperand * secondOperand;

        stack.push(tempAnswer)
      break;

      case "/": 
        secondOperand = Number(stack.pop());
        firstOperand = Number(stack.pop());

        tempAnswer = firstOperand / secondOperand;

        stack.push(tempAnswer)

      break;

    }
  }

  // return the final answer to "polish"
  return stack[0];

}

// test calculator
// why is it returning NaN