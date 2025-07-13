const counter = document.getElementById("counter");

let textArea = document.getElementById("idea");

let count = 0;

function increment() {
    count++;
    counter.textContent = count;
    console.log("Button was clicked!");

    let lightBulb = document.createElement("img");
        lightBulb.src = "/lightBulb-Icon.png";
        lightBulb.alt = "Light bulb image representing entered & saved idea.";
        lightBulb.style.width = "30px";

    let ideasAsLightbulbs = document.getElementById("ideas-as-lightbulbs");
        ideasAsLightbulbs.appendChild(lightBulb);

        textArea.value = "";
}


