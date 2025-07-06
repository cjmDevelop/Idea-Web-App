// initialize the count as 0
// listen for clicks on the increment button
// increment the count variable when the button is clicked
//change the count-el in the HTML to refine the new count

let count = 0;
let countEl = document.getElementById("count-el");
let saveEl = document.getElementById("save-el");

function increment() {
    count++;
    countEl.textContent = count;
    console.log("Button was clicked!");
}

function save() {
    let countDashula = count + " - ";
    saveEl.textContent += countDashula;
    console.log(count);
    count = 0;
    countEl.textContent = count;
}