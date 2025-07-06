// initialize the count as 0
// listen for clicks on the increment button
// increment the count variable when the button is clicked
//change the count-el in the HTML to refine the new count


let count = 0;
let newCount = document.getElementById("count-el");

function increment() {
    count++;
    newCount.innerText = count;
    console.log("Button was clicked!");
}

