document.addEventListener("DOMContentLoaded", () => {
  let currentInput = "0";
  let previousInput = "";
  let operation = null;

  const inputDisplay = document.getElementById("calc-input");
  const resultDisplay = document.getElementById("calc-result");

  // تحديث العرض
  function updateDisplay() {
    inputDisplay.textContent = currentInput;
    resultDisplay.textContent = previousInput;
  }

  // إضافة رقم
  function appendNumber(number) {
    if (currentInput === "0" && number !== ".") {
      currentInput = number;
    } else {
      currentInput += number;
    }
  }

  // اختيار العملية
  function chooseOperation(op) {
    if (currentInput === "") return;
    if (previousInput !== "") {
      compute();
    }
    operation = op;
    previousInput = `${currentInput} ${op}`;
    currentInput = "";
  }

  // حساب الناتج
  function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        return;
    }

    currentInput = computation.toString();
    operation = null;
    previousInput = "";
  }

  // مسح الكل
  function clearAll() {
    currentInput = "0";
    previousInput = "";
    operation = null;
  }

  // مسح آخر رقم
  function backspace() {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "") currentInput = "0";
  }

  // العمليات الخاصة
  function specialOperation(action) {
    const num = parseFloat(currentInput);
    switch (action) {
      case "square":
        currentInput = (num * num).toString();
        break;
      case "cube":
        currentInput = (num * num * num).toString();
        break;
    }
  }

  // التعامل مع النقر على الأزرار
  document.querySelectorAll(".op-btn").forEach((button) => {
    button.addEventListener("click", () => {
      appendNumber(button.dataset.value);
      updateDisplay();
    });
  });

  document.querySelectorAll(".func-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (action === "clear") {
        clearAll();
      } else if (action === "backspace") {
        backspace();
      } else if (["square", "cube"].includes(action)) {
        specialOperation(action);
      } else if (action === "equals") {
        compute();
      } else {
        chooseOperation(button.textContent);
      }

      updateDisplay();
    });
  });

  // التهيئة الأولية
  updateDisplay();
});
