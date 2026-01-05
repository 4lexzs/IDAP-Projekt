import { getQuestions, getQuizByCode, getQuizById, initAppData } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const quizIdParam = params.get("quiz");

const titleEl = document.querySelector("#quizTitle");
const form = document.querySelector("#takeQuizForm");

// init quiz
(async () => {
  await initAppData();

  const quiz = code ? getQuizByCode(code) : getQuizById(quizIdParam);

  if (!quiz) {
    form.innerHTML = `<p class="muted" style="text-align:center">Quiz nicht gefunden.</p>`;
  } else {
    const questions = getQuestions({ quizId: quiz.id });
    titleEl.textContent = quiz.name;

    // render questions
    form.innerHTML = questions.map((question, index) => {
        const prefix = `q-${question.id}`;
        
        let content = "";

        if (question.type === "input") {
          content = `
            <textarea name="${prefix}" placeholder="Deine Antwort hier eingeben..." required></textarea>
          `;
        } else {
            const isMultiSelect = Array.isArray(question.answer);
            const inputType = isMultiSelect ? "checkbox" : "radio";
            
            const optionsHtml = question.options?.length > 0
                ? question.options.map((option, idx) => `
                    <label class="option-label">
                      <input type="${inputType}" name="${prefix}" value="${idx}" ${!isMultiSelect ? "required" : ""} />
                      <span>${option}</span>
                    </label>`).join("")
                : "";
                
             content = `<div class="answer-options">${optionsHtml}</div>`;
        }
            
        return `
          <div class="quiz-question-card">
            <h3 class="question-title"><span style="color:var(--primary); margin-right:0.5rem">#${index + 1}</span> ${question.title}</h3>
            ${content}
          </div>`;
      }).join("");

    // handle selection
    form.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", (e) => {
            const container = e.target.closest(".answer-options");
            if (!container) return;

            if (e.target.type === "radio") {
                container.querySelectorAll(".option-label").forEach(l => l.classList.remove("selected"));
            }
            
            const label = e.target.closest(".option-label");
            if (e.target.checked) label.classList.add("selected");
            else label.classList.remove("selected");
        });
    });

    const btn = document.createElement("button");
    btn.type = "submit";
    btn.className = "btn primary";
    btn.style.width = "100%";
    btn.style.marginTop = "1rem";
    btn.style.fontSize = "1.1rem";
    btn.textContent = "Quiz abschliessen";
    form.appendChild(btn);

    // submit
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      
      const answers = questions.map((question) => {
         const prefix = `q-${question.id}`;
         let response;
         
         if (question.type === "input") {
             response = formData.get(prefix);
         } else if (Array.isArray(question.answer)) {
             response = formData.getAll(prefix).map(Number);
         } else {
             response = formData.get(prefix);
         }
         
         return { questionId: question.id, response: response };
      });
      
      sessionStorage.setItem("wirtschaftsquiz_attempt", JSON.stringify({
          quizId: quiz.id,
          answers,
      }));
      window.location.href = `review.html?quiz=${quiz.id}`;
    });
  }
})();