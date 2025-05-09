fireBaseContent = null;
thisToken = null;

window.addEventListener('message', (event) => {
    if (event.data?.type === 'firebaseData') {
        fireBaseContent = event.data.data;
        thisToken = event.data.token;
        ergebnisse = event.data.ergebnisse;

        console.log("Firebase-Daten:", fireBaseContent);
        console.log("Token:", thisToken);
        console.log("Ergebnisse:", ergebnisse);

        // Hier kannst du z. B. eine Funktion mit "ergebnisse" aufrufen
    }

    if (event.data?.type === 'tokenUpdate') {
        thisToken = event.data.token;
        console.log("Token aktualisiert:", thisToken);
    }
});

function changeImage(element){
    document.getElementById("cancelImg").src = `../images/cancel${element}.svg`;
}

function hideAddForm(){
    const parentWindow = window.parent;
    const addContact = parentWindow.document.getElementById('addContact');
    const addContactDiv = parentWindow.document.getElementById('addContactDiv');
    const allContactsDiv = parentWindow.document.getElementById('allContacts');

    console.log('test ');
    
}

function initAddContact(){

}
// async function hideAddContact(create = false) {
//     const parentWindow = window.parent;
//     const addContact = parentWindow.document.getElementById('addContact');
//     const addContactDiv = parentWindow.document.getElementById('addContactDiv');
//     const allContactsDiv = parentWindow.document.getElementById('allContacts');


//     addContact.classList.add("hide")
//     addContact.style.left = '100%';
//     addContact.style.top = '50%';
//     addContact.style.transform = 'translate(0%, -50%)';
//     addContactDiv.classList.add("hide")

//     if (create) {
//         await addContactTask();
//         window.parent.location.reload();
//     }
// }