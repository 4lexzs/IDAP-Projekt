const LEGACY_STATE_KEY = "wirtschaftsquiz_state";
const USERS_KEY = "wirtschaftsquiz_users";
const SESSION_KEY = "wirtschaftsquiz_session";
const TOPICS_KEY = "wirtschaftsquiz_topics";

const defaultState = {
  topics: [],
  questions: [
    // Multiple Choice Questions (10)
    {
      id: "question-mc-1",
      topicId: "topic-makro",
      title: "Was ist der Unterschied zwischen Bruttoinlandsprodukt (BIP) und Nettoinlandsprodukt (NIP)?",
      type: "multiple",
      points: 2,
      options: ["NIP ist BIP minus Abschreibungen", "Es gibt keinen Unterschied", "BIP ist nur für große Länder", "NIP ist älter als BIP"],
      answer: 0,
    },
    {
      id: "question-mc-2",
      topicId: "topic-produktionsfaktoren",
      title: "Welche der folgenden ist KEINE klassische Produktionsfaktor?",
      type: "multiple",
      points: 2,
      options: ["Arbeit", "Kapital", "Boden", "Zeit"],
      answer: 3,
    },
    {
      id: "question-mc-3",
      topicId: "topic-nachfrage",
      title: "Was versteht man unter 'Elastizität der Nachfrage'?",
      type: "multiple",
      points: 2,
      options: ["Die Fähigkeit eines Produkts, seine Form zu ändern", "Die Reaktion der Nachfrage auf Preisveränderungen", "Die Lagerfähigkeit eines Produkts", "Die Transportfähigkeit einer Ware"],
      answer: 1,
    },
    {
      id: "question-mc-4",
      topicId: "topic-wirtschaftssysteme",
      title: "Welches Wirtschaftssystem kombiniert Marktmechanismen mit staatlicher Regulierung?",
      type: "multiple",
      points: 2,
      options: ["Planwirtschaft", "Sozialistische Wirtschaft", "Soziale Marktwirtschaft", "Kapitalismus ohne Grenzen"],
      answer: 2,
    },
    {
      id: "question-mc-5",
      topicId: "topic-marktstrukturen",
      title: "Was ist ein 'Monopol' in der Wirtschaft?",
      type: "multiple",
      points: 2,
      options: ["Ein Unternehmen mit mehreren Konkurrenten", "Ein Unternehmen, das ein Produkt allein anbietet", "Eine Partnerschaft zwischen zwei Firmen", "Ein Zusammenschluss von Arbeiterverbänden"],
      answer: 1,
    },
    {
      id: "question-mc-6",
      topicId: "topic-inflation",
      title: "Welcher Index misst die Inflation im Konsumentenbereich?",
      type: "multiple",
      points: 2,
      options: ["DAX-Index", "Verbraucherpreisindex (VPI)", "Produktpreisindex", "Börsenindex"],
      answer: 1,
    },
    {
      id: "question-mc-7",
      topicId: "topic-management",
      title: "Was versteht man unter 'Outsourcing'?",
      type: "multiple",
      points: 2,
      options: ["Die Einstellung neuer Mitarbeiter", "Das Auslagern von Unternehmensaufgaben an externe Partner", "Die Eröffnung einer Filiale", "Der Verkauf eines Unternehmens"],
      answer: 1,
    },
    {
      id: "question-mc-8",
      topicId: "topic-finanzierung",
      title: "Welche Aussage über den Zinssatz ist korrekt?",
      type: "multiple",
      points: 2,
      options: ["Er wird immer von der Regierung festgelegt", "Er ist der Preis für geliehenes Geld", "Er kann niemals sinken", "Er beträgt immer 5%"],
      answer: 1,
    },
    {
      id: "question-mc-9",
      topicId: "topic-marketing",
      title: "Was ist 'Branding'?",
      type: "multiple",
      points: 2,
      options: ["Das Verbrennen von Produkten", "Das Schaffen und Verwaltung einer Markenidentität", "Das Vergeben von Lizenzen", "Das Ändern von Produktnamen"],
      answer: 1,
    },
    {
      id: "question-mc-10",
      topicId: "topic-makro",
      title: "Welche der folgenden Aussagen zum BIP ist FALSCH?",
      type: "multiple",
      points: 2,
      options: ["BIP misst den Wert aller Waren und Dienstleistungen", "BIP berücksichtigt illegale Aktivitäten", "BIP kann negativ wachsen (Rezession)", "BIP wird jährlich gemessen"],
      answer: 1,
    },
    // True/False Questions (10)
    {
      id: "question-tf-1",
      topicId: "topic-inflation",
      title: "Eine Inflation bedeutet, dass die Preise sinken.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-2",
      topicId: "topic-arbeitsmarkt",
      title: "Der Mindestlohn wird ausschließlich vom Arbeitgeber bestimmt.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-3",
      topicId: "topic-investition",
      title: "Diversifikation ist eine Strategie zur Risikoverteilung im Portfolio.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 0,
    },
    {
      id: "question-tf-4",
      topicId: "topic-außenhandel",
      title: "Ein positiver Außenhandelssaldo bedeutet, dass ein Land mehr importiert als exportiert.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-5",
      topicId: "topic-csr",
      title: "Corporate Social Responsibility (CSR) befasst sich mit sozialer und ökologischer Verantwortung von Unternehmen.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 0,
    },
    {
      id: "question-tf-6",
      topicId: "topic-wettbewerb",
      title: "Freier Wettbewerb führt immer zu den besten Ergebnissen für den Verbraucher.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-7",
      topicId: "topic-venture",
      title: "Ein Venture Capitalist investiert in etablierte große Unternehmen.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-8",
      topicId: "topic-bilanz",
      title: "Lagerbestand ist ein Anlage- oder Umweltvermögen.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 1,
    },
    {
      id: "question-tf-9",
      topicId: "topic-geldpolitik",
      title: "Die Europäische Zentralbank (EZB) kontrolliert die Geldmenge in der Eurozone.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 0,
    },
    {
      id: "question-tf-10",
      topicId: "topic-steuersystem",
      title: "Steuerprogression bedeutet, dass höhere Einkommen mit höheren Steuersätzen besteuert werden.",
      type: "truefalse",
      points: 1,
      options: ["Richtig", "Falsch"],
      answer: 0,
    },
    // Open-ended Questions (10)
    {
      id: "question-open-1",
      topicId: "topic-kostenrechnung",
      title: "Erklären Sie den Unterschied zwischen Fixkosten und variablen Kosten.",
      type: "input",
      points: 3,
      options: [],
      answer: "Fixkosten sind unabhängig von der Produktionsmenge (z.B. Miete), variable Kosten ändern sich mit der Produktion (z.B. Material)",
    },
    {
      id: "question-open-2",
      topicId: "topic-marketing",
      title: "Was sind die vier P's des Marketing?",
      type: "input",
      points: 3,
      options: [],
      answer: "Produkt, Preis (Price), Platzierung (Place), Promotion/Werbung",
    },
    {
      id: "question-open-3",
      topicId: "topic-betriebswirtschaft",
      title: "Definieren Sie 'Gewinn' in der Betriebswirtschaft.",
      type: "input",
      points: 3,
      options: [],
      answer: "Gewinn = Einnahmen - Ausgaben (oder Umsatz minus Kosten)",
    },
    {
      id: "question-open-4",
      topicId: "topic-arbeitsmarkt",
      title: "Welche Arten von Arbeitslosigkeit gibt es?",
      type: "input",
      points: 3,
      options: [],
      answer: "Zyklisch, strukturell, friktional, saisonal",
    },
    {
      id: "question-open-5",
      topicId: "topic-kostenrechnung",
      title: "Was versteht man unter 'Break-Even-Point'?",
      type: "input",
      points: 3,
      options: [],
      answer: "Der Punkt, an dem Einnahmen gleich Ausgaben sind (kein Gewinn, kein Verlust)",
    },
    {
      id: "question-open-6",
      topicId: "topic-außenhandel",
      title: "Erklären Sie das Prinzip der komparativen Kostenvorteile.",
      type: "input",
      points: 3,
      options: [],
      answer: "Ein Land/Unternehmen sollte sich auf Produkte konzentrieren, bei denen es relative Kostenvorteile hat",
    },
    {
      id: "question-open-7",
      topicId: "topic-unternehmensstrukturen",
      title: "Was ist eine 'Holdinggesellschaft'?",
      type: "input",
      points: 3,
      options: [],
      answer: "Ein Unternehmen, das Anteile an anderen Unternehmen hält, ohne selbst Produkte/Dienstleistungen herzustellen",
    },
    {
      id: "question-open-8",
      topicId: "topic-finanzierung",
      title: "Definieren Sie 'Amortisation'.",
      type: "input",
      points: 3,
      options: [],
      answer: "Die Rückzahlung einer Schuld in regelmäßigen Raten oder der Wertverlust eines Vermögenswertes über Zeit",
    },
    {
      id: "question-open-9",
      topicId: "topic-nachfrage",
      title: "Welche Faktoren beeinflussen die Preiselastizität der Nachfrage?",
      type: "input",
      points: 3,
      options: [],
      answer: "Verfügbarkeit von Alternativen, Notwendigkeit vs. Luxus, Anteil am Einkommen, Gewöhnungseffekte",
    },
    {
      id: "question-open-10",
      topicId: "topic-kapitalmarkt",
      title: "Erklären Sie den Unterschied zwischen Aktien und Anleihen.",
      type: "input",
      points: 3,
      options: [],
      answer: "Aktien sind Eigentumsanteile an einem Unternehmen, Anleihen sind Schuldverschreibungen mit festem Zinssatz",
    },
  ],
  quizzes: [
    {
      id: "quiz-1",
      name: "Quiz 1",
      topicId: "topic-makro",
      questionIds: ["question-mc-1", "question-open-1"],
      shareCode: "QUIZ-001",
    },
  ],
};

