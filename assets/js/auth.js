import { getCurrentUser, loginUser, registerUser } from "./storage.js";

const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const messageEl = document.querySelector("#authMessage");

// redirect if logged in
if (getCurrentUser()) {
  window.location.href = "index.html";
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    
    messageEl.textContent = "loading...";
    const result = await loginUser(username, password);
    
    if (result.success) {
      window.location.href = "index.html";
    } else {
      messageEl.textContent = result.message;
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(registerForm);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    
    if (username.length < 3) {
      messageEl.textContent = "username too short";
      return;
    }
    
    messageEl.textContent = "creating account...";
    const result = await registerUser(username, password);
    
    if (result.success) {
      window.location.href = "index.html";
    } else {
      messageEl.textContent = result.message;
    }
  });
}