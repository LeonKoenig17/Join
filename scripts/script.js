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


function logout() {
    localStorage.setItem("user", "")
    localStorage.setItem("token", "")
    window.location = '../index.html';
}


function toasterPopup(element, target) {
    let mySpan = document.getElementById(element);
    mySpan.classList.remove("displayNone");
    setTimeout(() => {
        mySpan.style.top = '50%'; mySpan.style.transform = 'translate(-50%, -50%)';
    }, 500)

    setTimeout(() => {
        window.location = `${target}.html`;

    }, 2000)
}


function addHelpToPopup() {
    const windowWidth = window.innerWidth;
    try {
        if (windowWidth <= 800) {
            document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/help.html" class="userLinkOptionsLinks">Help</a>
        <a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
        } else {
            document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
        }
    } catch (error) {

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


function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function clearErrorInput(firstElement, secondElement) {
    // let email = document.getElementById("emailInput").value;
    hideError(firstElement, secondElement)

}


function checkEmailInput(firstElement, secondElement, setoffX, setOffY, errorText) {
    // let email = document.getElementById("emailInput").value;
    let email = document.getElementById(firstElement).value;
    if (email == "") { return }
    if (emailIsValid(email) == false) {
        // deleteError("emailInput", "emailErrorSpan", 10, 50, `Your Email-Address is not valid. Please check your input.`);
        deleteError(firstElement, secondElement, setoffX, setOffY, errorText);
        return
    } else {
        // hideError("emailInput", "emailErrorSpan")
        hideError(firstElement, secondElement)
    }
}

function checkEmailInputBackup() {
    let email = document.getElementById("emailInput").value;
    if (email == "") { return }
    if (emailIsValid(email) == false) {
        deleteError("emailInput", "emailErrorSpan", 10, 50, `Your Email-Address is not valid. Please check your input.`);
        return
    } else {
        hideError("emailInput", "emailErrorSpan")
    }
}

function hideError(firstType, secondType) {
    let element = document.getElementById(secondType);
    // element.classList.remove("displayNone")
    document.getElementById(firstType).classList.remove("redBorder")
    document.getElementById(secondType).classList.remove("visible")
}

function deleteError(firstType, secondType, setOffX, setOffY, errorText) {
    try {
        let element = document.getElementById(firstType);
        let position = element.getBoundingClientRect();
        let span = document.getElementById(secondType);
        document.getElementById(firstType).classList.add("redBorder")
        span.innerHTML = errorText
        span.classList.add("visible")
        span.style.left = Number.parseInt((position.left + setOffX)) + "px";
        span.style.top = Number.parseInt((position.top + setOffY)) + "px";
    } catch (error) {
        return null
    }
}

window.addEventListener("resize", addHelpToPopup)

let nameInput = document.getElementById('nameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput')
let confirmInput = document.getElementById('confirmPasswordInput')