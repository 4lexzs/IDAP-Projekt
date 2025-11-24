import { getAllQuestions, getCurrentUser, removeQuestion } from "./storage.js";

// TODO: Display all questions grouped by topic
// TODO: Handle search and filtering
// TODO: Handle question deletion
// TODO: Show only edit/delete buttons for own questions
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

