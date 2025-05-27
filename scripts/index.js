function onLoad() {
    moveLogo();
    loadFromFirebase();
}

function moveLogo() {
    const logoImg = document.getElementById('logoImg');
    const mainDiv = document.getElementById('main');

    const setStyles = (el, styles) => {
        for (let prop in styles) {
            el.style[prop] = styles[prop];
        }
    };

    const centerStyle = {display: 'none', width: '0px', height: '0px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
    const expandStyle = {display: 'unset',width: '200px',height: '200px',top: '50%',left: '50%',transform: 'translate(-50%, -50%)'};
    const smallLogoStyle = window.innerHeight > 900 ? { width: '80px', height: '96px', left: '90px', top: '98px' } : { width: '80px', height: '80px', left: '70px', top: '70px' };

    setTimeout(() => {if (window.innerWidth < 800) logoImg.src = '../images/joinlogowhite.svg';setStyles(logoImg, centerStyle);}, 0);
    setTimeout(() => {setStyles(logoImg, expandStyle);}, 500);
    setTimeout(() => {setStyles(logoImg, smallLogoStyle);}, 1500);
    setTimeout(() => {if (window.innerWidth < 800) logoImg.src = '../images/joinlogodark.svg';mainDiv.style.opacity = '1';}, 2000);
    setTimeout(() => {logoImg.classList.remove('animation');['width', 'height', 'left', 'top', 'transform'].forEach(prop => {logoImg.style.removeProperty(prop);});}, 3000);
}


// function moveLogo() {
//     let logoImg = document.getElementById('logoImg');
//     let mainDiv = document.getElementById('main');

//     setTimeout(() => {
//         window.innerWidth < 800 ? logoImg.src = '../images/joinlogowhite.svg' : ""
//         logoImg.style.display = 'none';
//         logoImg.style.width = '0px'; logoImg.style.height = '0px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
//     }, 0);

//     setTimeout(() => {
//         logoImg.style.display = 'unset';
//         logoImg.style.width = '200px'; logoImg.style.height = '200px'; logoImg.style.top = '50%'; logoImg.style.left = '50%'; logoImg.style.transform = 'translate(-50%, -50%)';
//     }, 500);

//     setTimeout(() => {
//         if (window.innerHeight > 900) {
//             logoImg.style.width = '80px'; logoImg.style.height = '96px'; logoImg.style.left = '90px'; logoImg.style.top = '98px';
//         } else {
//             logoImg.style.width = '80px'; logoImg.style.height = '80px'; logoImg.style.left = '70px'; logoImg.style.top = '70px';
//         }
//     }, 1500);

//     setTimeout(() => {
//         window.innerWidth < 800 ? logoImg.src = '../images/joinlogodark.svg' : ""
//         mainDiv.style.opacity = '1';
//     }, 2000);

//     setTimeout(() => {
//         logoImg.classList.remove("animation")
//         logoImg.style.removeProperty("width"); logoImg.style.removeProperty("height"); logoImg.style.removeProperty("left"); logoImg.style.removeProperty("top"); logoImg.style.removeProperty("transform")
//     }, 3000);


// }

// async function login() {
//     let emailInput = document.getElementById("emailInput");
//     let passwordInput = document.getElementById("passwordInput");

//     if (emailInput.value == "") {
//         showErrorNew("emailInput", "emailErrorSpan", 0, 0, "Email must be filled")
//     }

//     if (passwordInput.value == "") {
//         showErrorNew("passwordInput", "passwordErrorSpan", 0, 0, "Password must be filled")
//     }

//     let checkThisPassword = await checkPassword(emailInput.value);
//     let checkThisEmail = await findUser(emailInput.value);


//     if (checkThisEmail == null) {
//         document.getElementById("emailInput").classList.add("redBorder")
//         document.getElementById("loginFailErrorSpan").classList.add("visible")
//         document.getElementById("loginFailErrorSpan").innerHTML = 'No account found with this email.'
//         return
//     }
//     if (passwordInput.value == checkThisPassword) {
//         writeLocalStorage();
//         hideErrorNew("emailInput", "emailErrorSpan")
//         hideErrorNew("passwordInput", "passwordErrorSpan")
//         hideErrorNew("", "loginFailErrorSpan")
//         toasterPopup('loginSuccess', '../html/summary');
//     } else {
//         showErrorNew("loginButtonDiv", "loginFailErrorSpan", 0, 10, "Check your Email and password. Please try again.")
//         document.getElementById("passwordInput").classList.add("redBorder")
//         document.getElementById("emailInput").classList.add("redBorder")
//     }
// }

async function login() {
    const email = document.getElementById("emailInput");
    const password = document.getElementById("passwordInput");

    if (!validateFields(email, password)) return;

    const [user, correctPassword] = await fetchUserAndPassword(email.value);
    if (!user) return handleNoUserFound(email);

    if (password.value === correctPassword) {
        return handleLoginSuccess();
    }

    handleLoginFailure();
}

function validateFields(emailInput, passwordInput) {
    const emailValid = validateField(emailInput, "emailErrorSpan", "Email must be filled");
    const passwordValid = validateField(passwordInput, "passwordErrorSpan", "Password must be filled");
    return emailValid && passwordValid;
}

function validateField(input, errorSpanId, message) {
    if (input.value.trim() === "") {
        showErrorNew(input.id, errorSpanId, 0, 0, message);
        return false;
    }
    return true;
}

async function fetchUserAndPassword(email) {
    const [user, password] = await Promise.all([
        findUser(email),
        checkPassword(email)
    ]);
    return [user, password];
}

function handleNoUserFound(emailInput) {
    emailInput.classList.add("redBorder");
    const span = document.getElementById("loginFailErrorSpan");
    span.classList.add("visible");
    span.innerHTML = "No account found with this email.";
}

function handleLoginSuccess() {
    writeLocalStorage();
    hideErrorNew("emailInput", "emailErrorSpan");
    hideErrorNew("passwordInput", "passwordErrorSpan");
    hideErrorNew("", "loginFailErrorSpan");
    toasterPopup("loginSuccess", "../html/summary");
}

function handleLoginFailure() {
    ["emailInput", "passwordInput"].forEach(id =>
        document.getElementById(id).classList.add("redBorder")
    );
    showErrorNew("loginButtonDiv", "loginFailErrorSpan", 0, 10, "Check your Email and password. Please try again.");
}



async function guestLogin() {
    document.getElementById("emailInput").value = 'sofiam@gmail.com'
    document.getElementById("passwordInput").value = '123456789'
    localStorage.setItem("name", "sofiam@gmail.com");
    writeLocalStorage();
    toasterPopup('loginSuccess', '../html/summary');
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
    chkboxPrivacy = document.getElementById(element);
    let myValue = chkboxPrivacy.src.search("true") > 0 ? "true" : "false";

    if (myValue == "false") {
        chkboxPrivacy.src = "../images/checkboxtrueblack.svg"
        document.getElementById("signUpBtn").disabled = false
        document.getElementById("signUpBtn").removeAttribute("disabled")
    } else {
        chkboxPrivacy.src = "../images/checkboxfalseblack.svg"
        document.getElementById("signUpBtn").classList.add("disabled")
        document.getElementById("signUpBtn").disabled = true
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

