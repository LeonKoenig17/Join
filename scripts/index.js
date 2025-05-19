function onLoad() {
    moveLogo();
    loadFromFirebase();
}

function moveLogo() {
    let logoImg = document.getElementById('logoImg');
    let mainDiv = document.getElementById('main');

    console.log("moveLogo");

    setTimeout(() => {
        window.innerWidth < 800 ? logoImg.src = '../images/joinlogowhite.svg' : ""
        logoImg.style.display = 'none';
        logoImg.style.width = '0px'; logoImg.style.height = '0px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
    }, 0);

    setTimeout(() => {
        logoImg.style.display = 'unset';
        logoImg.style.width = '200px'; logoImg.style.height = '200px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
    }, 500);

    setTimeout(() => {
        logoImg.style.width = '80px'; logoImg.style.height = '96px'; logoImg.style.left = 'calc(50px + 40px)'; logoImg.style.top = 'calc(50px + 48px)';
    }, 1500);

    setTimeout(() => {
        window.innerWidth < 800 ? logoImg.src = '../images/joinlogodark.svg' : ""
        mainDiv.style.opacity = '1';
    }, 2000);
}

async function login() {
    let myPassword = await checkPassword(document.getElementById("emailInput").value);
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (myEmail == null) {
        document.getElementById("passwordInput").classList.add("redBorder")
        document.getElementById("emailInput").classList.add("redBorder")
        document.getElementById("errorSpan").classList.remove("displayNone")
        document.getElementById("errorSpan").innerHTML = 'No account found with this email.'
        return
    }
    if (password == myPassword) {
        writeLocalStorage();
        toasterPopup('loginSuccess','../html/summary');
    } else {
        document.getElementById("passwordInput").classList.add("redBorder")
        document.getElementById("emailInput").classList.add("redBorder")
        document.getElementById("errorSpan").classList.remove("displayNone")
        document.getElementById("errorSpan").innerHTML = 'Check your Email and password. Please try again.'

    }
}

async function guestLogin() {
    document.getElementById("emailInput").value = 'sofiam@gmail.com'
    document.getElementById("passwordInput").value = '123456789'

    writeLocalStorage();
    toasterPopup('loginSuccess','../html/summary');
}


async function checkPassword(email) {
    let ergebnisse = fireBaseContent.login;
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
            return ergebnisse[userId].password;
        }
    }
    return null;
}


function acceptPrivacyPolicy(element) {
    let myChk = document.getElementById(element);
    let myValue = myChk.src.search("true") > 0 ? "true" : "false";

    if (myValue == "false") {
        myChk.src = "../images/checkboxtrueblack.svg"
        document.getElementById("signUpBtn").classList.remove("disabled")
        document.getElementById("signUpBtn").removeAttribute("disabled")
    } else {
        myChk.src = "../images/checkboxfalseblack.svg"
        document.getElementById("signUpBtn").classList.add("disabled")
        document.getElementById("signUpBtn").setAttribute("disabled")
    }
}


function passwordVisibility(element) {
    let myContent = document.getElementById(element);
    let myInputContent = element.replace("Img", "Input");
    myInputContent = document.getElementById(myInputContent);

    let myValue = myContent.src.search("on") > 0 ? "true" : "false";

    if (myValue == "true") {
        myContent.src = "../images/visibilityoff.svg"
        myInputContent.type = "text";
    } else {
        myContent.src = "../images/visibilityon.svg"
        myInputContent.type = "password";
    }
}


function changeIconToVisibility(element) {
    let myInputContent = element.replace("Input", "Img");
    myInputContent = document.getElementById(myInputContent);
    myInputContent.src = "../images/visibilityon.svg"
}


function showLockIconCreateAccount(element) {
    let myContent = document.getElementById(element);
    let myInputContent = element.replace("Input", "Img");
    let password = document.getElementById("passwordInput").value;
    let confirmPassword = document.getElementById("confirmPasswordInput").value;
    myInputContent = document.getElementById(myInputContent)

    if (myContent.value.length == 0) {
        myInputContent.src = "../images/lock.svg"
    }

    if (password != confirmPassword && element == "confirmPasswordInput") {
        document.getElementById("confirmPasswordInput").classList.add("redBorder")
        deleteError("confirmPasswordInput", "passwordErrorSpan", 10, 50, `Your passwords don't match. Please try again.`);
    } else {
        hideError("confirmPasswordInput", "passwordErrorSpan")
    }
}


function showLockIconLogin(element) {
    let myContent = document.getElementById(element);
    let myInputContent = element.replace("Input", "Img");
    myInputContent = document.getElementById(myInputContent)

    if (myContent.value.length == 0) {
        myInputContent.src = "../images/lock.svg"
    }
}


document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const blueBtn = document.querySelector('.blueBtn');
        if (blueBtn) {
            blueBtn.click();
        }
    }
});