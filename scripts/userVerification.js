function checkLocalstorage() {
    const user = localStorage.getItem("user");
    
    if (!user) {
        window.location.href = "/index.html";
    }
}

checkLocalstorage();