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
        ergebnisseContacts = fireBaseContent.contacts;
    } catch (error) {
        ergebnisseLogin = await loadData("login")
        ergebnisseContacts = await loadData("contacts")
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

function showUserLinksOptions() {
    document.getElementById("userLinkOptions").classList.toggle("hide")
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

async function showContactForm(type) {
    let contact = document.getElementById(`${type}Contact`);
    let contactDiv = document.getElementById(`${type}ContactDiv`);

    contact.classList.remove("hide");
    contactDiv.classList.remove("hide");

    // document.getElementById(contactDiv).classList.remove("hide");

    setTimeout(() => {
        contactDiv.style.backgroundColor = 'rgba(100, 100, 100, 0.0)'
        contact.style.left = '100%';
        contact.style.top = '50%';
        contact.style.transform = 'translate(0%, -50%)';
    }, 0);

    setTimeout(() => {
        contactDiv.style.backgroundColor = 'rgba(100, 100, 100, 0.5)'
        contact.style.left = '50%';
        contact.style.top = '50%';
        contact.style.transform = 'translate(-50%, -50%)';
    }, 250);

    // === Werte an editContact übergeben ===
    if (type === 'edit') {
        const name = document.getElementById('contactDetailsName')?.innerText || '';
        const email = document.getElementById('contactDetailsMail')?.innerText || '';
        const phone = document.getElementById('contactDetailsPhone')?.innerText || '';

        // Direkt auf contentWindow zugreifen, wenn iframe schon geladen ist
        const iframe = document.getElementById('editContact');

        thisToken = await findUser(email);

        iframe.contentWindow.postMessage({
            type: 'tokenUpdate',
            token: thisToken
        }, '*');

        
        // Wenn das iframe noch lädt, warte darauf
        iframe.onload = () => {
            try {
                const doc = iframe.contentWindow.document;
                doc.getElementById('nameInput').value = name;
                doc.getElementById('emailInput').value = email;
                doc.getElementById('phoneInput').value = phone;
            } catch (e) {
                console.error("Fehler beim Zugriff auf editContact iframe:", e);
            }
        };

        // Falls iframe schon geladen ist (onload wird dann nicht mehr aufgerufen)
        if (iframe.contentWindow.document.readyState === 'complete') {
            try {
                const doc = iframe.contentWindow.document;
                doc.getElementById('nameInput').value = name;
                doc.getElementById('emailInput').value = email;
                doc.getElementById('phoneInput').value = phone;
            } catch (e) {
                console.error("Fehler beim direkten Zugriff auf editContact iframe:", e);
            }
        }
    }
}


function hideContactForm(type) {
    let contact = document.getElementById(`${type}Contact`);
    // let contactDiv = document.getElementById(`${type}ContactDiv`);

    contact.classList.add("hide");
    document.getElementById("addContactDiv").classList.add("hide");
}




async function addContactTask() {
    let thisName = document.getElementById("nameInput").value;
    let thisEmail = document.getElementById("emailInput").value;
    let thisPhone = document.getElementById("phoneInput").value;

    let nextcolor = await lastColor();
    if (thisName == "" && thisEmail == "" && thisPhone == "") {
        return null;
    } else {
        await postData(`contacts`, { "name": thisName, "email": thisEmail, "phone": thisPhone, "color": nextcolor, "type": "contact" })
    }

}

async function contactDetails(element) {
    let thenum = element.match(/\d+/)[0];
    let thisemail = document.getElementById(`singleUserMail${thenum}`).innerHTML
    let thiscontactDetail = await getContactDetails(thisemail)
    const thisInitials = thiscontactDetail.name.split(" ").map(w => w[0].toUpperCase()).join("");

    let thisColor = thiscontactDetail.color.replace("#", "");

    document.getElementById("contentRight").classList.remove("hide")
    document.getElementById("contactDetailsInitials").removeAttribute("class");
    document.getElementById("contactDetailsInitials").classList.add(`userInitialsBig`);
    document.getElementById("contactDetailsInitials").classList.add(`userColor-${thisColor}`);
    document.getElementById("contactDetailsInitials").innerHTML = thisInitials;
    document.getElementById("contactDetailsName").innerHTML = thiscontactDetail.name;
    document.getElementById("contactDetailsMail").innerHTML = thiscontactDetail.email;
    document.getElementById("contactDetailsPhone").innerHTML = thiscontactDetail.phone;
}

async function getContactDetails(emailToFind) {
    const dataLogin = await loadData("login");
    const dataContacts = await loadData("contacts");
    const data = { ...dataContacts, ...dataLogin };
    let contactDetail = {};

    for (const [key, value] of Object.entries(data)) {
        if (value.email === emailToFind) {
            contactDetail = { "name": value.name, "email": value.email, "color": value.color, "phone": value.phone }
            console.log(contactDetail);
            return contactDetail;
        }
    }
    return null;
}

function consolelog() {
    console.log('test')
}