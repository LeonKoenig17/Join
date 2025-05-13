function checkLocalstorage() {
    const user = localStorage.getItem("user");
    
    if (!user) {
        window.location.href = "http://127.0.0.1:5500/index.html";
    }
}

checkLocalstorage();