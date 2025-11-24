import { addQuestion, addTopic, getQuestionById, getTopics, updateQuestion } from "./storage.js";

// TODO: Load question if editing, else create new
// TODO: Populate topic select
// TODO: Handle question type changes (multiple/truefalse/input)
// TODO: Handle form submission (create or update question)

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const type = typeSelect.value;
  const topicId = ensureTopic(formData.get("topicId"));

  const payload = {
    title: formData.get("title").trim(),
    topicId,
    type,
    points: Number(formData.get("points")) || 1,
  };

  if (type === "input") {
    payload.options = [];
    payload.answer = inputAnswer.value.trim();
  } else {
    const optionRows = Array.from(optionsList.querySelectorAll(".option-row")).map((row) => {
      const label = row.querySelector(".option-input")?.value.trim();
      const isCorrect = row.querySelector('input[type="radio"]')?.checked;
      return { label, isCorrect };
    });
    const filtered = optionRows.filter((row) => row.label);
    if (filtered.length < 2) {
      alert("Bitte mindestens zwei Antwortmöglichkeiten angeben.");
      return;
    }
    const answerIndex = filtered.findIndex((row) => row.isCorrect);
    if (answerIndex === -1) {
      alert("Bitte markiere die richtige Antwort.");
      return;
    }
    payload.options = filtered.map((row) => row.label);
    payload.answer = answerIndex;
  }

  if (editingQuestion) {
    updateQuestion(editingQuestion.id, payload);
  } else {
    addQuestion(payload);
  }
  window.location.href = "question-bank.html";
});

function hydrateForm() {
  if (!editingQuestion) return;
  heading.textContent = "Frage bearbeiten";
  titleInput.value = editingQuestion.title;
  topicSelect.value = editingQuestion.topicId;
  pointsInput.value = editingQuestion.points ?? 1;
  typeSelect.value = editingQuestion.type;
  if (editingQuestion.type === "input") {
    inputAnswer.value = editingQuestion.answer ?? "";
  }
}

populateTopics();
if (editingQuestion) {
  // ensure topic option exists
  if (!Array.from(topicSelect.options).some((opt) => opt.value === editingQuestion.topicId)) {
    const newOption = document.createElement("option");
    newOption.value = editingQuestion.topicId;
    newOption.textContent = "Importiertes Thema";
    topicSelect.insertBefore(newOption, topicSelect.firstChild);
  }
}
hydrateForm();
handleTypeChange(true);

