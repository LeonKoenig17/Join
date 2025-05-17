async function login() {
    let myPassword = await checkPassword(document.getElementById("emailInput").value);
    let myEmail = await findUser(document.getElementById("emailInput").value);
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (myEmail == null) {
        document.getElementById("passwordInput").classList.add("redBorder")
        document.getElementById("emailInput").classList.add("redBorder")
        document.getElementById("errorSpan").classList.remove("displayNone")
        document.getElementById("errorSpan").innerHTML = 'No account found with this email.'
        return
    }
    if (password == myPassword) {
        await writeLocalStorage();
        showSuccess('loginSuccess');
    } else {
        document.getElementById("passwordInput").classList.add("redBorder")
        document.getElementById("emailInput").classList.add("redBorder")
        document.getElementById("errorSpan").classList.remove("displayNone")
        document.getElementById("errorSpan").innerHTML = 'Check your Email and password. Please try again.'

    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const blueBtn = document.querySelector('.blueBtn');
        if (blueBtn) {
            blueBtn.click();
        }
    }
});

async function checkPassword(email) {
    // let ergebnisse = await loadData("login")
    let ergebnisse = fireBaseContent.login;
    for (let userId in ergebnisse) {
        if (ergebnisse[userId].email === email) {
            return ergebnisse[userId].password;
        }
    }
    return null;
}