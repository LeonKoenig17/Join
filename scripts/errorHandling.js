

function showErrorNew(parentElement, element, offSetX, offSetY, elementText) {
    parentElement = document.getElementById(parentElement);
    element = document.getElementById(element);
    element.innerHTML = elementText
    element.classList.add("visible")

    try {
        parentElement.classList.add("redBorder")
    } catch (error) {
    }

}

function hideErrorNew(parentElement, element) {
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
        showErrorNew(elementId, errorSpanId, 0, 0, "cannot be empty", false);
        rightBtn.disabled = true;
        return;
    }

    if (isEmailValid) {
        showErrorNew(elementId, errorSpanId, 0, 0, "not valid", false);
        rightBtn.disabled = true;
        return;
    }

    hideErrorNew(elementId, errorSpanId);
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
        showErrorNew(inputId, errorSpanId, 0, 0, "cannot be empty", false);
        return false;
    } else {
        hideErrorNew(inputId, errorSpanId);
        return true;
    }
}

function validateEmail(inputId, errorSpanId) {
    const input = document.getElementById(inputId);
    if (!validateEmpty(inputId, errorSpanId)) return false;

    if (!emailIsValid(input.value)) {
        showErrorNew(inputId, errorSpanId, 0, 0, "Your Email-Address is not valid. Please check your input.", false);
        return false;
    } else {
        hideErrorNew(inputId, errorSpanId);
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


// if (nameInput) {
//     nameInput.addEventListener('blur', function (event) {

//         if (nameInput.value == "") {
//             showErrorNew("nameInput", "nameErrorSpan", 0, 0, "cannot be empty", false)
//             return
//         } else {
//             hideErrorNew("nameInput", "nameErrorSpan");
//         }
//     });

//     nameInput.addEventListener('keydown', function (event) {
//         if (event.key === 'Enter') {
//             if (nameInput.value == "") {
//                 showErrorNew("nameInput", "nameErrorSpan", 0, 0, "cannot be empty", false)
//                 return
//             } else {
//                 hideErrorNew("nameInput", "nameErrorSpan");
//             }
//         }
//     });
// }

// // Auslösen bei "Enter"-Taste
// if (emailInput) {
//     emailInput.addEventListener('keydown', function (event) {
//         if (event.key === 'Enter') {
//             if (emailInput.value == "") {
//                 showErrorNew("emailInput", "emailErrorSpan", 0, 0, "cannot be empty", false)
//                 return
//             }

//             if (emailIsValid(emailInput.value) == false) {
//                 showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Your Email-Address is not valid. Please check your input.", false)
//             } else {
//                 hideErrorNew("emailInput", "emailErrorSpan");
//             }

//         }
//     });

//     // Auslösen beim Verlassen des Feldes (Blur)
//     emailInput.addEventListener('blur', function (event) {

//         if (emailInput.value == "") {
//             showErrorNew("emailInput", "emailErrorSpan", 0, 0, "cannot be empty", false)
//             return
//         }
//         if (emailIsValid(emailInput.value) == false) {
//             showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Your Email-Address is not valid. Please check your input.", false)
//         } else {
//             hideErrorNew("emailInput", "emailErrorSpan");
//         }
//     });
// }

// if (passwordInput) {
//     passwordInput.addEventListener('keydown', function (event) {
//         if (event.key === 'Enter') {
//             if (passwordInput.value = "") {
//                 showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "cannot be empty", false)
//                 return
//             }

//             const blueBtn = document.querySelector('.blueBtn');
//             if (blueBtn) {
//                 blueBtn.click();
//             }
//         }
//     });

//     passwordInput.addEventListener('blur', function (event) {

//         if (passwordInput.value == "") {
//             showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "cannot be empty", false)
//             return
//         } else {
//             hideErrorNew("passwordInput", "passwordErrorSpan");
//         }
//     });
// }


// if (passwordInput) {
//     confirmPasswordInput.addEventListener('keydown', function (event) {
//         if (event.key === 'Enter') {
//             createAccount();
//         }
//     });

//     confirmPasswordInput.addEventListener('blur', function () {
//         showLockIconCreateAccount(this.id);
//         if (confirmPasswordInput.value == "") {
//             showErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "cannot be empty", false)
//             return
//         } else {
//             hideErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan");
//         }
//     });
// }