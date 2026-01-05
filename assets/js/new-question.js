import { addQuestion, addTopic, getQuestionById, getTopics, updateQuestion } from "./storage.js";

const form = document.querySelector("#questionForm");
const topicSelect = document.querySelector("#topicId");
const addTopicBtn = document.querySelector("#addTopicBtn");
const typeSelect = document.querySelector("#type");
const titleInput = document.querySelector("#title");
const optionsWrapper = document.querySelector("#optionsWrapper");
const optionsList = document.querySelector("#optionsList");
const addOptionBtn = document.querySelector("#addOptionBtn");
const inputAnswerWrapper = document.querySelector("#inputAnswerWrapper");
const inputAnswer = document.querySelector("#inputAnswer");
const heading = document.querySelector("h1");
const submitBtn = document.querySelector("button[type='submit']");

const params = new URLSearchParams(window.location.search);
const questionId = params.get("id");
const returnTarget = params.get("return"); 
const returnId = params.get("returnId");

let editingQuestion = null;

if (returnTarget === "quiz") {
    submitBtn.textContent = "Erstellen und zurück";
}

// init form
setTimeout(() => {
    if (questionId) {
        editingQuestion = getQuestionById(questionId);
        if(editingQuestion) hydrateForm();
    }
    populateTopics();
    handleTypeChange(true);
}, 200);

function populateTopics() {
    const topics = getTopics();
    const html = topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`).join("");
    topicSelect.innerHTML = html;
    
    if (editingQuestion && !Array.from(topicSelect.options).some((opt) => opt.value === editingQuestion.topicId)) {
        const newOption = document.createElement("option");
        newOption.value = editingQuestion.topicId;
        newOption.textContent = "Importiertes Thema";
        topicSelect.insertBefore(newOption, topicSelect.firstChild);
        topicSelect.value = editingQuestion.topicId;
    } else if (editingQuestion) {
        topicSelect.value = editingQuestion.topicId;
    }
}

addTopicBtn.addEventListener("click", async () => {
    const newName = prompt("Name des neuen Themas:");
    if (!newName) return;
    const topic = await addTopic(newName);
    populateTopics();
    topicSelect.value = topic.id;
});

// dynamic inputs
function addOption(value = "", isCorrect = false) {
    const row = document.createElement("div");
    row.className = "list-item";
    row.style.padding = "0.5rem";
    
    const input = document.createElement("input");
    input.type = "text";
    input.className = "option-input";
    input.placeholder = "Antwort ...";
    input.value = value;
    input.style.flex = "1";
    input.style.marginRight = "1rem";
    
    const radioLabel = document.createElement("label");
    radioLabel.className = "option-radio";
    radioLabel.style.marginTop = "0";
    radioLabel.title = "Als richtige Antwort markieren";
    
    const inputType = typeSelect.value === "multiple" ? "checkbox" : "radio";
    
    const choiceInput = document.createElement("input");
    choiceInput.type = inputType;
    choiceInput.name = "correctOption";
    choiceInput.checked = isCorrect;
    
    choiceInput.style.width = "20px";
    choiceInput.style.height = "20px";
    
    radioLabel.appendChild(choiceInput);
    row.append(input, radioLabel);
    optionsList.appendChild(row);
}

function setupOptions(type, question) {
    optionsList.innerHTML = "";
    if (type === "input") return;
    
    const isMultiple = type === "multiple";
    const fallback = isMultiple ? ["Antwort 1", "Antwort 2"] : ["Richtig", "Falsch"];
    const sourceOptions = question?.options?.length ? question.options : fallback;
    
    const answerData = question?.answer;
    
    sourceOptions.forEach((option, index) => {
      let correct = false;
      if (Array.isArray(answerData)) {
          correct = answerData.includes(index);
      } else {
          correct = answerData === index;
      }
      addOption(option, correct);
    });
    
    addOptionBtn.style.display = "inline-flex";
    if (!isMultiple) {
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
addOptionBtn.addEventListener("click", () => addOption());

function hydrateForm() {
    if (!editingQuestion) return;
    heading.textContent = "Frage bearbeiten";
    titleInput.value = editingQuestion.title;
    typeSelect.value = editingQuestion.type;
    if (editingQuestion.type === "input") {
      inputAnswer.value = editingQuestion.answer ?? "";
    }
}

// submit handler
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const type = typeSelect.value;
  const topicId = topicSelect.value; 

  const payload = {
    title: formData.get("title").trim(),
    topicId,
    type,
    points: 1,
  };

  if (type === "input") {
    payload.options = [];
    payload.answer = inputAnswer.value.trim();
  } else {
    const optionRows = Array.from(optionsList.querySelectorAll(".list-item")).map((row) => {
      const label = row.querySelector(".option-input")?.value.trim();
      const isCorrect = row.querySelector('input[name="correctOption"]')?.checked;
      return { label, isCorrect };
    });
    
    const filtered = optionRows.filter((row) => row.label);
    if (filtered.length < 2) {
      alert("min 2 options");
      return;
    }
    
    if (type === "multiple") {
        const answerIndices = [];
        filtered.forEach((row, idx) => {
            if(row.isCorrect) answerIndices.push(idx);
        });
        
        if (answerIndices.length === 0) {
             alert("mark correct answer");
             return;
        }
        payload.answer = answerIndices;
    } else {
        const answerIndex = filtered.findIndex((row) => row.isCorrect);
        if (answerIndex === -1) {
          alert("mark correct answer");
          return;
        }
        payload.answer = answerIndex;
    }
    
    payload.options = filtered.map((row) => row.label);
  }

  if (editingQuestion) {
    await updateQuestion(editingQuestion.id, payload);
  } else {
    await addQuestion(payload);
  }

  if (returnTarget === "quiz") {
      if (returnId) {
        window.location.href = `quiz-editor.html?quiz=${returnId}`;
      } else {
        window.location.href = "quiz-editor.html";
      }
  } else {
      window.location.href = "question-bank.html";
  }
});