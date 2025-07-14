const ideasThatAreLights = [];
const ideasEntered = document.getElementById("ideas-entered");
const textAreaContent = document.getElementById("idea");

let count = 0;

function increment() {
    count++;
    ideasEntered.textContent = count;
    console.log("Button was clicked!"); //Artifact from scrimba.com while completing beginner's JavaScript app-counter lesson.

    let ideaLink = document.createElement("a");
        

    let lightBulb = document.createElement("img");
        lightBulb.src = "/lightBulb-Icon.png";
        lightBulb.alt = "Light bulb image representing entered & saved idea.";
        lightBulb.style.width = "30px";

    let ideasAsLightbulbs = document.getElementById("ideas-as-lightbulbs");
        ideasAsLightbulbs.appendChild(lightBulb);
        ideasThatAreLights.push(textAreaContent.value);

        textAreaContent.value = ""; // Visually refreshes the textarea
}

ideasThatAreLights.forEach((element) => {
    console.log(element);
})

