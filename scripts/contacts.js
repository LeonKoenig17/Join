
let fireBaseContent = {}
let dataLogin = "";
let dataContact = ""
let dataFull = "";
// let thisToken = "";

async function loadFromFirebase() {
    fireBaseContent = await loadData();
}

async function onloadContacts() {
    await loadFromFirebase();
    fillUserLinks();
    getContactsfromFirebase();
    sendDataToIframe();
}




function sendDataToIframe() {
    const iframe = document.getElementById('editContact');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
            {
                type: 'firebaseData',
                data: fireBaseContent,
                token: thisToken,
                ergebnisse: ergebnisse
            },
            '*'
        );
    }
}

async function contactForm(task, type) {

    let thisEmail = '';

    if (type == "edit") {
        thisEmail = document.getElementById("emailInput").value;
    } else {
        thisEmail = document.getElementById("contactDetailsMail").innerHTML;
    }

    if (task == 'add') {
        await addContactTask();
        window.parent.location.reload();
        return null
    }

    if (task == 'delete') {
        thisToken = await findUser(thisEmail);
        if (dataFull[thisToken].type == "login") {
            (type === 'edit') ? deleteError("leftBtn", 18, 50) : deleteError("deleteIcon", 18, 30);
            return null;
        } else {
            await deleteData(`contact/${thisToken}`)
            window.parent.location.reload();
        }
    }

    if (task == 'save') {

        // let thisEmail = document.getElementById("emailInput").value;
        let thisPhone = document.getElementById("phoneInput").value;
        let thisName = document.getElementById("nameInput").value;

        thisToken = await findUser(thisEmail);

        if (ergebnisse[thisToken].type == "contact") {
            myData = { "name": thisName, "email": thisEmail, "phone": thisPhone };
        } else {
            myData = { "name": thisName, "phone": thisPhone };
        }
        // await patchData(`${ergebnisse[thisToken].type}/${thisToken}`, { "name": thisName, "email": thisEmail, "phone": thisPhone })
        await patchData(`${ergebnisse[thisToken].type}/${thisToken}`, myData)

        window.parent.location.reload();
    }
}


function changeImage(element) {
    document.getElementById("leftBtnImg").src = `../images/cancel${element}.svg`;
}


function hideContactForm(type) {
    let background = document.getElementById("manipulateContactBackground")
    let frame = document.getElementById("addContactFrame")
    background.removeAttribute("class")
    background.classList.add("visibleNone");
    frame.removeAttribute("class")
    frame.classList.add("visibleNone");
    document.getElementById("deleteError").classList.add("hide")
}

async function showContactForm(task) {
    // let contact = document.getElementById(`${type}Contact`);
    // let contactDiv = document.getElementById(`${type}ContactDiv`);
    
    let myToken = localStorage.getItem("token")
    if (thisToken && myToken != thisToken && dataFull[thisToken].type === "login" && task != 'add') {
        deleteError("editIcon", 18, 30);
        return null;
    }

    let background = document.getElementById("manipulateContactBackground")
    let frame = document.getElementById("addContactFrame")

    background.classList.add("showManipualteFormBackground")
    frame.classList.add("showManipualteFormFrame")

    background.classList.remove("visibleNone")
    frame.classList.remove("visibleNone")

    contactFormBtn(task);




    if (task === 'edit') {
        let name = document.getElementById("contactDetailsName").innerHTML;
        let email = document.getElementById("contactDetailsMail").innerHTML;
        let phone = document.getElementById("contactDetailsPhone").innerHTML;
        document.getElementById("nameInput").value = name
        document.getElementById("emailInput").value = email
        document.getElementById("phoneInput").value = phone
        return null
    }


}

function contactFormBtn(type) {
    let leftBtn = document.getElementById("leftBtn");
    let rightBtn = document.getElementById("rightBtn");
    if (type == "edit") {
        leftBtn.innerHTML = `Delete<img id="leftBtnImg" src="../images/canceldarkblue.svg" alt="" class="marginLeft10">`;
        leftBtn.setAttribute('onclick', 'contactForm("delete","edit")')
        rightBtn.innerHTML = `Save<img src="../images/check.svg" alt="" class="marginLeft10">`;
        rightBtn.setAttribute('onclick', 'contactForm("save","edit")')
    }
    else {
        leftBtn.innerHTML = `Cancel<img id="leftBtnImg" src="../images/canceldarkblue.svg" alt="" class="marginLeft10">`;
        leftBtn.setAttribute('onclick', 'hideContactForm("add")')
        rightBtn.innerHTML = `Create Contact<img src="../images/check.svg" alt="" class="marginLeft10">`;
        rightBtn.setAttribute('onclick', 'contactForm("add","add")')
    }
}

async function addContactTask() {
    let thisName = document.getElementById("nameInput").value;
    let thisEmail = document.getElementById("emailInput").value;
    let thisPhone = document.getElementById("phoneInput").value;

    let nextcolor = await lastColor();
    if (thisName == "" && thisEmail == "" && thisPhone == "") {
        return null;
    } else {
        await postData(`contact`, { "name": thisName, "email": thisEmail, "phone": thisPhone, "color": nextcolor, "type": "contact" })
    }

}



async function contactDetails(element) {
    let thenum = element.match(/\d+/)[0];
    let thisemail = document.getElementById(`singleUserMail${thenum}`).innerHTML
    let thiscontactDetail = await getContactDetails(thisemail)
    let thisInitials = getInitials(thiscontactDetail.name);
    let thisColor = thiscontactDetail.color.replace("#", "");

    document.getElementById("contentRight").classList.remove("hide")
    document.getElementById("contactDetailsInitials").removeAttribute("class");
    document.getElementById("contactDetailsInitials").classList.add(`userInitialsBig`);
    document.getElementById("contactDetailsInitials").classList.add(`userColor-${thisColor}`);
    document.getElementById("contactDetailsInitials").innerHTML = thisInitials;
    document.getElementById("contactDetailsName").innerHTML = thiscontactDetail.name;
    document.getElementById("contactDetailsMail").innerHTML = thiscontactDetail.email;
    document.getElementById("contactDetailsPhone").innerHTML = thiscontactDetail.phone;
    document.getElementById("deleteError").classList.add("hide")
    thisToken = await findUser(thiscontactDetail.email);
}

function deleteError(type, setOffX, setOffY) {
    try {
        let element = document.getElementById(type);
        let position = element.getBoundingClientRect();
        let span = document.getElementById("deleteError");
        if(type === 'editIcon'){
            span.innerHTML = `You can't edit<br>other registered users`
        }else{
            span.innerHTML = `You can't delete<br>other registered users`
        }
        span.classList.remove("hide")
        span.style.left = Number.parseInt((position.left + setOffX)) + "px";
        span.style.top = Number.parseInt((position.top + setOffY)) + "px";
    } catch (error) {
        return null
    }
}

async function getContactDetails(emailToFind) {

    try {
        dataLogin = fireBaseContent.login;
        dataContact = fireBaseContent.contact;
    } catch (error) {
        dataLogin = await loadData("login");
        dataContact = await loadData("contact");
    }
    // const dataLogin = await loadData("login");
    // const dataContacts = await loadData("contacts");

    dataFull = { ...dataContact, ...dataLogin };

    let contactDetail = {};

    for (const [key, value] of Object.entries(dataFull)) {
        if (value.email === emailToFind) {
            contactDetail = { "name": value.name, "email": value.email, "color": value.color, "phone": value.phone }
            return contactDetail;
        }
    }
    return null;
}

