import { getQuestions, getQuizByCode, getQuizById } from "./storage.js";

// TODO: Load quiz by code or ID parameter
// TODO: Render quiz questions (multiple choice, true/false, input)
// TODO: Handle form submission and save answers
// TODO: Redirect to review page with results
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

