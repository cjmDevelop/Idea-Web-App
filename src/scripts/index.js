
let entries = [];
let textAreaContent = document.getElementById("idea");// Text from textarea
let ideasAsLights = document.getElementById("ideas-as-lights");// Visual images of lights as links for saved text from textarea
let form = document.querySelector("form");
let ideasEnteredNumber = document.getElementById("ideas-entered");
let count = 0;


// function increment() {
//  return count++, ideasEnteredNumber.textContent = count; 
// }


function increment() {

  const lightBulb = document.createElement("img");
  lightBulb.src = "/lightBulb-Icon.png";
  lightBulb.alt = "Light bulb image representing entered & saved idea.";
  lightBulb.style.width = "30px";
  lightBulb.style.margin = "5px";
  lightBulb.style.cursor = "pointer";

  const anchorIdea = document.createElement("a");
  anchorIdea.href = "#";
  anchorIdea.appendChild(lightBulb);//Wraps image in anchor
   //Using dataset.text to "get" the text 
  console.log("Before " + entries[count]);
  anchorIdea.addEventListener("click", (e) => {
    e.preventDefault();
    textAreaContent.value = e.currentTarget.dataset.text;
    console.log("After " + entries[count]);
  })

  form.style.background = "blue";
  
  setTimeout(() => {
    form.style.background = "#111";
  }, "10");

  return entries.push(textAreaContent.value),//Add entry to array
  ideasAsLights.appendChild(anchorIdea),//Appends anchor to HTML
  anchorIdea.dataset.text = entries[count],
  count++, // Increases count
  ideasEnteredNumber.textContent = count,//Number visual of entered submissions
  textAreaContent.value = "";
}



