import { loginUser, getNotes, createNote, updateNote, deleteNote } from "../services/api.js";


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

async function increment() {

  const content = idea.value.trim();

  if(!content) {
    alert('Please write something first!');
    return;
  }

  try {
console.log("💾 Saving to backend...");
const newNote = await createNote(idea.value);
console.log("✅ Saved! Note ID:", newNote.id);

console.log("📝 Adding to entries array...")
entries.push(idea.value);
let newCount = count;
let displayCount = newCount + 1;

const lightBulb = document.createElement("img");
lightBulb.src = "/lightBulb-Icon.png";
lightBulb.alt = "Light bulb image representing entered & saved idea.";
lightBulb.style.width = "30px";
lightBulb.style.margin = "5px";
lightBulb.style.cursor = "pointer";
lightBulb.dataset.noteId = newNote.id;

console.log("⚓️ Creating anchor...")
const anchorIdea = document.createElement("a");
anchorIdea.href = "#";
anchorIdea.appendChild(lightBulb);

console.log("👉🏾 Added click listener...")
anchorIdea.addEventListener("click", (e) => {
e.preventDefault();
idea.value = entries[newCount];
ideasEnteredNumber.textContent = displayCount;
count = newCount;
saveHelper();
showSaveResetAndTrashButtons();
});

console.log("🌀 Flashing blue..")
form.style.background = "blue";
setTimeout(() => {
form.style.background = "#111";
}, "10");

console.log("🚮 calling trashHelper...")
trashHelper(anchorIdea, lightBulb);

// return entries, ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
// anchorIdea.dataset.text = entries[newCount],
// count++,
// ideasEnteredNumber.textContent = count,
// idea.value = "";
console.log("➕ adding to DOM...")
ideasAsLights.append(anchorIdea);
anchorIdea.dataset.text = entries[newCount];
count++;
ideasEnteredNumber.textContent = count;
idea.value = "";
} 
catch(error) {
  console.error('❌ Error saving note:', error);
  console.error('Error details: ', error.message);
  console.error('Error stack: ', error.stack);
  // alert('Failed to save note! Is backend running?');
}
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

window.addEventListener('DOMContentLoaded', async () => {
  console.log('⏳ Loading notes from backend...');
  try{
    await loginUser();
    const notes = await getNotes();

    console.log(`✅ Loaded ${notes.length} notes!`);

    notes.forEach((note, index) => {
      entries.push(note.content);

      const lightBulb = document.createElement("img");
      lightBulb.src = "/lightBulb-Icon.png"
      lightBulb.alt = "Light bulb";
      lightBulb.style.width = "30px";
      lightBulb.style.margin = "5px";
      lightBulb.style.cursor = "pointer";
      lightBulb.dataset.noteId = note.id;

      const anchorIdea = document.createElement("a");
      anchorIdea.href = "#";
      anchorIdea.appendChild(lightBulb);
      
      anchorIdea.addEventListener("click", (e) => {
        e.preventDefault();
        idea.value = note.content;
        ideasEnteredNumber.textContent = index + 1;
        count = index;
        saveHelper();
        showSaveResetAndTrashButtons();
      });

      ideasAsLights.appendChild(anchorIdea);
    });
    
    count = notes.length;
    ideasEnteredNumber.textContent = count;
    
  } catch (error) {
    console.error('❌ Error loading notes:', error);
    alert('Could not connect to backend!');
  }
});

window.increment = increment;
window.saveMeansUpdate = saveMeansUpdate;
window.resetMeansStartOver = resetMeansStartOver;
window.trashMeansDelete = trashMeansDelete;





