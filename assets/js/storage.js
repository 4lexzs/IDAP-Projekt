// change localhost to your ip if needed
const API_URL = "http://172.18.13.200:3000/api";
const SESSION_KEY = "wirtschaftsquiz_session";

let cache = { topics: [], questions: [], quizzes: [] };

// --- auth ---

export function getCurrentUser() {
  return sessionStorage.getItem(SESSION_KEY);
}

export function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function ensureLoggedIn() {
  const username = getCurrentUser();
  if (!username) {
    window.location.href = "auth.html";
    throw new Error("not logged in");
  }
  return username;
}

export async function loginUser(username, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) sessionStorage.setItem(SESSION_KEY, data.user);
    return data;
  } catch (e) {
    return { success: false, message: "server error" };
  }
}

export async function registerUser(username, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) sessionStorage.setItem(SESSION_KEY, data.user);
    return data;
  } catch (e) {
    return { success: false, message: "server error" };
  }
}

// --- data sync ---

export async function initAppData() {
  try {
    const res = await fetch(`${API_URL}/data`);
    cache = await res.json();
  } catch (e) {
    console.error("fetch failed", e);
  }
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// --- readers ---

export function getTopics() {
  return cache.topics || [];
}

export function getAllQuestions() {
  const topicMap = Object.fromEntries((cache.topics || []).map((t) => [t.id, t.name]));
  return (cache.questions || []).map(q => ({
    ...q,
    topicName: topicMap[q.topicId] ?? "Allgemein",
    owner: q.owner ?? "system"
  }));
}

export function getQuestions(filter = {}) {
  let questions = getAllQuestions();
  if (filter.quizId) {
    const quiz = getQuizById(filter.quizId);
    if (!quiz) return [];
    return quiz.questionIds.map((id) => questions.find(q => q.id === id)).filter(Boolean);
  }
  if (filter.topicId) {
    questions = questions.filter(q => q.topicId === filter.topicId);
  }
  return questions;
}

export function getQuizzes() {
  return cache.quizzes || [];
}

export function getQuestionById(id) {
  return (cache.questions || []).find(q => q.id === id);
}

export function getQuizById(id) {
  return (cache.quizzes || []).find(q => q.id === id);
}

export function getQuizByCode(code) {
  return (cache.quizzes || []).find(q => q.shareCode === code);
}

// --- writers ---

export async function addTopic(name, forceId = null) {
  const topic = { id: forceId || createId("topic"), name };
  if (!cache.topics) cache.topics = [];
  cache.topics.push(topic);
  
  await fetch(`${API_URL}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic)
  });
  return topic;
}

export async function addQuestion(payload) {
  const user = getCurrentUser();
  const id = createId("question");
  const newQuestion = {
    id,
    ...payload,
    owner: user,
    options: payload.options ?? [],
    answer: payload.answer ?? "",
    points: 1
  };

  if (!cache.questions) cache.questions = [];
  cache.questions.push(newQuestion);

  await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'x-user': user 
    },
    body: JSON.stringify(newQuestion)
  });
  return newQuestion;
}

export async function updateQuestion(questionId, patch) {
  const user = getCurrentUser();
  const question = cache.questions.find(q => q.id === questionId);
  if (!question) return;
  
  patch.points = 1;

  Object.assign(question, patch);

  const res = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'x-user': user 
    },
    body: JSON.stringify(question)
  });
  
  if (!res.ok) {
      alert("forbidden");
      window.location.reload(); 
  }
  return question;
}

export async function removeQuestion(questionId) {
  const user = getCurrentUser();
  cache.questions = cache.questions.filter(q => q.id !== questionId);
  cache.quizzes.forEach(quiz => {
    quiz.questionIds = quiz.questionIds.filter(id => id !== questionId);
  });

  const res = await fetch(`${API_URL}/questions/${questionId}`, { 
      method: 'DELETE',
      headers: { 'x-user': user }
  });
  
  if (!res.ok) {
      alert("forbidden");
      window.location.reload();
  }
}

export async function upsertQuiz(payload) {
  const user = getCurrentUser();
  let quiz = payload.id ? cache.quizzes.find(q => q.id === payload.id) : null;

  if (quiz) {
    quiz.name = payload.name;
    quiz.topicId = payload.topicId;
    quiz.questionIds = payload.questionIds;
  } else {
    quiz = {
      id: createId("quiz"),
      name: payload.name,
      topicId: payload.topicId,
      questionIds: payload.questionIds ?? [],
      shareCode: payload.shareCode ?? payload.name.replace(/\s+/g, "-").toUpperCase(),
      owner: user
    };
    if (!cache.quizzes) cache.quizzes = [];
    cache.quizzes.push(quiz);
  }

  const res = await fetch(`${API_URL}/quizzes`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'x-user': user
    },
    body: JSON.stringify(quiz)
  });
  
  if (!res.ok) {
      alert("error saving");
      window.location.reload();
  }
  return quiz;
}

export async function removeQuiz(quizId) {
  const user = getCurrentUser();
  cache.quizzes = cache.quizzes.filter(q => q.id !== quizId);
  const res = await fetch(`${API_URL}/quizzes/${quizId}`, { 
      method: 'DELETE',
      headers: { 'x-user': user }
  });
  
  if (!res.ok) {
      alert("forbidden");
      window.location.reload();
  }
}

export function seedState() {}