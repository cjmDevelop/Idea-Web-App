const entries = [];
const textAreaContent = document.getElementById("idea");// Text from textarea
const ideasAsLights = document.getElementById("ideas-as-lights");// Visual images of lights as links for saved text from textarea
const form = document.querySelector("form");
const ideasEnteredNumber = document.getElementById("ideas-entered");
const incrementButton = document.getElementById("increment-btn");
const saveButton = document.getElementById("save-btn");
const resetButton = document.getElementById("reset-btn");
const trashButton = document.getElementById("trash-btn");

let count = 0;

function resetText() {
  return textAreaContent.value = "";
}

function changeButton() {
  incrementButton.style.display = "none";
  saveButton.style.display = "block";
  resetButton.style.display = "block";
  trashButton.style.display = "block";
  // saveButton.style.backgroundColor = "green";
  // saveButton.style.color = "white";
}

function updateEntries() {
return entries.push(textAreaContent.value);
}

function increment() {
  updateEntries();

  let newCount;

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
    textAreaContent.value = e.currentTarget.dataset.text;
    ideasEnteredNumber.textContent = newCount;
    changeButton();

     console.log("anchorIdea entries: " + entries);
     console.log("count: " + count);
     console.log("newCount: " + newCount);
  });

  form.style.background = "blue";

  setTimeout(() => {
    form.style.background = "#111";
  }, "10");

    resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetText();
    resetButton.style.display = "none";
    saveButton.style.display = "none";
    trashButton.style.display = "none";
    incrementButton.style.display = "block";

    console.log("reset entries: " + entries);
  });

  return ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
    updateEntries(),
    anchorIdea.dataset.text = textAreaContent.value,
    count++, // Increases count
    newCount = count, //updates count when idea is clicked
    ideasEnteredNumber.textContent = count,//Number visual of entered submissions
    textAreaContent.value = "";
}

function updateEntries() {
  return entries.push(textAreaContent.value);
}




