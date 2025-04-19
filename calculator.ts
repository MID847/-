// تایپ صریح برای buttons
interface ButtonHandlers {
    [key: string]: () => void;
}

class Calculator {
    private currentOperand: string;
    private previousOperand: string;
    private operation: string | null;

    constructor() {
        this.currentOperand = "0";
        this.previousOperand = "";
        this.operation = null;
        this.updateDisplay();
    }

    appendNumber(number: string): void {
        console.log(`Appending number: ${number}`); // دیباگ
        if (this.currentOperand === "0") {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    appendDecimal(): void {
        console.log("Appending decimal"); // دیباگ
        if (this.currentOperand.includes(".")) return;
        this.currentOperand += ".";
        this.updateDisplay();
    }

    chooseOperation(operation: string): void {
        console.log(`Choosing operation: ${operation}`); // دیباگ
        if (this.currentOperand === "") return;

        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "0";
        this.updateDisplay();
    }

    compute(): void {
        console.log("Computing"); // دیباگ
        let computation: number;
        const prev: number = parseFloat(this.previousOperand);
        const current: number = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case "add":
                computation = prev + current;
                break;
            case "subtract":
                computation = prev - current;
                break;
            case "multiply":
                computation = prev * current;
                break;
            case "divide":
                if (current === 0) {
                    this.currentOperand = "خطا";
                    this.previousOperand = "";
                    this.operation = null;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = "";
        this.updateDisplay();
    }

    clear(): void {
        console.log("Clearing"); // دیباگ
        this.currentOperand = "0";
        this.previousOperand = "";
        this.operation = null;
        this.updateDisplay();
    }

    delete(): void {
        console.log("Deleting"); // دیباگ
        if (this.currentOperand.length === 1) {
            this.currentOperand = "0";
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    updateDisplay(): void {
        console.log("Updating display"); // دیباگ
        const currentOperandElement: HTMLElement | null = document.getElementById("current-operand");
        const previousOperandElement: HTMLElement | null = document.getElementById("previous-operand");

        if (currentOperandElement) {
            currentOperandElement.textContent = this.currentOperand;
        } else {
            console.error("Could not find element with id 'current-operand'");
        }

        if (previousOperandElement) {
            if (this.operation) {
                let operatorSymbol: string = "";
                switch (this.operation) {
                    case "add":
                        operatorSymbol = "+";
                        break;
                    case "subtract":
                        operatorSymbol = "−";
                        break;
                        case "multiply":
                        operatorSymbol = "×";
                        break;
                    case "divide":
                        operatorSymbol = "÷";
                        break;
                }
                previousOperandElement.textContent = `${this.previousOperand} ${operatorSymbol}`;
            } else {
                previousOperandElement.textContent = this.previousOperand;
            }
        } else {
            console.error("Could not find element with id 'previous-operand'");
        }
    }
}

// Initialize calculator after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing calculator"); // دیباگ
    const calculator = new Calculator();

    // Button event listeners
    const buttons: ButtonHandlers = {
        "zero": () => calculator.appendNumber("0"),
        "one": () => calculator.appendNumber("1"),
        "two": () => calculator.appendNumber("2"),
        "three": () => calculator.appendNumber("3"),
        "four": () => calculator.appendNumber("4"),
        "five": () => calculator.appendNumber("5"),
        "six": () => calculator.appendNumber("6"),
        "seven": () => calculator.appendNumber("7"),
        "eight": () => calculator.appendNumber("8"),
        "nine": () => calculator.appendNumber("9"),
        "decimal": () => calculator.appendDecimal(),
        "add": () => calculator.chooseOperation("add"),
        "subtract": () => calculator.chooseOperation("subtract"),
        "multiply": () => calculator.chooseOperation("multiply"),
        "divide": () => calculator.chooseOperation("divide"),
        "equals": () => calculator.compute(),
        "clear": () => calculator.clear(),
        "delete": () => calculator.delete()
    };

    // استفاده از Object.keys به جای Object.entries برای ساده‌تر کردن تایپ‌ها
    Object.keys(buttons).forEach((id) => {
        const element: HTMLElement | null = document.getElementById(id);
        if (element) {
            console.log(`Adding event listener for ${id}`); // دیباگ
            element.addEventListener("click", buttons[id]);
        } else {
            console.error(`Could not find element with id '${id}'`);
        }
    });

    // Keyboard support
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        console.log(`Key pressed: ${event.key}`); // دیباگ
        if (event.key >= "0" && event.key <= "9") calculator.appendNumber(event.key);
        else if (event.key === ".") calculator.appendDecimal();
        else if (event.key === "+") calculator.chooseOperation("add");
        else if (event.key === "-") calculator.chooseOperation("subtract");
        else if (event.key === "*") calculator.chooseOperation("multiply");
        else if (event.key === "/") calculator.chooseOperation("divide");
        else if (event.key === "Enter" || event.key === "=") calculator.compute();
        else if (event.key === "Escape") calculator.clear();
        else if (event.key === "Backspace") calculator.delete();
    });
});