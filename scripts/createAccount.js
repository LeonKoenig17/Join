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
        showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Account with this Email already exists.")
        return
    }

    if (password != confirmPassword && userName != "" && email != "") {
        showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "Passwords don't match.")
        showErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "Passwords don't match.")
        return
    } else {
        hideErrorNew("passwordInput", "passwordErrorSpan")
        hideErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan")
        
    }

    if (password == "") {
        showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (confirmPassword == "") {
        showErrorNew("confirmPasswordInput", "confirmPasswordErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (userName == "") {
        showErrorNew("nameInput", "nameErrorSpan", 0, 0, "Cannot be ampty.")
    }

    if (email == "") {
        showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Cannot be ampty.")
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



