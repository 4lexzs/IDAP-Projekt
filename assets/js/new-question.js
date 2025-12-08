import { addQuestion, addTopic, getQuestionById, getTopics, updateQuestion } from "./storage.js";

const form = document.querySelector("#questionForm");
const topicSelect = document.querySelector("#topicId");
const typeSelect = document.querySelector("#type");
const pointsInput = document.querySelector("#points");
const titleInput = document.querySelector("#title");
const optionsWrapper = document.querySelector("#optionsWrapper");
const optionsList = document.querySelector("#optionsList");
const addOptionBtn = document.querySelector("#addOptionBtn");
const inputAnswerWrapper = document.querySelector("#inputAnswerWrapper");
const inputAnswer = document.querySelector("#inputAnswer");
const heading = document.querySelector("h1");

const params = new URLSearchParams(window.location.search);
const questionId = params.get("id");
let editingQuestion = questionId ? getQuestionById(questionId) : null;

if (questionId && !editingQuestion) {
  alert("Frage konnte nicht geladen werden. Es wird eine neue Frage erstellt.");
}

function populateTopics() {
  const topics = getTopics();
  topicSelect.innerHTML = topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`).join("");
  topicSelect.insertAdjacentHTML("beforeend", `<option value="__add">+ Neues Thema ...</option>`);
}

function ensureTopic(value) {
  if (value !== "__add") return value;
  const newName = prompt("Name des neuen Themas:");
  if (!newName) return topicSelect.value;
  const topic = addTopic(newName);
  populateTopics();
  topicSelect.value = topic.id;
  return topic.id;
}

function addOption(value = "", isCorrect = false) {
  const row = document.createElement("div");
  row.className = "option-row";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "option-input";
  input.placeholder = "Antwort ...";
  input.value = value;

  const radioLabel = document.createElement("label");
  radioLabel.className = "option-radio";
  radioLabel.title = "Als richtige Antwort markieren";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "correctOption";
  radio.checked = isCorrect || !optionsList.querySelector('input[type="radio"]:checked');

  radioLabel.appendChild(radio);
  row.append(input, radioLabel);
  optionsList.appendChild(row);
}

function setupOptions(type, question) {
  optionsList.innerHTML = "";
  if (type === "input") return;

  const isMultiple = type === "multiple";
  const fallback = isMultiple ? ["Antwort 1", "Antwort 2"] : ["Richtig", "Falsch"];
  const sourceOptions = question?.options?.length ? question.options : fallback;

  sourceOptions.forEach((option, index) => {
    addOption(option, question?.answer === index);
  });

  addOptionBtn.style.display = "inline-flex";
  if (!isMultiple) {
    // Für Richtig/Falsch mindestens zwei Antworten vorgeben
    while (optionsList.children.length < 2) {
      addOption("", false);
    }
  }
}

function handleTypeChange(initial = false) {
  const type = typeSelect.value;
  const question = initial ? editingQuestion : null;
  const showOptions = type === "multiple" || type === "truefalse";
  optionsWrapper.style.display = showOptions ? "block" : "none";
  inputAnswerWrapper.style.display = type === "input" ? "block" : "none";
  if (!showOptions) {
    addOptionBtn.style.display = "none";
    return;
  }
  setupOptions(type, question);
}

typeSelect.addEventListener("change", () => handleTypeChange(false));
topicSelect.addEventListener("change", (event) => ensureTopic(event.target.value));
addOptionBtn.addEventListener("click", () => addOption());

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