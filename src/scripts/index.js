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
  console.log("\n");
  console.log("resetText count: " + count);
  console.log("resetText entries: " + entries);
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
    console.log("\n");
    showSaveResetAndTrashButtons();
  });

  form.style.background = "blue";
  setTimeout(() => {
    form.style.background = "#111";
  }, "10");


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















