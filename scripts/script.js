function onloadFunc() {
    console.log("test")
    // loadData("login") // holt datensatz
    // postData("login",{"ach":"du scheisse"}) // schreibt datensatz
    //deleteData("login/-OMkJuc3knfDkLsczsu7") //löscht datensatz
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return resonseToJson = await response.json();
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let resonseToJson = await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
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
            await postData("login", { "name": userName, "email": email, "password": password, "color": nextcolor })
            await writeLocalStorage();
            showSuccess('signUpSuccess');
        } else {
            document.getElementById("confirmPasswordInput").classList.add("redBorder")
        }
    }
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
        await writeLocalStorage();
        showSuccess('loginSuccess');
    } else {
        document.getElementById("passwordInput").classList.add("redBorder")
        document.getElementById("emailInput").classList.add("redBorder")
        document.getElementById("errorSpan").classList.remove("displayNone")
        document.getElementById("errorSpan").innerHTML = 'Check your Email and password. Please try again.'

    }

}

async function writeLocalStorage() {
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;

    localStorage.setItem("user", email)
    localStorage.setItem("token", myEmail)
}

function guestLogin() {
    document.getElementById("emailInput").value = 'sofiam@gmail.com'
    document.getElementById("passwordInput").value = '123456789'

    setTimeout(() => {
        window.location = '../html/summary.html'
    }, 1500);

}

async function checkPassword(email) {
    let ergebnisse = await loadData("login")
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
            return ergebnisse[userId].password;
        }
    }
    return null;
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
    let ergebnisse = await loadData("login")
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
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

function showUserLinksOptions() {
    document.getElementById("userLinkOptions").classList.toggle("hide")
}

function logout() {
    localStorage.setItem("user", "")
    localStorage.setItem("token", "")
    window.location = '../index.html';
}

function onLoad() {
    let logoImg = document.getElementById('logoImg');
    let mainDiv = document.getElementById('main');

    setTimeout(() => {
        logoImg.style.width = '0px'; logoImg.style.height = '0px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
    }, 0);

    setTimeout(() => {
        logoImg.style.width = '200px'; logoImg.style.height = '200px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
    }, 500);

    setTimeout(() => {
        logoImg.style.width = '80px'; logoImg.style.height = '96px'; logoImg.style.left = 'calc(50px + 40px)'; logoImg.style.top = 'calc(50px + 48px)';
    }, 1500);

    setTimeout(() => {
        mainDiv.style.opacity = '1';
    }, 2000);
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
        document.getElementById("errorSpan").classList.remove("displayNone")
    } else {
        document.getElementById("confirmPasswordInput").classList.remove("redBorder")
        document.getElementById("errorSpan").classList.add("displayNone")
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

async function lastColor() {
    let ergebnisse = await loadData("login")
    let result = Object.entries(ergebnisse);
    let myLastColor = result.pop()[1].color;
    let found = usercolors.indexOf(myLastColor);

    if (found == (usercolors.length - 1)) { found = 0 } else { found = found + 1 }
    return usercolors[found];

}

async function fillUserLinks() {
    let myToken = localStorage.getItem('token')
    let myValue = await loadData('login')
    let myName = myValue[myToken].name;
    const initials = myName.split(" ").map(w => w[0].toUpperCase()).join("");

    document.getElementById("userLink").innerHTML = initials;
    try {
        document.getElementById("userName").innerHTML = myName;
    } catch (error) {
        return null;
    }

}

function showAddContact() {
    let addContact = document.getElementById('addContact');
    let addContactDiv = document.getElementById("addContactDiv")
    
    addContact.classList.remove("hide")
    addContactDiv.classList.remove("hide")

    setTimeout(() => {
        addContact.style.left = '100%';
        addContact.style.top = '50%';
        addContact.style.transform = 'translate(0%, -50%)';
    }, 0);

    setTimeout(() => {
        addContact.style.left = '50%';
        addContact.style.top = '50%';
        addContact.style.transform = 'translate(-50%, -50%)';
    }, 250);
}

function hideAddContact() {
    const parentWindow = window.parent;
    const addContact = parentWindow.document.getElementById('addContact');
    const addContactDiv = parentWindow.document.getElementById('addContactDiv');

    addContact.classList.add("hide")    
    addContact.style.left = '100%';
    addContact.style.top = '50%';
    addContact.style.transform = 'translate(0%, -50%)';

    addContactDiv.classList.add("hide")

}