let ergebnisse = "";
let thisToken = "";
let nameInput = document.getElementById('nameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput')
let confirmInput = document.getElementById('confirmPasswordInput')

/**
 * writes and saves data to local storage
 */
async function writeLocalStorage() {
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;

    localStorage.setItem("name", email)
    localStorage.setItem("token", myEmail)
}

/**
 * finds the name of the user that is being loaded
 * 
 * @param {String} name 
 */
async function findName(name) {
    let ergebnisse = await loadData("login")
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].name === name) {
            return userId;
        }
    }
    return null;
}

/**
 * finds the user in the database based on the email
 * 
 * @param {String} email
 */
async function findUser(email) {
  email = email.toLowerCase();
  let login = fireBaseContent.login, contact = fireBaseContent.contact;

  if (!login || !contact) {
    login = await loadData("login");
    contact = await loadData("contact");
  }

  const allUsers = { ...login, ...contact };
  for (const id in allUsers) {
    if (allUsers[id].email === email) return id;
  }
  return null;
}


/**
 * logs out the current user and deletes data saves in local storage
 */
function logout() {
    localStorage.setItem("user", "")
    localStorage.setItem("token", "")
    window.location = '../index.html';
}

/**
 * displays a popup at target location
 * 
 * @param {HTMLElement} element 
 * @param {HTMLElement} target 
 */
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

/**
 * adds the popup to the site based on window dimensions
 */
function addHelpToPopup() {
  const width = window.innerWidth;
  const container = document.getElementById("userLinkOptions");
  if (!container) return;

  try {
    container.innerHTML = width <= 800
      ? `<a href="../html/help.html" class="userLinkOptionsLinks">Help</a>
         <a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
         <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
         <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>`
      : `<a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
         <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
         <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>`;
  } catch (e) {}
}


/**
 * gets the current url path and modifies it
 */
function getCurrentHTML() {
  const page = window.location.pathname.split("/").pop();
  const nav = document.getElementById('linkNav');
  if (!nav) return;

  nav.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    const img = link.querySelector('img');
    if (!img) return;

    if (link.href.includes(page)) {
      link.classList.add("active");
      img.src = img.src.replace('gray', 'white');
    } else {
      link.classList.remove("active");
      img.src = img.src.replace('white', 'gray');
    }
  });
}



function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