function clone(value) {
  return structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultGlobalTopics = [
  { id: "topic-makro", name: "Makroökonomie" },
  { id: "topic-produktionsfaktoren", name: "Produktionsfaktoren" },
  { id: "topic-nachfrage", name: "Nachfrage und Preise" },
  { id: "topic-wirtschaftssysteme", name: "Wirtschaftssysteme" },
  { id: "topic-marktstrukturen", name: "Marktstrukturen" },
  { id: "topic-inflation", name: "Inflation und Preisindex" },
  { id: "topic-management", name: "Unternehmensmanagement" },
  { id: "topic-finanzierung", name: "Finanzierung und Zinsen" },
  { id: "topic-marketing", name: "Marketing und Branding" },
  { id: "topic-arbeitsmarkt", name: "Arbeitsmarkt" },
  { id: "topic-investition", name: "Investition und Portfolio" },
  { id: "topic-außenhandel", name: "Außenhandel" },
  { id: "topic-csr", name: "Unternehmensverantwortung" },
  { id: "topic-wettbewerb", name: "Wettbewerb" },
  { id: "topic-venture", name: "Unternehmensfinanzierung" },
  { id: "topic-bilanz", name: "Bilanz und Vermögen" },
  { id: "topic-geldpolitik", name: "Geldpolitik" },
  { id: "topic-steuersystem", name: "Steuersystem" },
  { id: "topic-kostenrechnung", name: "Kostenrechnung" },
  { id: "topic-betriebswirtschaft", name: "Betriebswirtschaft" },
  { id: "topic-unternehmensstrukturen", name: "Unternehmensstrukturen" },
  { id: "topic-kapitalmarkt", name: "Kapitalmarkt" },
];

function loadGlobalTopics() {
  const raw = localStorage.getItem(TOPICS_KEY);
  if (raw) {
    try {
      const topics = JSON.parse(raw);
      if (Array.isArray(topics) && topics.length > 0) return topics;
    } catch (_) {
      // ignore parse error, fall back to defaults
    }
  }
  return clone(defaultGlobalTopics);
}

function saveGlobalTopics(topics) {
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

function ensureGlobalTopicsInitialized() {
  const topics = loadGlobalTopics();
  if (topics.length === 0) {
    saveGlobalTopics(clone(defaultGlobalTopics));
  }
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      const users = JSON.parse(raw);
      if (Array.isArray(users) && users.length > 0) return users;
    } catch (_) {
      // ignore parse error, fall back to bootstrap
    }
  }
  return bootstrapUsers();
}

