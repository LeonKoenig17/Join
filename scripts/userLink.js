function donothing(event) {
    event.stopPropagation();
}

function showUserLinksOptions() {
    document.getElementById("userLinkOptions").classList.toggle("hide")
    // document.getElementById("userLinkOptionsBackground").classList.toggle("hide")
    addHelpToPopup();
}