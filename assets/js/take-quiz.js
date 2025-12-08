import { getQuestions, getQuizByCode, getQuizById } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const quizIdParam = params.get("quiz");

const titleEl = document.querySelector("#quizTitle");
const form = document.querySelector("#takeQuizForm");

const quiz = code ? getQuizByCode(code) : getQuizById(quizIdParam);

if (!quiz) {
  form.innerHTML = `<p class="muted">Quiz nicht gefunden. Bitte Link überprüfen.</p>`;
} else {
  const questions = getQuestions({ quizId: quiz.id });
  titleEl.textContent = `${quiz.name} – ${questions.reduce((sum, q) => sum + (q.points ?? 1), 0)} Punkte`;

  form.innerHTML = questions
    .map((question, index) => {
      const prefix = `q-${question.id}`;
      if (question.type === "input") {
        return `
        <div class="question-block">
          <h3>${index + 1}. ${question.title}</h3>
          <textarea name="${prefix}" placeholder="Antwort ..." required></textarea>
        </div>`;
      }
      const options =
        question.options?.length > 0
          ? question.options
              .map(
                (option, idx) => `
                  <label>
                    <input type="radio" name="${prefix}" value="${idx}" required />
                    ${option}
                  </label>`
              )
              .join("")
          : "";
      return `
        <div class="question-block">
          <h3>${index + 1}. ${question.title}</h3>
          <div class="answers">
            ${options}
          </div>
        </div>`;
    })
    .join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const answers = questions.map((question) => ({
      questionId: question.id,
      response: formData.get(`q-${question.id}`),
    }));
    sessionStorage.setItem(
      "wirtschaftsquiz_attempt",
      JSON.stringify({
        quizId: quiz.id,
        answers,
      })
    );
    window.location.href = `review.html?quiz=${quiz.id}`;
  });
}

