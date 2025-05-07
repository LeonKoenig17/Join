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