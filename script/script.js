const BASE_URL = 'https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/'


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


    if(privacyBoolean =="false"){
        window.alert("Please confirm our Privacy Policy")
        return
    }

    let myValue = await findUser(email);


    if (myValue != null) {
        window.alert("Account already exists")
    } else {
        if (password == confirmPassword && password != "" && privacyBoolean == "true") {
            postData("login", { "name": userName, "email": email, "password": password })
            window.location = "./summary.html";
        } else {
            window.alert("Passwords do not match")
        }
    }
}
async function login() {
    let myValue = await checkPassword(document.getElementById("emailInput").value);
    let password = document.getElementById("passwordInput").value;

    if (password == myValue) {
        // window.alert("Login successfull")
        window.location = "./summary.html";
    } else {
        window.alert("Wrong Password")
        // window.location = "./login.html";

    }

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
        myChk.src = "./images/checkboxtrueblack.svg"
    } else {
        myChk.src = "./images/checkboxfalseblack.svg"
    }

}

function myFunction(){
    window.alert("hello worLd")
}