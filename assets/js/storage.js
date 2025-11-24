// Storage module - Data persistence with localStorage
// Functions to be implemented:

export function getState() {
  // TODO: Read and return state from localStorage
}

export function getTopics() {
  // TODO: Get all topics
}

export function getQuestions(filter = {}) {
  // TODO: Get questions, optionally filtered
}

export function getQuizzes() {
  // TODO: Get all quizzes
}

export function getQuestionById(questionId) {
  // TODO: Get a single question by ID
}

export function addTopic(name) {
  // TODO: Add new topic
}

export function addQuestion(payload) {
  // TODO: Add new question
}

export function updateQuestion(questionId, patch) {
  // TODO: Update a question
}

export function removeQuestion(questionId) {
  // TODO: Remove a question
}

export function getQuizById(id) {
  // TODO: Get a single quiz by ID
}

export function upsertQuiz(payload) {
  // TODO: Create or update a quiz
}

export function removeQuiz(quizId) {
  // TODO: Remove a quiz
}

export function getCurrentUser() {
  // TODO: Get currently logged in user
}

export function logoutUser() {
  // TODO: Logout current user
}

export function ensureLoggedIn() {
  // TODO: Verify user is logged in, redirect if not
}

export function loginUser(username, password) {
  // TODO: Authenticate user with credentials
}

export function registerUser(username, password) {
  // TODO: Register new user account
}

