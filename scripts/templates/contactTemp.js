let dataLogin = "";
let dataContact = "";
let dataFull = "";
let userNumber = 0;
let groupedUsers = {};

function getContactsfromFirebase() {
    dataLogin = fireBaseContent.login;
    dataContact = fireBaseContent.contact;
    dataFull = { ...dataContact, ...dataLogin };

    sortUsers();

    const allContactsNav = document.getElementById("allContacts");
    allContactsNav.innerHTML = "";

    Object.keys(groupedUsers).forEach(letter => {
        const groupDiv = createGroupDiv(letter);

        groupedUsers[letter].forEach(user => {
            userNumber++;
            const userNav = createSingleUserNav(user, userNumber);
            groupDiv.appendChild(userNav);
        });

        allContactsNav.appendChild(groupDiv);
    });
}


function sortUsers() {
    const users = Object.values(dataFull).map(user => ({
        name: user.name,
        email: user.email,
        color: user.color,
        phone: user.phone
    }));

    users.sort((a, b) => {
        const firstNameA = a.name.split(" ")[0].toLowerCase();
        const firstNameB = b.name.split(" ")[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
    });

    // groupedUsers = {};

    users.forEach(user => {
        const firstLetter = user.name[0].toUpperCase();
        if (!groupedUsers[firstLetter]) {
            groupedUsers[firstLetter] = [];
        }
        groupedUsers[firstLetter].push(user);
    });
}

function createGroupDiv(letter) {
    const div = document.createElement("div");
    div.id = `capital${letter}`;
    div.classList.add("capital");

    const spanLetter = document.createElement("span");
    spanLetter.textContent = letter;
    spanLetter.classList.add("spanLetter");
    div.appendChild(spanLetter);

    const separator = document.createElement("div");
    separator.classList.add("separator");
    div.appendChild(separator);

    return div;
}

function createSingleUserNav(user, userNumber) {
    const nav = document.createElement("nav");
    nav.id = `singleUser${userNumber}`;
    nav.classList.add("singleUser");

    const initials = createUserInitials(user);
    const details = createUserDetails(user, userNumber);

    nav.appendChild(initials);
    nav.appendChild(details);
    addUserClickHandler(nav);

    return nav;
}

function createUserInitials(user) {
    const initials = document.createElement("span");
    initials.classList.add("userInitials");

    const colorClass = user.color
        ? `userColor-${user.color.replace('#', '')}`
        : "userColor-default";
    initials.classList.add(colorClass);

    initials.textContent = getInitials(user.name);
    return initials;
}

function createUserDetails(user, userNumber) {
    const userDetails = document.createElement("div");
    userDetails.classList.add("userDetails");

    const userName = document.createElement("span");
    userName.classList.add("userName");
    userName.textContent = user.name;

    const userEmail = document.createElement("a");
    userEmail.id = `singleUserMail${userNumber}`;
    userEmail.href = `mailto:${user.email}`;
    userEmail.classList.add("emailText");
    userEmail.textContent = user.email;

    userDetails.appendChild(userName);
    userDetails.appendChild(userEmail);
    return userDetails;
}

function addUserClickHandler(navElement) {
    navElement.addEventListener("click", () => {
        contactDetails(navElement.id);
    });
}


function getInitials(fullName) {
    if (!fullName) return "";
    return fullName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase();
}


