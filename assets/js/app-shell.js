import { ensureLoggedIn, getCurrentUser, logoutUser } from "./storage.js";

const username = ensureLoggedIn();
const badge = document.querySelector("#userBadge");
if (badge) badge.textContent = username;

const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn?.addEventListener("click", () => {
  logoutUser();
  window.location.href = "auth.html";
});

