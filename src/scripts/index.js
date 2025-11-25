

const entries = [];
const idea = document.getElementById("idea");
const ideasAsLights = document.getElementById("ideas-as-lights");
const form = document.querySelector("form");
const ideasEnteredNumber = document.getElementById("ideas-entered");
const incrementButton = document.getElementById("increment-btn");
const saveButton = document.getElementById("save-btn");
const resetButton = document.getElementById("reset-btn");
const trashButton = document.getElementById("trash-btn");

let count = 0;
let count_b = 0;

function resetText() {
idea.value = "";
showIncrementButtonOnly();
}

function showSaveResetAndTrashButtons() {
incrementButton.style.display = "none";
saveButton.style.display = "block";
resetButton.style.display = "block";
trashButton.style.display = "block";
}

function showIncrementButtonOnly() {
incrementButton.style.display = "block";
saveButton.style.display = "none";
resetButton.style.display = "none";
trashButton.style.display = "none";
}

function increment() {
entries.push(idea.value);
let newCount = count;
let displayCount = newCount + 1;

const lightBulb = document.createElement("img");
lightBulb.src = "/lightBulb-Icon.png";
lightBulb.alt = "Light bulb image representing entered & saved idea.";
lightBulb.style.width = "30px";
lightBulb.style.margin = "5px";
lightBulb.style.cursor = "pointer";

const anchorIdea = document.createElement("a");
anchorIdea.href = "#";
anchorIdea.appendChild(lightBulb);
anchorIdea.addEventListener("click", (e) => {
e.preventDefault();
idea.value = entries[newCount];
ideasEnteredNumber.textContent = displayCount;
count = newCount;
saveHelper();
showSaveResetAndTrashButtons();
});

form.style.background = "blue";
setTimeout(() => {
form.style.background = "#111";
}, "10");

trashHelper(anchorIdea, lightBulb);

return entries, ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
anchorIdea.dataset.text = entries[newCount],
count++,
ideasEnteredNumber.textContent = count,
idea.value = "";
}

function clearIdeasNumberTemporarily(){
return ideasEnteredNumber.textContent = "";
}

function saveHelper() {
return count_b = count;
}
function saveMeansUpdate() {
return entries[count_b] = idea.value,
resetText(), clearIdeasNumberTemporarily();
}

function resetMeansStartOver() {
idea.value = "";                       
ideasEnteredNumber.textContent = "";   
showIncrementButtonOnly();             
count = entries.length;
}

let trashAnchor;
let trashLight;

function trashHelper(a, b) {
return trashAnchor = a, trashLight = b;
}

function trashMeansDelete(){
console.log("\n");
idea.value = "";
ideasEnteredNumber.textContent = "";
trashAnchor.style.display = "none";
trashLight.style.display = "none";
showIncrementButtonOnly();
entries.splice(count, 1);
}


window.increment = increment;
window.saveMeansUpdate = saveMeansUpdate;
window.resetMeansStartOver = resetMeansStartOver;
window.trashMeansDelete = trashMeansDelete;







fetch('http://localhost:8080/api/notes', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqcjg3LmRlditub3RlQGdtYWlsLmNvbSIsImlhdCI6MTc2NDA5NjkxOSwiZXhwIjoxNzY0MTgzMzE5fQ.uUsF9T1jMGP4M8fDFbAZTX6ayx2N7dePE9-q1S5Ch1RD1pO4Z8tMTss8YslezXLluaIOmPCWtjZjlh9MxRKhLg', // ← Paste full token here
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(notes => {
  console.log('✅ Your notes:', notes);
  console.log(`Found ${notes.length} note(s)`);
})
.catch(err => console.error('Error:', err));




