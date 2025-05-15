let ergebnisse = "";
let thisToken = "";

function onLoad() {
    moveLogo()
    loadFromFirebase()
}

function moveLogo() {
    let logoImg = document.getElementById('logoImg');
    let mainDiv = document.getElementById('main');
    setTimeout(() => {
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
        mainDiv.style.opacity = '1';
    }, 2000);
}

// function onloadFunc() {
// console.log("test")
// loadData("login") // holt datensatz
// postData("login",{"ach":"du scheisse"}) // schreibt datensatz
//deleteData("login/-OMkJuc3knfDkLsczsu7") //löscht datensatz
// }






async function writeLocalStorage() {
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;

    localStorage.setItem("user", email)
    localStorage.setItem("token", myEmail)
}

async function guestLogin() {
    document.getElementById("emailInput").value = 'sofiam@gmail.com'
    document.getElementById("passwordInput").value = '123456789'

    writeLocalStorage();

    setTimeout(() => {
        window.location = '../html/summary.html'
    }, 1500);

}



async function findName(name) {
    let ergebnisse = await loadData("login")
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].name === name) {
            return userId;
        }
    }
    return null;
}

async function findUser(email) {
    let ergebnisseLogin = ""
    let ergebnisseContacts = ""
    // console.log(fireBaseContent);

    try {
        ergebnisseLogin = fireBaseContent.login;
        ergebnisseContacts = fireBaseContent.contact;
    } catch (error) {
        ergebnisseLogin = await loadData("login")
        ergebnisseContacts = await loadData("contact")
    }
    ergebnisse = { ...ergebnisseLogin, ...ergebnisseContacts }
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
            // return ergebnisse[userId];
            return userId;
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



function logout() {
    localStorage.setItem("user", "")
    localStorage.setItem("token", "")
    window.location = '../index.html';
}




function showSuccess(element) {
    let mySpan = document.getElementById(element);
    mySpan.classList.remove("displayNone");

    setTimeout(() => {
        mySpan.style.top = '50%'; mySpan.style.transform = 'translate(-50%, -50%)';
    }, 500)

    setTimeout(() => {
        window.location = "../html/summary.html";
    }, 2000)
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
        // document.getElementById("emailErrorSpan").classList.remove("displayNone")
        deleteError("confirmPasswordInput", "passwordErrorSpan", 10, 50, `Your passwords don't match. Please try again.`);
    } else {
        // document.getElementById("confirmPasswordInput").classList.remove("redBorder")
        // document.getElementById("emailErrorSpan").classList.add("displayNone")
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



function showContactFormOld(type) {
    let contact = document.getElementById(`${type}Contact`);
    let contactDiv = document.getElementById(`${type}ContactDiv`);
    
    contact.classList.remove("hide");
    document.getElementById("addContactDiv").classList.remove("hide");

    setTimeout(() => {
        contact.style.left = '100%';
        contact.style.top = '50%';
        contact.style.transform = 'translate(0%, -50%)';
    }, 0);

    setTimeout(() => {
        contact.style.left = '50%';
        contact.style.top = '50%';
        contact.style.transform = 'translate(-50%, -50%)';
    }, 250);
}














function consolelog(element) {
    console.log(element)
}