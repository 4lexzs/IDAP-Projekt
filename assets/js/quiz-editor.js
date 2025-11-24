import { getTopics, upsertQuiz } from "./storage.js";

// TODO: Load quiz if editing, else create new
// TODO: Populate topics select
// TODO: Render question pool with search/filter
// TODO: Render selected questions with reordering
// TODO: Handle adding/removing questions from quiz
// TODO: Handle quiz save
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