function bootstrapUsers() {
  let initialState = clone(defaultState);
  const legacyRaw = localStorage.getItem(LEGACY_STATE_KEY);
  if (legacyRaw) {
    try {
      initialState = JSON.parse(legacyRaw);
    } catch (_) {
      initialState = clone(defaultState);
    }
    localStorage.removeItem(LEGACY_STATE_KEY);
  }
  const seedUser = [
    {
      username: "demo",
      password: "demo",
      state: initialState,
    },
  ];
  saveUsers(seedUser);
  return seedUser;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getActiveUsername() {
  return sessionStorage.getItem(SESSION_KEY);
}

function setActiveUsername(username) {
  if (username) {
    sessionStorage.setItem(SESSION_KEY, username);
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function readState() {
  const username = getActiveUsername();
  if (!username) {
    return clone(defaultState);
  }
  const users = loadUsers();
  let user = users.find((entry) => entry.username === username);
  if (!user) {
    user = { username, password: "", state: clone(defaultState) };
    users.push(user);
    saveUsers(users);
  }
  if (!user.state) {
    user.state = clone(defaultState);
    saveUsers(users);
  }
  return clone(user.state);
}

function writeState(nextState) {
  const username = getActiveUsername();
  if (!username) throw new Error("Nicht eingeloggt");
  const users = loadUsers();
  const user = users.find((entry) => entry.username === username);
  if (!user) throw new Error("Benutzer nicht gefunden");
  user.state = nextState;
  saveUsers(users);
}

export function seedState() {
  writeState(clone(defaultState));
}

export function getState() {
  return readState();
}

export function getTopics() {
  ensureGlobalTopicsInitialized();
  return loadGlobalTopics();
}

export function getQuestions(filter = {}) {
  const state = readState();
  if (filter.quizId) {
    const quiz = state.quizzes.find((z) => z.id === filter.quizId);
    if (!quiz) return [];
    return quiz.questionIds
      .map((questionId) => getQuestionByIdGlobal(questionId))
      .filter(Boolean);
  }
  return state.questions.filter((q) => {
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    return true;
  });
}

export function getQuizzes() {
  return readState().quizzes;
}

export function getAllQuestions() {
  const globalTopics = loadGlobalTopics();
  const topicMap = Object.fromEntries(globalTopics.map((topic) => [topic.id, topic.name]));
  const users = loadUsers();
  return users.flatMap((user) => {
    const questions = user.state?.questions ?? [];
    return questions.map((question) => ({
      ...question,
      options: Array.isArray(question.options) ? [...question.options] : [],
      owner: question.owner ?? user.username,
      topicName: topicMap[question.topicId] ?? "Allgemein",
    }));
  });
}

export function getQuestionByIdGlobal(questionId) {
  const globalTopics = loadGlobalTopics();
  const topicMap = Object.fromEntries(globalTopics.map((topic) => [topic.id, topic.name]));
  const users = loadUsers();
  for (const user of users) {
    const state = user.state ?? clone(defaultState);
    const question = state.questions?.find((q) => q.id === questionId);
    if (question) {
      return {
        ...clone(question),
        owner: question.owner ?? user.username,
        topicName: topicMap[question.topicId] ?? "Allgemein",
      };
    }
  }
  return null;
}

export function getQuizById(id) {
  return readState().quizzes.find((quiz) => quiz.id === id);
}

export function getQuizByCode(code) {
  return readState().quizzes.find((quiz) => quiz.shareCode === code);
}

export function addTopic(name) {
  ensureGlobalTopicsInitialized();
  const topics = loadGlobalTopics();
  const topic = { id: createId("topic"), name };
  topics.push(topic);
  saveGlobalTopics(topics);
  return topic;
}

export function addQuestion(payload) {
  const state = readState();
  const id = createId("question");
  const newQuestion = {
    id,
    sourceId: payload.sourceId ?? id,
    title: payload.title,
    topicId: payload.topicId,
    type: payload.type,
    points: payload.points ?? 1,
    options: payload.options ?? [],
    answer: payload.answer ?? "",
    owner: getActiveUsername(),
  };
  state.questions.push(newQuestion);
  writeState(state);
  return newQuestion;
}

export function getQuestionById(questionId) {
  return readState().questions.find((question) => question.id === questionId) ?? null;
}

export function updateQuestion(questionId, patch) {
  const state = readState();
  const question = state.questions.find((q) => q.id === questionId);
  if (!question) return null;
  Object.assign(question, patch);
  writeState(state);
  return question;
}

export function removeQuestion(questionId) {
  const state = readState();
  const question = state.questions.find((q) => q.id === questionId);
  if (!question) return;
  state.questions = state.questions.filter((q) => q.id !== questionId);
  state.quizzes = state.quizzes.map((quiz) => ({
    ...quiz,
    questionIds: quiz.questionIds.filter((id) => id !== questionId),
  }));
  writeState(state);
}

export function upsertQuiz(payload) {
  const state = readState();
  let quiz = payload.id ? state.quizzes.find((q) => q.id === payload.id) : null;
  if (quiz) {
    quiz.name = payload.name;
    quiz.topicId = payload.topicId;
    quiz.questionIds = payload.questionIds ?? quiz.questionIds;
  } else {
    quiz = {
      id: createId("quiz"),
      name: payload.name,
      topicId: payload.topicId,
      questionIds: payload.questionIds ?? [],
      shareCode: payload.shareCode ?? payload.name.replace(/\s+/g, "-").toUpperCase(),
    };
    state.quizzes.push(quiz);
  }
  writeState(state);
  return quiz;
}

export function removeQuiz(quizId) {
  const state = readState();
  state.quizzes = state.quizzes.filter((quiz) => quiz.id !== quizId);
  writeState(state);
}

export function getCurrentUser() {
  return getActiveUsername();
}

export function logoutUser() {
  setActiveUsername(null);
}

export function ensureLoggedIn() {
  const username = getActiveUsername();
  if (!username) {
    window.location.href = "auth.html";
    throw new Error("Nicht eingeloggt");
  }
  return username;
}

export function loginUser(username, password) {
  const users = loadUsers();
  const user = users.find((entry) => entry.username === username);
  if (!user || user.password !== password) {
    return { success: false, message: "Ungültiger Login" };
  }
  setActiveUsername(username);
  if (!user.state) {
    user.state = clone(defaultState);
    saveUsers(users);
  }
  return { success: true, user: username };
}

export function registerUser(username, password) {
  const users = loadUsers();
  if (users.some((entry) => entry.username === username)) {
    return { success: false, message: "Benutzername bereits vergeben" };
  }
  const newUser = {
    username,
    password,
    state: clone(defaultState),
  };
  users.push(newUser);
  saveUsers(users);
  setActiveUsername(username);
  return { success: true, user: username };
}

