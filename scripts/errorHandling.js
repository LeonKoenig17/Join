

function showError(parentElement, element, offSetX, offSetY, elementText) {
    parentElement = document.getElementById(parentElement);
    element = document.getElementById(element);
    element.innerHTML = elementText
    element.classList.add("visible")

    try {
        parentElement.classList.add("redBorder")
    } catch (error) {
    }

}

function hideError(parentElement, element) {
    parentElement = document.getElementById(parentElement);
    element = document.getElementById(element);
    try { parentElement.classList.remove("redBorder") } catch (error) { }
    try { element.classList.remove("visible") } catch (error) { }
    try { element.innerHTML = "" } catch (error) { }
}


function checkName(elementId) {
    const input = document.getElementById(elementId);
    const errorSpanId = elementId.replace("Input", "ErrorSpan");
    const rightBtn = document.getElementById("rightBtn");

    const isEmpty = input.value.trim() === "";
    const isEmail = elementId === "emailInputContact";
    const isEmailValid = isEmail && !emailIsValid(input.value);

    if (isEmpty) {
        showError(elementId, errorSpanId, 0, 0, "This input field must be filled.", false);
        rightBtn.disabled = true;
        return;
    }

    if (isEmailValid) {
        showError(elementId, errorSpanId, 0, 0, "Email address is not valid.", false);
        rightBtn.disabled = true;
        return;
    }

    hideError(elementId, errorSpanId);
    rightBtn.disabled = false;
}


function checkEnter(event, id) {
    if (event.key === "Enter") {
        checkName(id);
    }
}

function validateEmpty(inputId, errorSpanId) {
    const input = document.getElementById(inputId);
    if (input.value.trim() === "") {
        showError(inputId, errorSpanId, 0, 0, "This input field must be filled.", false);
        return false;
    } else {
        hideError(inputId, errorSpanId);
        return true;
    }
}

function validateEmail(inputId, errorSpanId) {
    const input = document.getElementById(inputId);
    if (!validateEmpty(inputId, errorSpanId)) return false;

    if (!emailIsValid(input.value)) {
        showError(inputId, errorSpanId, 0, 0, "Email address is not valid.", false);
        return false;
    } else {
        hideError(inputId, errorSpanId);
        return true;
    }
}

function addValidationEvents(inputId, errorSpanId, isEmail = false, onEnter = null) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('blur', () => {
        isEmail ? validateEmail(inputId, errorSpanId) : validateEmpty(inputId, errorSpanId);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const valid = isEmail ? validateEmail(inputId, errorSpanId) : validateEmpty(inputId, errorSpanId);
            if (valid && onEnter) onEnter();
        }
    });
}

addValidationEvents("nameInput", "nameErrorSpan");
addValidationEvents("emailInput", "emailErrorSpan", true);
addValidationEvents("passwordInput", "passwordErrorSpan", false, () => {
    const blueBtn = document.querySelector('.blueBtn');
    if (blueBtn) blueBtn.click();
});
addValidationEvents("confirmPasswordInput","confirmPasswordErrorSpan",false,typeof createAccount === "function" ? createAccount : null);

confirmPasswordInput = document.getElementById("confirmPasswordInput");
if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', function () {
        showLockIconCreateAccount(this.id);
    });
}


nameInput = document.getElementById('nameInput');
emailInput = document.getElementById('emailInput');
passwordInput = document.getElementById('passwordInput')
confirmPasswordInput = document.getElementById('confirmPasswordInput')
