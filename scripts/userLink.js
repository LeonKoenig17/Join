function donothing(event) {
    event.stopPropagation();
}


function showUserLinksOptions() {
    document.getElementById("userLinkOptions").classList.toggle("hide");
    addHelpToPopup();
    closeUserLinksOnOutsideClick();
}


function hideUserLinksOptions() {
    const el = document.getElementById("userLinkOptions");
    if (!el.classList.contains("hide")) {
        el.classList.add("hide");
    }
}


function addHelpToPopup() {
    const windowWidth = window.innerWidth;
    try {
        if (windowWidth <= 800) {
            document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/help.html" class="userLinkOptionsLinks">Help</a>
        <a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
        } else {
            document.getElementById("userLinkOptions").innerHTML = `
        <a href="../html/legalNotice.html" class="userLinkOptionsLinks">Legal Notice</a>
        <a href="../html/privacyPolicy.html" class="userLinkOptionsLinks">Privacy Policy</a>
        <a onclick="logout()" class="userLinkOptionsLinks">Log out</a>
        `
        }
    } catch (error) {
        console.error("Error updating popup content:", error);
    }
}


function closeUserLinksOnOutsideClick() {
    document.addEventListener("click", (event) => {
        const popup = document.getElementById("userLinkOptions");
        const userLink = document.getElementById("userLink");

        if (popup && !popup.classList.contains("hide")) {
            const isClickOutside = !popup.contains(event.target) && !userLink.contains(event.target);
            if (isClickOutside) {
                hideUserLinksOptions();
            }
        }
    });
}
