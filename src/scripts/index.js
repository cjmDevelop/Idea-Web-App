const entries = [];
const textAreaContent = document.getElementById("idea");// Text from textarea
const ideasAsLights = document.getElementById("ideas-as-lights");// Visual images of lights as links for saved text from textarea
let count = 0;

function increment() {

    entries.push(textAreaContent.value);//Add entry to array
    
    const lightBulb = document.createElement("img");
    lightBulb.src = "/lightBulb-Icon.png";
    lightBulb.alt = "Light bulb image representing entered & saved idea.";
    lightBulb.style.width = "30px";
    lightBulb.style.margin = "5px";
    lightBulb.style.cursor = "pointer";
    
    const anchorIdea = document.createElement("a");
          anchorIdea.href = "#";
          anchorIdea.appendChild(lightBulb);//Wraps image in anchor
          anchorIdea.dataset.text = entries[count]; //Using dataset.text to "get" the text 
          anchorIdea.addEventListener("click", (e) => {
            e.preventDefault();
            textAreaContent.value = e.currentTarget.dataset.text;
            console.log(textAreaContent.value);
          })
   
    ideasAsLights.appendChild(anchorIdea);//Appends anchor to HTML
    textAreaContent.value = ""; //Visually refreshes the textarea
    count++; // Increases count
}



