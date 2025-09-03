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
console.log("khdbkcbdskcbkdckdjnckjdcdAAAAAA")

function resetText() {
  idea.value = "";
  showIncrementButtonOnly();
  console.log("\n");
  console.log("resetText count: " + count);
  console.log("resetText entries: " + entries);
  console.log("khdbkcbdskcbkdckdjnckjdcdBBBBBBBB")
}

function showSaveResetAndTrashButtons() {
  incrementButton.style.display = "none";
  saveButton.style.display = "block";
  resetButton.style.display = "block";
  trashButton.style.display = "block";
  console.log("khdbkcbdskcbkdckdjnckjdcdDDDDDDDDDDDD")
}

function showIncrementButtonOnly() {
  incrementButton.style.display = "block";
  saveButton.style.display = "none";
  resetButton.style.display = "none";
  trashButton.style.display = "none";
  console.log("khdbkcbdskcbkdckdjnckjdcdEEEEEEEEEEEE")
}


function increment() {
  entries.push(idea.value);
  let newCount = count;
  let displayCount = newCount + 1;
  console.log("khdbkcbdskcbkdckdjnckjdcdFFFFFFFFFFFF")

  const lightBulb = document.createElement("img");
  lightBulb.src = "/lightBulb-Icon.png";
  lightBulb.alt = "Light bulb image representing entered & saved idea.";
  lightBulb.style.width = "30px";
  lightBulb.style.margin = "5px";
  lightBulb.style.cursor = "pointer";
console.log("khdbkcbdskcbkdckdjnckjdcdGGGGGGGGGGGG")
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
    console.log("count: " + count);
    console.log("newCount: " + newCount)
    console.log("entries: " + entries);
    console.log("khdbkcbdskcbkdckdjnckjdcdHHHHHHHHHHHHHH")
  });

  form.style.background = "blue";
  setTimeout(() => {
    form.style.background = "#111";
  }, "10");


  return entries, ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
    anchorIdea.dataset.text = entries[newCount],
    count++,
    ideasEnteredNumber.textContent = count,
    idea.value = "", console.log("khdbkcbdskcbkdckdjnckjdcdIIIIIIIIII");
}

function clearIdeasNumberTemporarily(){
return ideasEnteredNumber.textContent = "",
console.log("khdbkcbdskcbkdckdjnckjdcdJJJJJJJJJJJJJ")
}

function saveHelper() {
  return count_b = count,
  console.log("khdbkcbdskcbkdckdjnckjdcdVVVVVVVVVVVVVVPPPPPPPPPPPPP")
}

function saveMeansUpdate() {
  return entries[count_b] = idea.value, 
    resetText(), clearIdeasNumberTemporarily(),
    console.log("\n"),
    console.log("count_b: " + count_b),
    console.log("save function: " + entries[count_b]),
    console.log("save function entries: " + entries),
    console.log("khdbkcbdskcbkdckdjnckjdcdXXXXXXXXXX")
}

function resetMeansStartOver() {
  idea.value = "";                       // Clear input
  ideasEnteredNumber.textContent = "";   // Hide idea number
  showIncrementButtonOnly();             // Show only increment button
  count = entries.length;
console.log(777777777777777777777777777777);
  console.log("Reset to start-over mode");
  console.log("count: " + count);
  console.log("entries: " + entries);
}















