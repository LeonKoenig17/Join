let users = [];
const BASE_URL =
    "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";

async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

async function getUsers(){
    let userResponse = await getAllUsers('login');
    let userKeysArray = Object.keys(userResponse);

    console.log(userKeysArray);
    
}
getUsers();

// console.log(getAllUsers('login'))