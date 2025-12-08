import { getQuestions, getQuizById } from "./storage.js";

const attemptRaw = sessionStorage.getItem("wirtschaftsquiz_attempt");
const params = new URLSearchParams(window.location.search);
const quizId = params.get("quiz");

const titleEl = document.querySelector("#reviewTitle");
const scoreEl = document.querySelector("#scoreLine");
const listEl = document.querySelector("#reviewList");

if (!attemptRaw) {
  listEl.innerHTML = `<p class="muted">Keine Antworten gefunden. Bitte zuerst ein Quiz absolvieren.</p>`;
} else {
  const attempt = JSON.parse(attemptRaw);
  if (quizId && attempt.quizId !== quizId) {
    listEl.innerHTML = `<p class="muted">Antworten passen nicht zum ausgewählten Quiz.</p>`;
  } else {
    const quiz = getQuizById(attempt.quizId);
    const questions = getQuestions({ quizId: attempt.quizId });
    titleEl.textContent = `${quiz?.name ?? "Quiz"} – Antworten`;

    let achieved = 0;
    const total = questions.reduce((sum, q) => sum + (q.points ?? 1), 0);

    const html = questions
      .map((question, index) => {
        const answer = attempt.answers.find((a) => a.questionId === question.id)?.response;
        const correct = isCorrect(question, answer);
        if (correct) achieved += question.points ?? 1;
        return `
        <div class="question-block" style="border-color:${correct ? '#5cb85c' : '#ff5f56'}">
          <h3>${index + 1}. ${question.title}</h3>
          <p><strong>Deine Antwort:</strong> ${formatValue(question, answer)}</p>
          <p><strong>Korrekte Lösung:</strong> ${formatValue(question, question.answer)}</p>
          <span class="badge">${question.points ?? 1} Punkte · ${correct ? "Richtig" : "Falsch"}</span>
        </div>`;
      })
      .join("");

    scoreEl.textContent = `Punkte: ${achieved} / ${total}`;
    listEl.innerHTML = html;
  }
}

function isCorrect(question, response) {
  if (question.type === "input") {
    return (response ?? "").trim().toLowerCase() === (question.answer ?? "").trim().toLowerCase();
  }
  return Number(response) === Number(question.answer);
}

function formatValue(question, value) {
  if (question.type === "input") {
    return value ?? "-";
  }
  if (value === undefined || value === null || value === "") return "-";
  return question.options?.[Number(value)] ?? value;
}

