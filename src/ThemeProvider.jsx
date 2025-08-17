import { useEffect } from "react";

function ThemeProvider() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const input = document.querySelector(".theme-controller");
    if (input) {
      input.checked = savedTheme === "dark";
      input.addEventListener("change", () => {
        const newTheme = input.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      });
    }
  }, []);

  return null; // doesn’t render UI
}

export default ThemeProvider;
