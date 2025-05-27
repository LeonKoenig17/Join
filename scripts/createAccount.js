let chkboxPrivacy = ""
let privacyBoolean = ""
let userName = ""
let email = ""
let password = ""
let confirmPassword = ""


function initCreateAccount() {
    loadFromFirebase();
}

async function createAccount() {
    chkboxPrivacy = document.getElementById("acceptPrivacyPolicy");
    privacyBoolean = chkboxPrivacy.src.search("true") > 0 ? "true" : "false";
    userName = document.getElementById("nameInput").value;
    email = document.getElementById("emailInput").value;
    password = document.getElementById("passwordInput").value;
    confirmPassword = document.getElementById("confirmPasswordInput").value;
    let myValue = await findUser(email);



    if (myValue != null) {
        showError("emailInput", "emailErrorSpan", 0, 0, "Account with this Email already exists.")
        return
    }

    if (password != confirmPassword && userName != "" && email != "") {
        showError("passwordInput", "passwordErrorSpan", 0, 0, "Passwords don't match.")
        showError("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "Passwords don't match.")
        return
    } else {
        hideError("passwordInput", "passwordErrorSpan")
        hideError("confirmPasswordInput", "confirmPasswordErrorSpan")
        
    }

    if (password == "") {
        showError("passwordInput", "passwordErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (confirmPassword == "") {
        showError("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (userName == "") {
        showError("nameInput", "nameErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (email == "") {
        showError("emailInput", "emailErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (password == confirmPassword && password != "" && privacyBoolean == "true" && userName != "" && emailIsValid(email) == true && myValue == null) {
        let nextcolor = await lastColor();
        await postData("login", { "name": userName, "email": email, "password": password, "color": nextcolor, "phone": '', "type": "login" })
        await loadFromFirebase();
        writeLocalStorage();
        toasterPopup('signUpSuccess', '../html/summary');
    }
}



function acceptPrivacyPolicy(element) {
    chkboxPrivacy = document.getElementById(element);
    let myValue = chkboxPrivacy.src.search("true") > 0 ? "true" : "false";

    if (myValue == "false") {
        chkboxPrivacy.src = "../images/checkboxtrueblack.svg"
        document.getElementById("signUpBtn").disabled = false
        // document.getElementById("signUpBtn").removeAttribute("disabled")
        document.getElementById("signUpBtn").classList.remove("disabled")
    } else {
        chkboxPrivacy.src = "../images/checkboxfalseblack.svg"
        document.getElementById("signUpBtn").classList.add("disabled")
        document.getElementById("signUpBtn").disabled = true
    }
}



function addRedBorder(id) {
    document.getElementById(id).classList.add("redBorder");
}



