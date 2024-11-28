const versionNumber = "0.4.3";
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
    updateHistoryTable();
}

function resetClick() {
    let resetTextEl = document.getElementById("reset");
    if (resetTextEl.innerText == "Reset everything") {
        resetTextEl.innerText = "Confirm reset";
    } else {
        resetLocalStorage();
    }
}

function resetLocalStorage() {
    currentStatus.balance = 60;
    currentStatus.history = [];
    saveToStorage();
    localStorage.setItem("notfirsttime-dd", "true");
    let resetTextEl = document.getElementById("reset");
    resetTextEl.innerText = "Reset everything";
    updateBalance();
    clearHistoryTable();
}

function setUp() {
    if (localStorage.getItem("notfirsttime-dd") != "true") {
        resetLocalStorage();
    } else {
        getFromStorage();
    }
}

function updateBalance() {
    let balanceEl = document.getElementById('balance');
    balanceEl.innerText = currentStatus.balance;
}

function updateHistoryTable() {
    currentStatus.history.filter((v, i) => {
        currentStatus.history[i].deleted == true ? null : createHistoryRow(i)
    })
}

function undoClick(rowIndex) {
    let undoTextEl = document.getElementById("undo-btn-" + rowIndex);
    if (undoTextEl.innerText == "Undo?") {
        undoTextEl.innerText = "Confirm undo";
    } else {
        undoTransaction(rowIndex);
    }
}

function undoTransaction(rowIndex) {
    currentStatus.history[rowIndex].deleted = true;
    currentStatus.balance -= currentStatus.history[rowIndex].tmchange;
    updateBalance();
    clearHistoryRow(rowIndex);
    saveToStorage();
}

function clearHistoryTable() {
    document.querySelectorAll(".history-row").forEach(x => x.remove());
}

function clearHistoryRow(rowIndex) {
    let rowEl = document.getElementById("history-row-" + rowIndex);
    rowEl.remove();
}

function createHistoryRow(rowIndex) {
    let rowDiv = document.createElement('div');
    rowDiv.classList.add("history-row");
    rowDiv.id = "history-row-" + rowIndex;

    let timestampDiv = document.createElement('div');
    timestampDiv.classList.add("history-cell", "timestamp-cell");
    let tmchangeDiv = document.createElement('div');
    tmchangeDiv.classList.add("history-cell", "tmchange-cell");
    let undoDiv = document.createElement('div');
    undoDiv.classList.add("history-cell", "undo-cell");

    let undoButtonEl = document.createElement("button");
    undoButtonEl.id = "undo-btn-" + rowIndex;
    undoButtonEl.innerText = "Undo?";
    undoButtonEl.onclick = () => {undoClick(rowIndex)};

    let rowObject = currentStatus.history[rowIndex]

    timestampDiv.innerText = rowObject.timestamp;
    tmchangeDiv.innerText = rowObject.tmchange;
    undoDiv.append(undoButtonEl);

    let historyHeadRowEl = document.querySelector('.history-headrow');
    historyHeadRowEl.after(rowDiv);
    rowDiv.append(timestampDiv, tmchangeDiv, undoDiv);
}

function addToHistory(tmchangeNum) {
    let newTransaction = {};

    newTransaction.deleted = false;
    
    const d = new Date();
    let dateStr = d.toLocaleString("nl-NL");
    newTransaction.timestamp = dateStr;

    tmchangeStr = tmchangeNum > 0 ? "+" + tmchangeNum.toString() : tmchangeNum.toString();

    newTransaction.tmchange = tmchangeStr;

    currentStatus.history.push(newTransaction);

    let transactionIndex = currentStatus.history.length - 1;

    return transactionIndex;
}

function addTM(numTM) {
    currentStatus.balance += numTM;
    let indexNum = addToHistory(numTM);
    updateBalance();
    createHistoryRow(indexNum);
    saveToStorage();
}

function calculateCost() {
    let travelMinEl = document.getElementById('travel-min');
    let inputDuration = travelMinEl.value;
    let isIntercityEl = document.getElementById('opt-ic');
    let isIntercity = isIntercityEl.checked;
    let tmCost = 5 * Math.ceil(inputDuration / 5);
    tmCost = isIntercity ? tmCost * 2 : tmCost;
    return tmCost;
}

function clearMinInput() {
    let travelMinEl = document.getElementById('travel-min');
    travelMinEl.value = "";
}

function checkCost() {
    let costEl = document.getElementById('cost');
    costEl.innerText = calculateCost();
}

function submitCost() {
    checkCost();
    let cost = calculateCost();
    currentStatus.balance -= cost;
    let indexNum = addToHistory(-cost);
    updateBalance();
    createHistoryRow(indexNum);
    saveToStorage();
    clearMinInput();
}

function exportHistory() {
    navigator.clipboard.writeText(JSON.stringify(currentStatus.history));
    alert("History copied to clipboard");
}