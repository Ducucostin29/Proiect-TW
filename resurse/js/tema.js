document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.getElementById("theme-switcher");
    const lightIcon = document.getElementById("light-icon");
    const darkIcon = document.getElementById("dark-icon");

    const tema = localStorage.getItem("tema");
    if (tema) {
        document.body.classList.add("dark");
        lightIcon.style.display = "none";
        darkIcon.style.display = "inline";
    }

    themeSwitcher.addEventListener("click", () => {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
            lightIcon.style.display = "inline";
            darkIcon.style.display = "none";
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
            lightIcon.style.display = "none";
            darkIcon.style.display = "inline";
        }
    });
});
