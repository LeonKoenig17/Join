const emailInputField = document.getElementById("emailInput");

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
        window.alert("Account already exists")
    } else {
        if (password == confirmPassword && password != "" && privacyBoolean == "true") {
            let nextcolor = await lastColor();
            await postData("login", { "name": userName, "email": email, "password": password, "color": nextcolor, "phone": '', "type": "login" })
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
        let errorSpan = document.getElementById("errorSpan")
        errorSpan.classList.remove("displayNone")
        errorSpan.innerHTML = "Your Email-Address is not valid. Please check your input."
        // console.log("input is not a valid email address")
        return
    } else {
        errorSpan.classList.add("displayNone")
        // errorSpan.innerHTML = "Your passwords don't match. Please try again."
    }
}

emailInputField.addEventListener('keydown', function (event) {
    if(event.key === 'Enter'){
        checkEmailInput();
    }
})

emailInputField.addEventListener('blur', function() {
    checkEmailInput();
})