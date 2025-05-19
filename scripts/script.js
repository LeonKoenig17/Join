let ergebnisse = "";
let thisToken = "";


async function writeLocalStorage() {
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;

    localStorage.setItem("name", email)
    localStorage.setItem("token", myEmail)
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


function toasterPopup(element,target) {
    let mySpan = document.getElementById(element);
    mySpan.classList.remove("displayNone");
    setTimeout(() => {
        mySpan.style.top = '50%'; mySpan.style.transform = 'translate(-50%, -50%)';
    }, 500)

    setTimeout(() => {
        window.location = `${target}.html`;
        
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

function addHelpToPopup() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 800) {
        document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/help.html" class="userLinkOptionsLinks">Help</a>
        <a href="../html/legal-notice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacy-policy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
    } else {
        document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/legal-notice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacy-policy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
    }
}


function getCurrentHTML() {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    const nav = document.getElementById('linkNav');

    if (nav) {
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const img = link.querySelector('img');

            if (link.href.search(page) > 0) {
                link.classList.add("active")
                img.src = img.getAttribute('src').replace('gray', 'white')
            } else {
                link.classList.remove("active")
                img.src = img.getAttribute('src').replace('white', 'gray')
            }
        });
}
}

window.addEventListener("resize", addHelpToPopup)