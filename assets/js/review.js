import { getQuestions, getQuizById, initAppData } from "./storage.js";

const attemptRaw = sessionStorage.getItem("wirtschaftsquiz_attempt");
const params = new URLSearchParams(window.location.search);
const quizId = params.get("quiz");

const titleEl = document.querySelector("#reviewTitle");
const listEl = document.querySelector("#reviewList");
const scoreContainer = document.querySelector("#scoreContainer");

// render results
(async () => {
    await initAppData();

    if (!attemptRaw) {
      listEl.innerHTML = `<p class="muted" style="text-align:center">Keine Ergebnisse gefunden.</p>`;
      scoreContainer.style.display = "none";
    } else {
      const attempt = JSON.parse(attemptRaw);
      
      const quiz = getQuizById(attempt.quizId);
      const questions = getQuestions({ quizId: attempt.quizId });
      
      titleEl.textContent = `Ergebnis: ${quiz?.name ?? "Quiz"}`;

      // calc score
      let achieved = 0;
      const total = questions.length;
      
      const html = questions.map((question, index) => {
          const answerObj = attempt.answers.find((a) => a.questionId === question.id);
          const response = answerObj ? answerObj.response : null;
          
          const correct = isCorrect(question, response);
          if (correct) achieved += 1;
          
          const statusClass = correct ? "correct" : "incorrect";
          
          return `
          <div class="review-item ${statusClass}">
            <h3 style="margin-bottom:0.5rem">${index + 1}. ${question.title}</h3>
            
            <div class="review-detail">
                <div style="margin-bottom:0.5rem">
                    <span class="muted">Deine Antwort:</span><br>
                    <strong>${formatValue(question, response)}</strong>
                </div>
                <div>
                    <span class="muted">Richtige Lösung:</span><br>
                    <strong>${formatValue(question, question.answer)}</strong>
                </div>
            </div>

            <div class="status-badge ${statusClass}">
                ${correct ? "Richtig (+1)" : "Falsch (0)"}
            </div>
          </div>`;
        }).join("");
      
      const percentage = Math.round((achieved / total) * 100);
      let message = "Weiter üben!";
      if (percentage >= 50) message = "Gut gemacht!";
      if (percentage >= 80) message = "Ausgezeichnet!";
      
      scoreContainer.innerHTML = `
        <div class="score-card">
            <div class="score-big">${achieved} / ${total}</div>
            <div class="score-text">${percentage}% - ${message}</div>
        </div>
      `;

      listEl.innerHTML = html;
    }
})();

function isCorrect(question, response) {
  if (question.type === "input") {
    return (response ?? "").trim().toLowerCase() === (question.answer ?? "").trim().toLowerCase();
  }
  if (Array.isArray(question.answer)) {
      if (!Array.isArray(response)) return false;
      const sortedResp = [...response].sort().toString();
      const sortedAns = [...question.answer].sort().toString();
      return sortedResp === sortedAns;
  }
  return Number(response) === Number(question.answer);
}

function formatValue(question, value) {
  if (question.type === "input") return value || "<i>Keine Antwort</i>";
  if (Array.isArray(value)) {
      if (value.length === 0) return "<i>Keine Antwort</i>";
      return value.map(idx => question.options[Number(idx)]).join(", ");
  }
  if (value === undefined || value === null || value === "") return "<i>Keine Antwort</i>";
  return question.options?.[Number(value)] ?? value;
}