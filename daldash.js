const versionNumber = "0.3.3";
let currentStatus = {balance: 60, history: []};

// importBackup();
initialise();

document.getElementById("version") ? document.getElementById("version").textContent = "v" + versionNumber : null;

// if (typeof(Storage) == "undefined") {
//     document.getElementById("storage").textContent += "\nSorry, your browser does not support local storage, so data won't be saved between sessions."
// }

function saveToStorage() {
    localStorage.setItem("daldashbalance", JSON.stringify(currentStatus));
}

function getFromStorage() {
    let storageObj = JSON.parse(localStorage.getItem("daldashbalance"));
    currentStatus.balance = storageObj.balance;
    currentStatus.history = storageObj.history;
}

function initialise() {
    setUp();
    updateBalance();
}

function resetLocalStorage() {
    currentStatus.balance = 60;
    currentStatus.history = [];
    saveToStorage();
    localStorage.setItem("notfirsttime-dd", "true");
    updateBalance();
}

function setUp() {
    if (localStorage.getItem("notfirsttime-dd") != "true") {
        resetLocalStorage();
    } else {
        getFromStorage();
    }
}

function updateBalance() {
    let balanceID = document.getElementById('balance');
    balanceID.innerText = currentStatus.balance;
    saveToStorage();
}

function addTM(numTM) {
    currentStatus.balance += numTM;
    updateBalance();
}

function calculateCost() {
    let travelMinID = document.getElementById('travel-min');
    let inputDuration = travelMinID.value;
    let isIntercityID = document.getElementById('opt-ic');
    let isIntercity = isIntercityID.checked;
    let tmCost = 5 * Math.ceil(inputDuration / 5);
    tmCost = isIntercity ? tmCost * 2 : tmCost;
    return tmCost;
}

function clearMinInput() {
    let travelMinID = document.getElementById('travel-min');
    travelMinID.value = "";
}

function checkCost() {
    let costID = document.getElementById('cost');
    costID.innerText = calculateCost();
}

function submitCost() {
    checkCost();
    currentStatus.balance -= calculateCost();
    updateBalance();
    clearMinInput();
}