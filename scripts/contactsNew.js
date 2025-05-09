
let fireBaseContent = {}

async function loadFromFirebase() {
    fireBaseContent = await loadData();
}

async function onloadContacts() {
    await loadFromFirebase();
    fillUserLinks();
    getContactsfromFirebase();
    sendDataToIframe();
}

function getContactsfromFirebase() {
    // const dataLogin = await loadData("login");
    const dataLogin = fireBaseContent.login;
    // const dataContacts = await loadData("contacts");
    const dataContacts = fireBaseContent.contacts;
    const data = { ...dataContacts, ...dataLogin }

    const users = Object.values(data).map(user => ({
        name: user.name,
        email: user.email,
        color: user.color,
        phone: user.phone
    }));

    console.log(users)
    // Alphabetisch nach Vornamen sortieren
    users.sort((a, b) => {
        const firstNameA = a.name.split(" ")[0].toLowerCase();
        const firstNameB = b.name.split(" ")[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
    });

    console.log(typeof (users))

    // Gruppieren nach Anfangsbuchstabe des Vornamens
    const groupedUsers = {};

    users.forEach(user => {
        const firstLetter = user.name[0].toUpperCase();

        if (!groupedUsers[firstLetter]) {
            groupedUsers[firstLetter] = [];
        }

        groupedUsers[firstLetter].push(user);
    });

    // HTML für das "allContacts" nav erstellen
    const allContactsNav = document.getElementById("allContacts");
    // allContactsNav.innerHTML = '';

    let userNumber = 0;
    // Iteriere über die gruppierten Benutzer
    Object.keys(groupedUsers).forEach(letter => {
        // Erstelle das div für die Gruppe (A, B, C, ...)
        const capitalDiv = document.createElement("div");
        capitalDiv.id = `capital${letter}`;
        capitalDiv.classList.add("capital");

        // Füge den Buchstaben hinzu
        const spanLetter = document.createElement("span");
        spanLetter.textContent = letter;
        spanLetter.classList.add("spanLetter")
        capitalDiv.appendChild(spanLetter);

        // Füge die Trennlinie hinzu
        const separator = document.createElement("div");
        separator.classList.add("separator");
        capitalDiv.appendChild(separator);

        // Iteriere über die Benutzer in der Gruppe
        groupedUsers[letter].forEach(user => {
            userNumber = userNumber + 1;

            const userNav = document.createElement("nav");
            userNav.id = `singleUser${userNumber}`;
            userNav.classList.add(`singleUser`);

            // Initialen erstellen
            const initials = document.createElement("span");
            initials.classList.add("userInitials");
            initials.classList.add(`userColor-${user.color.replace('#', '')}`);
            initials.textContent = user.name.split(" ").map(name => name[0]).join("");
            userNav.appendChild(initials);

            // Benutzerdetails erstellen
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
            userNav.appendChild(userDetails);

            // Füge die Klick-Funktion hinzu, die die contactDetails-Funktion aufruft
            userNav.addEventListener('click', () => {
                contactDetails(userNav.id); // Die Funktion contactDetails mit dem userNav-Element aufrufen
            });

            // Füge das Benutzer-Navi zu der Gruppe hinzu
            capitalDiv.appendChild(userNav);
        });



        // Füge die Gruppe zum allContacts div hinzu
        allContactsNav.appendChild(capitalDiv);
    });
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
    const parentWindow = window.parent;
    const addContact = document.getElementById(`${type}Contact`);
    const addContactDiv = document.getElementById('addContactDiv');
    const allContactsDiv = document.getElementById('allContacts');
    let thisEmail = '';

    addContact.classList.add("hide")
    addContact.style.left = '100%';
    addContact.style.top = '50%';
    addContact.style.transform = 'translate(0%, -50%)';
    addContactDiv.classList.add("hide")

    if (task == 'add') {
        await addContactTask();
        window.parent.location.reload();
        return null
    }

    try {
        thisEmail = document.getElementById("emailInput").value;
    } catch (error) {
        thisEmail = document.getElementById("contactDetailsMail").innerHTML;
    }
    // let thisToken = await findUser(thisEmail);

    if (task == 'delete') {
        await deleteData(`contacts/${thisToken}`)
        window.parent.location.reload();
    }

    if (task == 'save') {
        let thisPhone = document.getElementById("phoneInput").value;
        let thisName = document.getElementById("nameInput").value;
        if(ergebnisse[thisToken].type == "contacts"){
            myData = {"name":thisName,"email":thisEmail, "phone": thisPhone };
        }else{
            myData = {"phone": thisPhone };
        }
        await patchData(`${ergebnisse[thisToken].type}/${thisToken}`, {"name":thisName,"email":thisEmail, "phone": thisPhone })
        window.parent.location.reload();
    }
}