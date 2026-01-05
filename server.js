import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// db initialization
async function initDB() {
  try { await fs.access(DATA_DIR); } catch { await fs.mkdir(DATA_DIR, { recursive: true }); }
  try { await fs.access(DB_PATH); } catch {
    const defaultData = { users: [], topics: [], questions: [], quizzes: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

// safe db read
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], topics: [], questions: [], quizzes: [] };
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

// error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(err);
    res.status(500).json({ success: false, message: "server error" });
  });
};

// --- api routes ---

app.get('/api/data', asyncHandler(async (req, res) => {
  const db = await readDB();
  res.json({ topics: db.topics, questions: db.questions, quizzes: db.quizzes });
}));

app.post('/api/register', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const db = await readDB();
  
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "username taken" });
  }
  
  db.users.push({ username, password });
  await writeDB(db);
  res.json({ success: true, user: username });
}));

app.post('/api/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const db = await readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true, user: username });
  } else {
    res.status(401).json({ success: false, message: "invalid credentials" });
  }
}));

app.post('/api/topics', asyncHandler(async (req, res) => {
  const topic = req.body;
  const db = await readDB();
  if (!db.topics.find(t => t.id === topic.id)) {
    db.topics.push(topic);
    await writeDB(db);
  }
  res.json({ success: true });
}));

app.post('/api/questions', asyncHandler(async (req, res) => {
  const question = req.body;
  const reqUser = req.headers['x-user'];
  const db = await readDB();
  
  const index = db.questions.findIndex(q => q.id === question.id);
  if (index >= 0) {
    if (db.questions[index].owner !== reqUser) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    db.questions[index] = question;
  } else {
    question.owner = reqUser;
    db.questions.push(question);
  }
  
  await writeDB(db);
  res.json({ success: true });
}));

app.delete('/api/questions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqUser = req.headers['x-user'];
  const db = await readDB();
  
  const question = db.questions.find(q => q.id === id);
  if (!question) return res.json({ success: true });

  if (question.owner !== reqUser && question.owner !== 'system') {
    return res.status(403).json({ success: false, message: "forbidden" });
  }

  db.questions = db.questions.filter(q => q.id !== id);
  db.quizzes.forEach(quiz => {
    quiz.questionIds = quiz.questionIds.filter(qid => qid !== id);
  });
  
  await writeDB(db);
  res.json({ success: true });
}));

app.post('/api/quizzes', asyncHandler(async (req, res) => {
  const quiz = req.body;
  const reqUser = req.headers['x-user'];
  const db = await readDB();
  
  const index = db.quizzes.findIndex(q => q.id === quiz.id);
  if (index >= 0) {
    if (db.quizzes[index].owner !== reqUser) {
      return res.status(403).json({ success: false, message: "forbidden" });
    }
    db.quizzes[index] = quiz;
  } else {
    quiz.owner = reqUser;
    db.quizzes.push(quiz);
  }
  
  await writeDB(db);
  res.json({ success: true });
}));

app.delete('/api/quizzes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqUser = req.headers['x-user'];
  const db = await readDB();
  
  const quiz = db.quizzes.find(q => q.id === id);
  if (!quiz) return res.json({ success: true });

  if (quiz.owner !== reqUser) {
    return res.status(403).json({ success: false, message: "forbidden" });
  }

  db.quizzes = db.quizzes.filter(q => q.id !== id);
  await writeDB(db);
  res.json({ success: true });
}));

initDB().then(() => {
  // listen on 0.0.0.0 for network access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`);
  });
});