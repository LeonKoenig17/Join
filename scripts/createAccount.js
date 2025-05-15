

function initCreateAccount() {
    loadFromFirebase();
}

async function createAccount() {
    let chkboxPrivacy = document.getElementById("acceptPrivacyPolicy");
    let privacyBoolean = chkboxPrivacy.src.search("true") > 0 ? "true" : "false";
    let userName = document.getElementById("nameInput").value;
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    let confirmPassword = document.getElementById("confirmPasswordInput").value;



    if (privacyBoolean == "false") {
        return
    }

    let myValue = await findUser(email);


    if (myValue != null) {
        // window.alert("Account already exists")
        deleteError("signUpBtn","accountErrorSpan",-48  ,50,'Account with this email-address already exists.')
    } else {
        if (password == confirmPassword && password != "" && privacyBoolean == "true") {
            let nextcolor = await lastColor();
            await postData("login", { "name": userName, "email": email, "password": password, "color": nextcolor, "phone": '', "type": "login" })
            await loadFromFirebase();
            await writeLocalStorage();
            showSuccess('signUpSuccess');
        } else {
            document.getElementById("confirmPasswordInput").classList.add("redBorder")
        }
    }
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function checkEmailInput() {
    let email = document.getElementById("emailInput").value;

    if (emailIsValid(email) == false) {
        deleteError("emailInput", "emailErrorSpan", 10, 50, `Your Email-Address is not valid. Please check your input.`);

        // let errorSpan = document.getElementById("errorSpan")
        // errorSpan.classList.remove("displayNone")
        // errorSpan.innerHTML = "Your Email-Address is not valid. Please check your input."
        // console.log("input is not a valid email address")
        return
    } else {
        hideError("emailInput", "emailErrorSpan")
        // errorSpan.classList.add("displayNone")
        // errorSpan.innerHTML = "Your passwords don't match. Please try again."
    }
}

function hideError(firstType,secondType){
        let element = document.getElementById(secondType);
        element.classList.add("displayNone")
        document.getElementById(firstType).classList.remove("redBorder")
        document.getElementById("accountErrorSpan").classList.add("displayNone")
}

function deleteError(firstType, secondType, setOffX, setOffY, errorText) {
    try {
        let element = document.getElementById(firstType);
        let position = element.getBoundingClientRect();
        let span = document.getElementById(secondType);
        document.getElementById(firstType).classList.add("redBorder")
        span.innerHTML = errorText
        span.classList.remove("displayNone")
        span.style.left = Number.parseInt((position.left + setOffX)) + "px";
        span.style.top = Number.parseInt((position.top + setOffY)) + "px";
    } catch (error) {
        return null
    }
}

const emailInput = document.getElementById('emailInput');
const confirmInput = document.getElementById('confirmPasswordInput')

// Auslösen bei "Enter"-Taste
emailInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkEmailInput();
    }
});

confirmInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        showLockIconCreateAccount(this.id);
    }
});

// Auslösen beim Verlassen des Feldes (Blur)
emailInput.addEventListener('blur', function () {
    checkEmailInput();
});