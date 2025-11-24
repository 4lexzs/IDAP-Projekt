import { getQuestions, getQuizById } from "./storage.js";

// TODO: Load quiz attempt from session storage
// TODO: Display all questions with user answers and correct solutions
// TODO: Calculate and display score
// TODO: Highlight correct/incorrect answers
}

function formatValue(question, value) {
  if (question.type === "input") {
    return value ?? "-";
  }
  if (value === undefined || value === null || value === "") return "-";
  return question.options?.[Number(value)] ?? value;
}

