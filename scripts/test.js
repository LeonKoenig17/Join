async function onload() {
    const data = await loadData("login");

    const users = Object.values(data).map(user => ({
        name: user.name,
        email: user.email,
        color: user.color
    }));

    // Alphabetisch nach Vornamen sortieren
    users.sort((a, b) => {
        const firstNameA = a.name.split(" ")[0].toLowerCase();
        const firstNameB = b.name.split(" ")[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
    });

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

    // Iteriere über die gruppierten Benutzer
    Object.keys(groupedUsers).forEach(letter => {
        // Erstelle das div für die Gruppe (A, B, C, ...)
        const capitalDiv = document.createElement("div");
        capitalDiv.id = `capital${letter}`;
        capitalDiv.classList.add("capital");

        // Füge den Buchstaben hinzu
        const spanLetter = document.createElement("span");
        spanLetter.classList.add("spanLetter")
        spanLetter.textContent = letter;
        capitalDiv.appendChild(spanLetter);

        // Füge die Trennlinie hinzu
        const separator = document.createElement("div");
        separator.classList.add("separator");
        capitalDiv.appendChild(separator);

        // Iteriere über die Benutzer in der Gruppe
        groupedUsers[letter].forEach(user => {
            const userNav = document.createElement("nav");
            userNav.classList.add("singleUser");

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
            userEmail.href = `mailto:${user.email}`;
            userEmail.textContent = user.email;

            userDetails.appendChild(userName);
            userDetails.appendChild(userEmail);
            userNav.appendChild(userDetails);

            // Füge das Benutzer-Navi zu der Gruppe hinzu
            capitalDiv.appendChild(userNav);
        });

        // Füge die Gruppe zum allContacts div hinzu
        allContactsNav.appendChild(capitalDiv);
    });
}
