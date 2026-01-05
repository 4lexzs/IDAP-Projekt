import { getAllQuestions, getCurrentUser, getTopics, removeQuestion, addTopic } from "./storage.js";

const listEl = document.querySelector("#questionList");
const searchText = document.querySelector("#searchText");
const searchTopic = document.querySelector("#searchTopic");
const searchType = document.querySelector("#searchType");
const addTopicBtn = document.querySelector("#addTopicBtn");
const currentUser = getCurrentUser();

function typeLabel(type) {
  switch (type) {
    case "multiple": return "Multiple Choice";
    case "truefalse": return "Richtig / Falsch";
    default: return "Eingabe";
  }
}

function updateTopicFilter() {
  const currentValue = searchTopic.value;
  const topics = getTopics(); 
  
  searchTopic.innerHTML = `
    <option value="">Alle Themen</option>
    ${topics.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}
  `;
  
  if (topics.some(t => t.id === currentValue)) {
    searchTopic.value = currentValue;
  }
}

// create topic
addTopicBtn?.addEventListener("click", async () => {
    const newName = prompt("Name des neuen Themas:");
    if (!newName) return;
    const topic = await addTopic(newName);
    updateTopicFilter();
    searchTopic.value = topic.id;
    render();
});

function filterQuestions(all) {
  const text = searchText.value.trim().toLowerCase();
  const topicId = searchTopic.value;
  const type = searchType.value;
  
  return all.filter((question) => {
    if (topicId && question.topicId !== topicId) return false;
    if (type && question.type !== type) return false;
    if (text) {
      const haystack = `${question.title} ${(question.options ?? []).join(" ")}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}

function render() {
  const allQuestions = getAllQuestions();
  
  if (searchTopic.options.length <= 1 || searchTopic.options.length !== getTopics().length + 1) {
      updateTopicFilter();
  }
  
  const filtered = filterQuestions(allQuestions);

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="muted">Keine Fragen gefunden.</p>`;
    return;
  }

  const grouped = filtered.reduce((acc, question) => {
    const key = question.topicName ?? "Allgemein";
    acc[key] = acc[key] ?? [];
    acc[key].push(question);
    return acc;
  }, {});

  listEl.innerHTML = Object.entries(grouped).map(([topicName, questions]) => `
    <section class="question-block">
      <h3>${topicName}</h3>
      ${questions.map((question) => {
          const isOwner = question.owner === currentUser;
          return `
            <article class="list-item">
              <div>
                <strong>${question.title}</strong>
                <div class="quiz-meta">
                  <span class="badge">${typeLabel(question.type)}</span>
                  <span class="badge badge-author">${question.owner}</span>
                </div>
              </div>
              ${isOwner ? `
              <div class="grid" style="grid-auto-flow: column; gap: 0.5rem">
                  <a class="btn secondary" href="new-question.html?id=${question.id}">Bearbeiten</a>
                  <button class="btn danger" data-remove="${question.id}">Löschen</button>
              </div>` : `<div class="muted" style="font-size:0.8rem">Nur Lesen</div>`}
            </article>`;
        }).join("")}
    </section>`
  ).join("");
}

listEl.addEventListener("click", async (event) => {
  const id = event.target.dataset.remove;
  if (!id) return;
  if(!confirm("delete question?")) return;
  await removeQuestion(id);
  render();
});

[searchText, searchTopic, searchType].forEach((control) => {
  control?.addEventListener("input", render);
  control?.addEventListener("change", render);
});

setTimeout(() => {
    updateTopicFilter();
    render();
}, 200);