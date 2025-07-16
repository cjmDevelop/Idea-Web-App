const entries = [];
const ideasEntered = document.getElementById("ideas-entered"); // idea counter, artifact from scrimba.com learn javascript for beginners, counter app lessons.
const textAreaContent = document.getElementById("idea");// Text from textarea
const ideasAsLights = document.getElementById("ideas-as-lights");// Visual images of lights as links for saved text from textarea

let count = 0;

function increment() {
    count++;
    /*Artifacts from scrimba.com while completing beginner's JavaScript app-counter lesson.
    ideasEntered.textContent = count;
    console.log("Button was clicked!");*/

    const lightBulb = document.createElement("img");
          lightBulb.src = "/lightBulb-Icon.png";
          lightBulb.alt = "Light bulb image representing entered & saved idea.";
          lightBulb.style.width = "30px";
          lightBulb.style.margin = "5px";
      
    ideasAsLights.appendChild(lightBulb);
    entries.push(textAreaContent.value);
    textAreaContent.value = ""; // Visually refreshes the textarea
    
    console.log(entries);// Logging for testing
}



