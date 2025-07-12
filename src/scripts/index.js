let count = 0;
let countEl = document.getElementById("count-el");
let saveEl = document.getElementById("save-el");


function increment() {
    count++;
    countEl.textContent = count;
    console.log("Button was clicked!");

    let lightBulb = document.createElement("img");
        lightBulb.src = "/lightBulb-Icon.png";
        lightBulb.alt = "Light bulb image representing entered & saved idea.";
        lightBulb.style.width = "30px";

    let brightIdea = document.getElementById("bright-ideas");
        brightIdea.appendChild(lightBulb);
}

function save() {
    let countDashula = count + " - ";
    saveEl.textContent += countDashula;
    console.log(count);
    count = 0;
    countEl.textContent = count;

    let lineBreak = document.createElement("br");
    let brightIdea = document.getElementById("bright-ideas");
        brightIdea.appendChild(lineBreak);
}

function goBack() {
    window.location.href = "index.html";
}


