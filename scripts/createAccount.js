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


    // if (emailIsValid(email) == false) {
    //     return
    // }



    let myValue = await findUser(email);



    if (myValue != null) {
        // window.alert("Account already exists")
        checkMissingInputs('accountExist')
        // return
    }

    if (privacyBoolean == "false") {
        // deleteError('acceptPrivacyPolicy','privacyErrorSpan',0,0)
        checkMissingInputs('privacyPolicy')
        // return
    }

    if (password != confirmPassword) {
        checkMissingInputs('passwordsNoMatch')
    }else{
        clearErrorInput("passwordInput", "passwordErrorSpan");
        clearErrorInput("confirmPasswordInput", "confirmPasswordErrorSpan");
    }

    if (password == "") {
        checkMissingInputs('passwordEmpty')
    }

    if (confirmPassword == "") {
        checkMissingInputs('confirmPasswordEmpty')
    }

    if (userName == "") {
        checkMissingInputs('userNameEmpty')
    }

    if (emailIsValid(email) == false) {
        checkMissingInputs('emailExist')
    }

    if (email == "") {
        checkMissingInputs('emailEmpty')
    }

    if (password == confirmPassword && password != "" && privacyBoolean == "true" && userName != "" && emailIsValid(email) == true && myValue == null) {
        let nextcolor = await lastColor();
        await postData("login", { "name": userName, "email": email, "password": password, "color": nextcolor, "phone": '', "type": "login" })
        await loadFromFirebase();
        writeLocalStorage();
        toasterPopup('signUpSuccess', '../html/summary');
    }
}


function checkMissingInputs(element) {
    const addRed = id => document.getElementById(id).classList.add("redBorder");

    switch (element) {
        case "accountExist":
            deleteError("signUpBtn", "accountErrorSpan", -48, 50, 'Account with this email-address already exists.');
            break;
        case "passwordsNoMatch":
            addRed("passwordInput");
            addRed("confirmPasswordInput");
            deleteError("passwordInput", "passwordErrorSpan", 10, 50, `Your passwords don't match. Please try again.`);
            deleteError("confirmPasswordInput", "confirmPasswordErrorSpan", 10, 50, `Your passwords don't match. Please try again.`);
            break;
        case "userNameEmpty":
            addRed("nameInput");
            deleteError("nameInput", "nameErrorSpan", 8, 50, 'Name must be filled.');
            break;
        case "passwordEmpty":
            addRed("passwordInput");
            deleteError("passwordInput", "passwordErrorSpan", 8, 50, 'Password must be filled.');
            break;
        case "confirmPasswordEmpty":
            addRed("confirmPasswordInput");
            deleteError("confirmPasswordInput", "confirmPasswordErrorSpan", 8, 50, 'Confirm Password must be filled.');
            break;
        case "emailExist":
            addRed("emailInput");
            deleteError("emailInput", "emailErrorSpan", 8, 50, 'Your Email-Address is not valid. Please check your input.');
            break;
        case "emailEmpty":
            addRed("emailInput");
            deleteError("emailInput", "emailErrorSpan", 8, 50, 'Email must be filled.');
            break;
        case "privacyPolicy":
            deleteError("acceptPrivacyPolicy", "privacyErrorSpan", -48, 50, 'Privacy policy must be accepted.');
            break;
    }
}



    function addRedBorder(id) {
        document.getElementById(id).classList.add("redBorder");
    }





// Auslösen bei "Enter"-Taste
emailInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        // checkEmailInput();
        checkEmailInput("emailInput",'emailErrorSpan',10,50,'Your Email-Address is not valid. Please check your input.');
    }
    if (emailInput.value != "") {
        clearErrorInput("emailInput", "emailErrorSpan");
    }
});


// Auslösen bei Backspace
// emailInput.addEventListener('keydown', function (event) {
//     if (event.key === 'Backspace') {
//         clearErrorInput("emailInput", "emailErrorSpan");
//     }
// });

nameInput.addEventListener('keydown', function (event) {
    if (nameInput.value != "") {
        clearErrorInput("nameInput", "nameErrorSpan");
    }
});

nameInput.addEventListener('blur', function (event) {
    if (nameInput.value != "") {
        clearErrorInput("nameInput", "nameErrorSpan");
    }
});

passwordInput.addEventListener('keydown', function (event) {
    if (passwordInput.value != "") {
        clearErrorInput("passwordInput", "passwordErrorSpan");
    }
});

// passwordInput.addEventListener('blur', function (event) {
//     if (passwordInput.value != "") {
//         clearErrorInput("passwordInput", "passwordErrorSpan");
//     }else{

//     }
// });
confirmInput.addEventListener('keydown', function (event) {
    if (passwordInput.value != "") {
        clearErrorInput("confirmPasswordInput", "confirmPasswordErrorSpan");
    }
});

// Auslösen beim Verlassen des Feldes (Blur)
emailInput.addEventListener('blur', function () {
    checkEmailInput("emailInput",'emailErrorSpan',10,50,'Your Email-Address is not valid. Please check your input.');
});

confirmInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        // showLockIconCreateAccount(this.id);
        createAccount();
    }
});



confirmInput.addEventListener('blur', function () {
    showLockIconCreateAccount(this.id);
});

function errorPositions(){

}

window.addEventListener("resize", errorPositions)