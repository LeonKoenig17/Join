function checkLocalstorage() {
    const user = localStorage.getItem("name");
    
    if (!user) {
        window.location.href = "/index.html";
    }
}

checkLocalstorage();