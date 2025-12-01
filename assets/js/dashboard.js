import { getQuestions, getQuizzes, getTopics, removeQuestion, removeQuiz } from "./storage.js";

const quizListEl = document.querySelector("#quizList");
const myQuestionsEl = document.querySelector("#myQuestions");

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

function renderQuizzes() {
  const quizzes = getQuizzes();
  const topics = getTopics();
  quizListEl.innerHTML =
    quizzes
      .map((quiz) => {
        const topic = topics.find((t) => t.id === quiz.topicId);
        return `
        <article class="list-item">
          <div>
            <strong>${quiz.name}</strong>
            <div class="quiz-meta">
              <span>${topic?.name ?? "Kein Thema"}</span>
              <span>${quiz.questionIds.length} Fragen</span>
              <span class="badge">${quiz.shareCode}</span>
            </div>
          </div>
          <div class="grid" style="grid-auto-flow:column;gap:0.5rem">
            <a class="btn secondary" href="quiz-editor.html?quiz=${quiz.id}">Bearbeiten</a>
            <button class="btn secondary" data-copy="${quiz.shareCode}">Link kopieren</button>
            <button class="btn danger" data-remove="${quiz.id}">Löschen</button>
          </div>
        </article>
      `;
      })
      .join("") || `<p class="muted">Noch keine Quizze vorhanden.</p>`;
}

function renderMyQuestions() {
  const questions = getQuestions();
  myQuestionsEl.innerHTML =
    questions
      .map(
        (question) => `
        <article class="list-item">
          <div>
            <strong>${question.title}</strong>
            <div class="quiz-meta">
              <span class="badge">${typeLabel(question.type)}</span>
              <span class="badge">${question.points ?? 1} Punkte</span>
            </div>
          </div>
          <div class="grid" style="grid-auto-flow:column;gap:0.5rem">
            <a class="btn secondary" href="new-question.html?id=${question.id}">Bearbeiten</a>
            <button class="btn danger" data-remove-question="${question.id}">Löschen</button>
          </div>
        </article>`
      )
      .join("") || `<p class="muted">Noch keine eigenen Fragen vorhanden.</p>`;
}

quizListEl.addEventListener("click", (event) => {
  const copy = event.target.dataset.copy;
  if (copy) {
    navigator.clipboard.writeText(`${window.location.origin}/take-quiz.html?code=${copy}`);
    event.target.textContent = "Kopiert!";
    setTimeout(renderQuizzes, 1000);
    return;
  }

  const remove = event.target.dataset.remove;
  if (remove) {
    removeQuiz(remove);
    renderQuizzes();
  }
});

myQuestionsEl.addEventListener("click", (event) => {
  const questionId = event.target.dataset.removeQuestion;
  if (!questionId) return;
  removeQuestion(questionId);
  renderMyQuestions();
});

function renderAll() {
  renderQuizzes();
  renderMyQuestions();
}

renderAll();

