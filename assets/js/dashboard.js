import { getQuestions, getQuizzes, getTopics, removeQuestion, removeQuiz, getCurrentUser } from "./storage.js";

const quizListEl = document.querySelector("#quizList");
const myQuestionsEl = document.querySelector("#myQuestions");
const currentUser = getCurrentUser();

function typeLabel(type) {
  switch (type) {
    case "multiple": return "Multiple Choice";
    case "truefalse": return "Richtig / Falsch";
    default: return "Eingabe";
  }
}

// clipboard helper
function copyToClipboard(text, targetBtn) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedFeedback(targetBtn);
        }).catch(err => {
            fallbackCopyTextToClipboard(text, targetBtn);
        });
    } else {
        fallbackCopyTextToClipboard(text, targetBtn);
    }
}

function fallbackCopyTextToClipboard(text, targetBtn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if(successful) showCopiedFeedback(targetBtn);
        else prompt("link:", text);
    } catch (err) {
        console.error('fallback failed', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopiedFeedback(btn) {
    const originalText = btn.textContent;
    btn.textContent = "Kopiert!";
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
}

// render quizzes
function renderQuizzes() {
  const quizzes = getQuizzes();
  const topics = getTopics();
  
  const myQuizzes = quizzes.filter(q => q.owner === currentUser);

  quizListEl.innerHTML = myQuizzes.map((quiz) => {
    const topic = topics.find((t) => t.id === quiz.topicId);
    const shareLink = `${window.location.origin}/take-quiz.html?code=${quiz.shareCode}`;
    
    return `
    <article class="list-item">
      <div>
        <strong>${quiz.name}</strong>
        <div class="quiz-meta" style="margin-top: 0.5rem;">
          <span class="badge">${topic?.name ?? "Kein Thema"}</span>
          <span class="badge">${quiz.questionIds.length} Fragen</span>
          <span class="badge" style="font-weight:bold; border-color:var(--primary); color:var(--primary)">Code: ${quiz.shareCode}</span>
        </div>
      </div>
      <div class="grid" style="grid-auto-flow:column; gap:0.5rem; align-items:center;">
        <a class="btn primary small" href="take-quiz.html?code=${quiz.shareCode}">Starten</a>
        <a class="btn secondary small" href="quiz-editor.html?quiz=${quiz.id}">Bearbeiten</a>
        <button class="btn secondary small btn-copy" data-link="${shareLink}">Link</button>
        <button class="btn danger small" data-remove="${quiz.id}">Löschen</button>
      </div>
    </article>`;
  }).join("") || `<p class="muted">Du hast noch keine Quizze erstellt.</p>`;
}

function renderMyQuestions() {
  const questions = getQuestions();
  const myQuestions = questions.filter(q => q.owner === currentUser);
  
  myQuestionsEl.innerHTML = myQuestions.map((question) => `
    <article class="list-item">
      <div>
        <strong>${question.title}</strong>
        <div class="quiz-meta" style="margin-top: 0.25rem;">
          <span class="badge">${typeLabel(question.type)}</span>
        </div>
      </div>
      <div class="grid" style="grid-auto-flow:column; gap:0.5rem">
        <a class="btn secondary small" href="new-question.html?id=${question.id}">Bearbeiten</a>
        <button class="btn danger small" data-remove-question="${question.id}">Löschen</button>
      </div>
    </article>`
  ).join("") || `<p class="muted">Du hast noch keine eigenen Fragen erstellt.</p>`;
}

// listeners
quizListEl.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.classList.contains("btn-copy")) {
      const link = target.dataset.link;
      copyToClipboard(link, target);
      return;
  }

  const removeId = target.dataset.remove;
  if (removeId) {
    if(!confirm("delete quiz?")) return;
    await removeQuiz(removeId);
    renderQuizzes();
  }
});

myQuestionsEl.addEventListener("click", async (event) => {
  const questionId = event.target.dataset.removeQuestion;
  if (!questionId) return;
  if(!confirm("delete question?")) return;
  await removeQuestion(questionId);
  renderMyQuestions();
});

function renderAll() {
  renderQuizzes();
  renderMyQuestions();
}

setTimeout(renderAll, 100);