import { getCurrentUser, loginUser, registerUser } from "./storage.js";

const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const messageEl = document.querySelector("#authMessage");

if (getCurrentUser()) {
  window.location.href = "dashboard.html";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const username = data.get("username").trim();
  const password = data.get("password").trim();
  const result = loginUser(username, password);
  if (result.success) {
    messageEl.textContent = "Erfolgreich eingeloggt – weiterleiten ...";
    window.location.href = "dashboard.html";
  } else {
    messageEl.textContent = result.message;
  }
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(registerForm);
  const username = data.get("username").trim();
  const password = data.get("password").trim();
  if (username.length < 3) {
    messageEl.textContent = "Benutzername muss mindestens 3 Zeichen haben.";
    return;
  }
  const result = registerUser(username, password);
  if (result.success) {
    messageEl.textContent = "Konto erstellt! Du wirst weitergeleitet.";
    window.location.href = "dashboard.html";
  } else {
    messageEl.textContent = result.message;
  }
});
