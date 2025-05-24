function donothing(event) {
    event.stopPropagation();
}

function showUserLinksOptions() {
    document.getElementById("userLinkOptions").classList.toggle("hide")
    // document.getElementById("userLinkOptionsBackground").classList.toggle("hide")
    addHelpToPopup();
}

function hideUserLinksOptions() {
    const el = document.getElementById("userLinkOptions");
    if (!el.classList.contains("hide")) {
        el.classList.add("hide");
    }
}
