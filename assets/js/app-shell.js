import { ensureLoggedIn, logoutUser, initAppData } from "./storage.js";

// --- theme logic ---
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    const toggleBtn = document.querySelector("#themeToggle");
    if (toggleBtn) {
        toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        
        toggleBtn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            toggleBtn.textContent = next === "dark" ? "☀️" : "🌙";
        });
    }
}

// --- app init ---
(async function init() {
  initTheme();
  await initAppData();

  const path = window.location.pathname;
  const isPublicPage = path.endsWith("index.html") || path.endsWith("/") || path.includes("auth.html") || path.includes("take-quiz.html") || path.includes("review.html");

  if (!isPublicPage) {
    try {
        const username = ensureLoggedIn();
        const badge = document.querySelector("#userBadge");
        if (badge) badge.textContent = username;
    } catch (e) { return; }
  } else {
      const username = sessionStorage.getItem("wirtschaftsquiz_session");
      const badge = document.querySelector("#userBadge");
      const logoutBtn = document.querySelector("#logoutBtn");
      const loginLink = document.querySelector("#loginLink");

      if (username) {
          if (badge) badge.textContent = username;
          if (loginLink) loginLink.style.display = "none";
          if (logoutBtn) logoutBtn.style.display = "inline-flex";
      } else {
          if (logoutBtn) logoutBtn.style.display = "none";
      }
  }

  const logoutBtn = document.querySelector("#logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    logoutUser();
    window.location.href = "index.html";
  });
})();