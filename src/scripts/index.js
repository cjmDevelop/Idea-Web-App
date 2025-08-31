const entries = [];
const idea = document.getElementById("idea");// Text from textarea
const ideasAsLights = document.getElementById("ideas-as-lights");// Visual images of lights as links for saved text from textarea
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

function showIncrementButtonOnly(){
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
    idea.value = e.currentTarget.dataset.text;
    ideasEnteredNumber.textContent = displayCount;
    count = newCount;/////////////////////////////////////////////////////////////////////////////////////////////
    saveHelper();/////////////////////////////////////////////////////////////////////////////////////////////////
    console.log("\n");
    showSaveResetAndTrashButtons();
    console.log("count: " + count);
    console.log("newCount: " + newCount)
    console.log("entries: " + entries); 
  });


  form.style.background = "blue";

  setTimeout(() => {
    form.style.background = "#111";
  }, "10");


  return  entries, ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
    anchorIdea.dataset.text = entries[newCount],
    idea.value = entries[count],///////////////////////////////////////////////////////////////////////////////////
    count++, // Increases count
    ideasEnteredNumber.textContent = count,//Number visual of entered submissions
    idea.value = "";
}


function saveHelper() {
  return count_b = count;
}
function saveMeansUpdate(){
return entries[count_b] = idea.value, 
showIncrementButtonOnly(), resetText(),
console.log("\n"),
console.log("count_b: " + count_b),
console.log("save function: " + entries[count_b]),
console.log("save function entries: " + entries);
}






   










