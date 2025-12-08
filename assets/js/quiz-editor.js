import { addTopic, getAllQuestions, getQuizById, getQuestions, getTopics, upsertQuiz } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const quizId = params.get("quiz");

const form = document.querySelector("#quizForm");
const nameInput = document.querySelector("#quizName");
const topicSelect = document.querySelector("#quizTopic");
const pool = document.querySelector("#questionPool");
const selectedList = document.querySelector("#selectedQuestions");
const poolSearchText = document.querySelector("#poolSearchText");
const poolSearchTopic = document.querySelector("#poolSearchTopic");
const poolSearchType = document.querySelector("#poolSearchType");

let selectedIds = [];
let allQuestions = [];

function populateTopics() {
  const topics = getTopics();
  topicSelect.innerHTML = topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`).join("");
  topicSelect.insertAdjacentHTML("beforeend", `<option value="__add">+ Neues Thema ...</option>`);
}

function ensureTopic(value) {
  if (value !== "__add") return value;
  const newName = prompt("Name des neuen Themas:");
  if (!newName) return topicSelect.value;
  const topic = addTopic(newName);
  populateTopics();
  topicSelect.value = topic.id;
  return topic.id;
}

function refreshAllQuestions() {
  allQuestions = getAllQuestions();
  const topics = [...new Set(allQuestions.map((question) => question.topicName).filter(Boolean))];
  const currentValue = poolSearchTopic.value;
  poolSearchTopic.innerHTML = `<option value="">Alle</option>${topics.map((name) => `<option value="${name}">${name}</option>`).join("")}`;
  if (topics.includes(currentValue)) {
    poolSearchTopic.value = currentValue;
  }
}

function renderPool() {
  const text = poolSearchText.value.trim().toLowerCase();
  const topicFilter = poolSearchTopic.value;
  const typeFilter = poolSearchType.value;
  const questions = allQuestions.filter((question) => {
    if (topicFilter && question.topicName !== topicFilter) return false;
    if (typeFilter && question.type !== typeFilter) return false;
    if (text) {
      const haystack = `${question.title} ${(question.options ?? []).join(" ")}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
  pool.innerHTML =
    questions
      .map(
        (q) => `
        <label class="list-item" style="cursor:pointer">
          <div>
            <strong>${q.title}</strong>
            <div class="quiz-meta">
              <span class="badge">${q.type}</span>
              <span>${q.points} Punkte</span>
            </div>
          </div>
          <input type="checkbox" data-id="${q.id}" ${selectedIds.includes(q.id) ? "checked" : ""} />
        </label>`
      )
      .join("") || `<p class="muted">Noch keine Fragen vorhanden.</p>`;
}

function renderSelected() {
  const questionMap = allQuestions.reduce((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {});
  selectedList.innerHTML =
    selectedIds
      .map((id, index) => {
        const q = questionMap[id];
        return `
        <article class="list-item">
          <div>
            <strong>${index + 1}. ${q?.title ?? "Frage nicht verfügbar"}</strong>
            <div class="quiz-meta">
              <span>${q?.points ?? 0} Punkte</span>
              ${q?.owner ? `<span class="badge">Autor · ${q.owner}</span>` : ""}
            </div>
          </div>
          <button class="btn secondary" data-remove="${id}">Entfernen</button>
        </article>`;
      })
      .join("") || `<p class="muted">Wähle Fragen aus dem Pool.</p>`;
}

pool.addEventListener("change", (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  if (event.target.checked) {
    if (!selectedIds.includes(id)) {
      selectedIds.push(id);
    }
  } else {
    selectedIds = selectedIds.filter((entry) => entry !== id);
  }
  renderSelected();
});

selectedList.addEventListener("click", (event) => {
  const id = event.target.dataset.remove;
  if (!id) return;
  selectedIds = selectedIds.filter((entry) => entry !== id);
  renderPool();
  renderSelected();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const topicId = ensureTopic(topicSelect.value);
  upsertQuiz({
    id: quizId ?? undefined,
    name: nameInput.value,
    topicId,
    questionIds: selectedIds,
  });
  window.location.href = "dashboard.html";
});

function hydrateQuiz() {
  if (!quizId) return;
  const quiz = getQuizById(quizId);
  if (!quiz) return;
  nameInput.value = quiz.name;
  topicSelect.value = quiz.topicId;
  if (!topicSelect.value) {
    const fallbackOption = document.createElement("option");
    fallbackOption.value = quiz.topicId;
    fallbackOption.textContent = "Importiertes Thema";
    topicSelect.insertBefore(fallbackOption, topicSelect.firstChild);
    topicSelect.value = quiz.topicId;
  }
  selectedIds = [...quiz.questionIds];
}

populateTopics();
refreshAllQuestions();
hydrateQuiz();
renderPool();
renderSelected();

[poolSearchText, poolSearchTopic, poolSearchType].forEach((control) => {
  control?.addEventListener("input", renderPool);
  control?.addEventListener("change", renderPool);
});

topicSelect.addEventListener("change", (event) => {
  ensureTopic(event.target.value);
});

