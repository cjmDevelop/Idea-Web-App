const themeToggleButton = document.getElementById("theme-toggle");

let currentTheme = localStorage.getItem("theme") || "light";

if(currentTheme === "dark") {
    HTMLElement.setAttribute("data-theme", "dark");
}

themeToggleButton.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
})