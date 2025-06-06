/**
 * Executes on page load, initializing the logo animation and loading data from Firebase.
 */
function onLoad() {
    moveLogo();
    loadFromFirebase();
}


/**
 * Animates the logo on the page, transitioning through different styles and positions.
 */
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


/**
 * Handles the login process by validating fields, fetching user data, and verifying credentials.
 */
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


/**
 * Validates the email and password input fields.
 * @param {HTMLElement} emailInput - The email input field.
 * @param {HTMLElement} passwordInput - The password input field.
 * @returns {boolean} True if both fields are valid, otherwise false.
 */
function validateFields(emailInput, passwordInput) {
    const emailValid = validateField(emailInput, "emailErrorSpan", "Email must be filled");
    const passwordValid = validateField(passwordInput, "passwordErrorSpan", "Password must be filled");
    return emailValid && passwordValid;
}


/**
 * Validates a single input field and displays an error message if invalid.
 * @param {HTMLElement} input - The input field to validate.
 * @param {string} errorSpanId - The ID of the error message span.
 * @param {string} message - The error message to display.
 * @returns {boolean} True if the field is valid, otherwise false.
 */
function validateField(input, errorSpanId, message) {
    if (input.value.trim() === "") {
        showError(input.id, errorSpanId, message);
        return false;
    }
    return true;
}


/**
 * Asynchronously fetches the user object and password for a given email.
 *
 * @async
 * @function fetchUserAndPassword
 * @param {string} email - The email address of the user to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array containing the user object and the user's password.
 */
async function fetchUserAndPassword(email) {
    const [user, password] = await Promise.all([
        findUser(email),
        checkPassword(email)
    ]);
    return [user, password];
}


/**
 * Handles the case where no user is found for the given email.
 * @param {HTMLElement} emailInput - The email input field.
 */
function handleNoUserFound(emailInput) {
    emailInput.classList.add("redBorder");
    const span = document.getElementById("loginFailErrorSpan");
    span.classList.add("visible");
    span.innerHTML = "No account found with this email.";
}


/**
 * Handles a successful login by storing user data and redirecting to the summary page.
 */
function handleLoginSuccess() {
    writeLocalStorage();
    hideError("emailInput", "emailErrorSpan");
    hideError("passwordInput", "passwordErrorSpan");
    hideError("", "loginFailErrorSpan");
    toasterPopup("loginSuccess", "../html/summary");
}

/**
 * Handles a failed login attempt by displaying error messages.
 */
function handleLoginFailure() {
    ["emailInput", "passwordInput"].forEach(id =>
        document.getElementById(id).classList.add("redBorder")
    );
    showError("loginButtonDiv", "loginFailErrorSpan", "Check your Email and password. Please try again.");
}


/**
 * Logs in as a guest user by pre-filling credentials and redirecting to the summary page.
 */
async function guestLogin() {
    document.getElementById("emailInput").value = 'sofiam@gmail.com'
    document.getElementById("passwordInput").value = '123456789'
    localStorage.setItem("name", "sofiam@gmail.com");
    writeLocalStorage();
    toasterPopup('loginSuccess', '../html/summary');
}


/**
 * Checks the password for the given email in Firebase.
 * @param {string} email - The email address to check.
 * @returns {Promise<string|null>} The password if found, otherwise null.
 */
async function checkPassword(email) {
    email = email.toLowerCase();
    let ergebnisse = fireBaseContent.login;
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
            return ergebnisse[userId].password;
        }
    }
    return null;
}


/**
 * Toggles the privacy policy acceptance checkbox and updates the sign-up button state.
 * @param {string} element - The ID of the privacy policy checkbox element.
 */
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


/**
 * Toggles the visibility of the password input field.
 * @param {string} element - The ID of the visibility toggle element.
 */
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


/**
 * Changes the icon to indicate password visibility.
 * @param {string} element - The ID of the password input field.
 */
function changeIconToVisibility(element) {
    let myInputContent = element.replace("Input", "Img");
    myInputContent = document.getElementById(myInputContent);
    myInputContent.src = "../images/visibilityon.svg"
}


/**
 * Updates the lock icon for the create account form based on password input.
 * @param {string} element - The ID of the password input field.
 */
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


/**
 * Updates the lock icon for the login form based on password input.
 * @param {string} element - The ID of the password input field.
 */
function showLockIconLogin(element) {
    let myContent = document.getElementById(element);
    let myInputContent = element.replace("Input", "Img");
    myInputContent = document.getElementById(myInputContent)

    if (myContent.value.length == 0) {
        myInputContent.src = "../images/lock.svg"
    }
}

