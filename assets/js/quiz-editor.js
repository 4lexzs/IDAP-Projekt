import { addTopic, getAllQuestions, getQuizById, getTopics, upsertQuiz } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const quizId = params.get("quiz");
const form = document.querySelector("#quizForm");
const nameInput = document.querySelector("#quizName");
const topicSelect = document.querySelector("#quizTopic");
const addTopicBtn = document.querySelector("#addTopicBtn");

const pool = document.querySelector("#questionPool");
const selectedList = document.querySelector("#selectedQuestions");
const poolSearchText = document.querySelector("#poolSearchText");
const poolSearchTopic = document.querySelector("#poolSearchTopic");
const poolSearchType = document.querySelector("#poolSearchType");
const createQuestionBtn = document.querySelector("#createQuestionBtn");

let selectedIds = [];
let allQuestions = [];

// init
function populateTopics() {
  const topics = getTopics();
  const html = topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`).join("");
  
  topicSelect.innerHTML = html;
  
  const currentPoolFilter = poolSearchTopic.value;
  poolSearchTopic.innerHTML = `<option value="">Alle Themen</option>` + html;
  poolSearchTopic.value = currentPoolFilter;
}

addTopicBtn.addEventListener("click", async () => {
    const newName = prompt("Name des neuen Themas:");
    if (!newName) return;
    const topic = await addTopic(newName);
    populateTopics();
    topicSelect.value = topic.id;
});

function refreshAllQuestions() {
  allQuestions = getAllQuestions();
}

// filter pool
function renderPool() {
  const text = poolSearchText.value.trim().toLowerCase();
  const topicId = poolSearchTopic.value;
  const type = poolSearchType.value;

  const questions = allQuestions.filter((question) => {
    if (topicId && question.topicId !== topicId) return false;
    if (type && question.type !== type) return false;
    if (text) {
      const haystack = `${question.title} ${(question.options ?? []).join(" ")}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });

  pool.innerHTML = questions.map((q) => `
    <label class="list-item pool-item" style="cursor:pointer;">
      <div style="flex:1">
        <strong>${q.title}</strong>
        <div class="quiz-meta" style="margin-top:0.25rem">
          <span class="badge">${q.type}</span>
          <span class="badge badge-author">${q.owner}</span>
        </div>
      </div>
      <input type="checkbox" data-id="${q.id}" ${selectedIds.includes(q.id) ? "checked" : ""} />
    </label>`
  ).join("") || `<p class="muted" style="text-align:center; padding:1rem;">Keine passenden Fragen gefunden.</p>`;
}

function renderSelected() {
  const questionMap = allQuestions.reduce((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {});
  
  selectedList.innerHTML = selectedIds.map((id, index) => {
    const q = questionMap[id];
    return `
    <article class="list-item">
      <div>
        <strong>${index + 1}. ${q?.title ?? "Frage nicht verfügbar"}</strong>
      </div>
      <button class="btn secondary small" data-remove="${id}">X</button>
    </article>`;
  }).join("") || `<p class="muted">Noch keine Fragen ausgewählt.</p>`;
}

function updateCreateLink() {
  let href = "new-question.html?return=quiz";
  if (quizId) href += `&returnId=${quizId}`;
  if (createQuestionBtn) createQuestionBtn.href = href;
}

pool.addEventListener("change", (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  if (event.target.checked) {
    if (!selectedIds.includes(id)) selectedIds.push(id);
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

// save quiz
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsertQuiz({
    id: quizId ?? undefined,
    name: nameInput.value,
    topicId: topicSelect.value, 
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
  selectedIds = [...quiz.questionIds];
}

[poolSearchText, poolSearchTopic, poolSearchType].forEach((control) => {
  control?.addEventListener("input", renderPool);
  control?.addEventListener("change", renderPool);
});

setTimeout(() => {
    populateTopics();
    refreshAllQuestions();
    hydrateQuiz();
    renderPool();
    renderSelected();
    updateCreateLink();
}, 200);