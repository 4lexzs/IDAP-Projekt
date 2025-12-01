import { getAllQuestions, getCurrentUser, removeQuestion, seedState } from "./storage.js";

const listEl = document.querySelector("#questionList");
const seedBtn = document.querySelector("#seedState");
const searchText = document.querySelector("#searchText");
const searchTopic = document.querySelector("#searchTopic");
const searchType = document.querySelector("#searchType");
const currentUser = getCurrentUser();

function typeLabel(type) {
  switch (type) {
    case "multiple":
      return "Multiple Choice";
    case "truefalse":
      return "Richtig / Falsch";
    default:
      return "Eingabe";
  }
}

function updateTopicFilter(all) {
  const currentValue = searchTopic.value;
  const topics = [...new Set(all.map((question) => question.topicName).filter(Boolean))];
  searchTopic.innerHTML = `<option value="">Alle Themen</option>${topics.map((topic) => `<option value="${topic}">${topic}</option>`).join("")}`;
  if (topics.includes(currentValue)) {
    searchTopic.value = currentValue;
  }
}

function filterQuestions(all) {
  const text = searchText.value.trim().toLowerCase();
  const topic = searchTopic.value;
  const type = searchType.value;
  return all.filter((question) => {
    if (topic && question.topicName !== topic) return false;
    if (type && question.type !== type) return false;
    if (text) {
      const haystack = `${question.title} ${(question.options ?? []).join(" ")} ${(question.answer ?? "")}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}

function render() {
  const allQuestions = getAllQuestions();
  updateTopicFilter(allQuestions);
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

  listEl.innerHTML = Object.entries(grouped)
    .map(
      ([topicName, questions]) => `
        <section class="question-block">
          <h3>${topicName}</h3>
          ${questions
            .map((question) => {
              const isOwner = question.owner === currentUser;
              return `
                <article class="list-item">
                  <div>
                    <strong>${question.title}</strong>
                    <div class="quiz-meta">
                      <span class="badge">${typeLabel(question.type)}</span>
                      <span class="badge">${question.points ?? 1} Punkte</span>
                      <span class="badge">Autor · ${question.owner}</span>
                    </div>
                  </div>
                  ${
                    isOwner
                      ? `<div class="grid" style="grid-auto-flow: column; gap: 0.5rem">
                          <a class="btn secondary" href="new-question.html?id=${question.id}">Bearbeiten</a>
                          <button class="btn danger" data-remove="${question.id}">Löschen</button>
                        </div>`
                      : ""
                  }
                </article>`;
            })
            .join("")}
        </section>`
    )
    .join("");
}

listEl.addEventListener("click", (event) => {
  const id = event.target.dataset.remove;
  if (!id) return;
  removeQuestion(id);
  render();
});

seedBtn?.addEventListener("click", () => {
  seedState();
  render();
});

[searchText, searchTopic, searchType].forEach((control) => {
  control?.addEventListener("input", render);
  control?.addEventListener("change", render);
});

render();

