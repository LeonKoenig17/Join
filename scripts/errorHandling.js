async function showErrorNew(parentElement, element, offSetX, offSetY, elementText) {
    parentElement = document.getElementById(parentElement);
    element = document.getElementById(element);

    // let position = parentElement.getBoundingClientRect();

    try {
        parentElement.classList.add("redBorder")
    } catch (error) {
    }

    element.classList.add("visible")
    element.innerHTML = elementText

    // element.style.left = Number.parseInt((position.left + offSetX)) + "px";
    // element.style.top = Number.parseInt((position.top + position.height + offSetY)) + "px";
    // withWidth ? element.style.width = Number.parseInt((position.width)) + "px" : "";
}

function hideErrorNew(parentElement, element) {
    parentElement = document.getElementById(parentElement);
    element = document.getElementById(element);


    try { parentElement.classList.remove("redBorder") } catch (error) { }
    try { element.classList.remove("visible") } catch (error) { }
    try { element.innerHTML = "" } catch (error) { }
}

function checkName(element) {
    input = document.getElementById(element);
    inputSpan = element.replace("Input", "ErrorSpan")
    if (input.value == "") {
        showErrorNew(element, inputSpan, 0, 0, "cannot be empty", false)
        document.getElementById("rightBtn").disabled = true
        return
    } else {
        hideErrorNew(element, inputSpan);
        document.getElementById("rightBtn").disabled = false
    }

    if (element == "emailInputContact") {
        if (emailIsValid(input.value) == false) {
            showErrorNew(element, inputSpan, 0, 0, "not valid", false)
            document.getElementById("rightBtn").disabled = true
            return
        } else {
            hideErrorNew(element, inputSpan);
            document.getElementById("rightBtn").disabled = false
        }
    }








}


function checkEnter(event, id) {
    if (event.key === "Enter") {
        checkName(id);
    }
}


nameInput = document.getElementById('nameInput');
emailInput = document.getElementById('emailInput');
passwordInput = document.getElementById('passwordInput')
confirmPasswordInput = document.getElementById('confirmPasswordInput')

if (nameInput) {
    nameInput.addEventListener('blur', function (event) {

        if (nameInput.value == "") {
            showErrorNew("nameInput", "nameErrorSpan", 0, 0, "cannot be empty", false)
            return
        } else {
            hideErrorNew("nameInput", "nameErrorSpan");
        }
    });

    nameInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (nameInput.value == "") {
                showErrorNew("nameInput", "nameErrorSpan", 0, 0, "cannot be empty", false)
                return
            } else {
                hideErrorNew("nameInput", "nameErrorSpan");
            }
        }
    });
}

// Auslösen bei "Enter"-Taste
if (emailInput) {
    emailInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (emailInput.value == "") {
                showErrorNew("emailInput", "emailErrorSpan", 0, 0, "cannot be empty", false)
                return
            }

            if (emailIsValid(emailInput.value) == false) {
                showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Your Email-Address is not valid. Please check your input.", false)
            } else {
                hideErrorNew("emailInput", "emailErrorSpan");
            }

        }
    });

    // Auslösen beim Verlassen des Feldes (Blur)
    emailInput.addEventListener('blur', function (event) {

        if (emailInput.value == "") {
            showErrorNew("emailInput", "emailErrorSpan", 0, 0, "cannot be empty", false)
            return
        }
        if (emailIsValid(emailInput.value) == false) {
            showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Your Email-Address is not valid. Please check your input.", false)
        } else {
            hideErrorNew("emailInput", "emailErrorSpan");
        }
    });
}

if (passwordInput) {
    passwordInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (passwordInput.value = "") {
                showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "cannot be empty", false)
                return
            }

            const blueBtn = document.querySelector('.blueBtn');
            if (blueBtn) {
                blueBtn.click();
            }
        }
    });

    passwordInput.addEventListener('blur', function (event) {

        if (passwordInput.value == "") {
            showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "cannot be empty", false)
            return
        } else {
            hideErrorNew("passwordInput", "passwordErrorSpan");
        }
    });
}


if (passwordInput) {
    confirmPasswordInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            createAccount();
        }
    });

    confirmPasswordInput.addEventListener('blur', function () {
        showLockIconCreateAccount(this.id);
        if (confirmPasswordInput.value == "") {
            showErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "cannot be empty", false)
            return
        } else {
            hideErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan");
        }
    });
}