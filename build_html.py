# -*- coding: utf-8 -*-
"""Generate index.html from questions.json."""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, 'questions.json'), encoding='utf-8') as f:
    QUESTIONS = json.load(f)

questions_js = json.dumps(QUESTIONS, ensure_ascii=False, indent=2)

HTML_TEMPLATE = r'''<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Тренажёр по производственной безопасности</title>
  <style>
    :root {
      --bg: #f0f4f8;
      --surface: #ffffff;
      --text: #1a2332;
      --text-muted: #5c6b7a;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #059669;
      --success-bg: #d1fae5;
      --error: #dc2626;
      --error-bg: #fee2e2;
      --border: #e2e8f0;
      --shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
      --radius: 12px;
      --transition: 0.2s ease;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.55;
      min-height: 100vh;
    }

    .app {
      max-width: 720px;
      margin: 0 auto;
      padding: 16px 16px 32px;
    }

    .screen { display: none; animation: fadeIn 0.25s ease; }
    .screen.active { display: block; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h1 {
      font-size: clamp(1.35rem, 4vw, 1.75rem);
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    h2 {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text);
    }

    .subtitle, .instruction {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 24px;
    }

    .card {
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid var(--border);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background var(--transition), transform var(--transition), opacity var(--transition);
      font-family: inherit;
      width: 100%;
      margin-bottom: 10px;
    }

    .btn:last-child { margin-bottom: 0; }

    .btn:active:not(:disabled) { transform: scale(0.98); }

    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    .btn-primary:hover:not(:disabled) { background: var(--primary-hover); }

    .btn-secondary {
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover:not(:disabled) { background: #f8fafc; }

    .btn-success {
      background: var(--success);
      color: #fff;
    }
    .btn-success:hover:not(:disabled) { background: #047857; }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn-row .btn { margin-bottom: 0; }

    .progress-bar {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      padding: 10px 14px;
      background: #e8eef5;
      border-radius: 8px;
    }

    .progress-bar strong { color: var(--text); }

    .question-text {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 18px;
      line-height: 1.45;
    }

    .answers-list { list-style: none; }

    .answer-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 10px;
      background: #f8fafc;
      border: 2px solid var(--border);
      border-radius: 10px;
      cursor: pointer;
      transition: border-color var(--transition), background var(--transition);
      user-select: none;
    }

    .answer-item:hover:not(.locked) {
      border-color: #94a3b8;
      background: #f1f5f9;
    }

    .answer-item.selected {
      border-color: var(--primary);
      background: #eff6ff;
    }

    .answer-item.correct {
      border-color: var(--success);
      background: var(--success-bg);
    }

    .answer-item.wrong {
      border-color: var(--error);
      background: var(--error-bg);
    }

    .answer-item.missed {
      border-color: var(--success);
      background: var(--success-bg);
      opacity: 0.85;
    }

    .answer-item.locked { cursor: default; }

    .answer-item.correct-answer {
      border-color: var(--success);
      background: var(--success-bg);
      font-weight: 700;
    }

    .answer-checkbox {
      width: 22px;
      height: 22px;
      border: 2px solid #94a3b8;
      border-radius: 6px;
      flex-shrink: 0;
      margin-top: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition), border-color var(--transition);
    }

    .answer-item.selected .answer-checkbox {
      background: var(--primary);
      border-color: var(--primary);
    }

    .answer-item.selected .answer-checkbox::after {
      content: "✓";
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .answer-item.correct .answer-checkbox,
    .answer-item.missed .answer-checkbox,
    .answer-item.correct-answer .answer-checkbox {
      background: var(--success);
      border-color: var(--success);
    }

    .answer-item.wrong .answer-checkbox {
      background: var(--error);
      border-color: var(--error);
    }

    .answer-label { font-size: 0.8rem; color: var(--text-muted); min-width: 24px; }
    .answer-text { flex: 1; font-size: 0.95rem; }

    .feedback {
      margin: 16px 0;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .feedback.success { background: var(--success-bg); color: #065f46; }
    .feedback.error { background: var(--error-bg); color: #991b1b; }

    .ticket-grid {
      display: grid;
      gap: 12px;
    }

    .ticket-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .ticket-card .btn { width: auto; min-width: 140px; margin: 0; }

    .study-controls {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .study-controls input,
    .study-controls select {
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      background: var(--surface);
    }

    .study-list {
      list-style: none;
      max-height: 60vh;
      overflow-y: auto;
    }

    .study-item {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background var(--transition);
    }
    .study-item:hover { background: #f1f5f9; }
    .study-item-num { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; }
    .study-item-text {
      font-size: 0.9rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .view-question {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    .view-question:last-child { border-bottom: none; }

    .view-question-num {
      font-size: 0.85rem;
      color: var(--primary);
      font-weight: 600;
      margin-bottom: 8px;
    }

    .view-answers { list-style: none; margin-top: 10px; }
    .view-answers li {
      padding: 8px 12px;
      margin-bottom: 6px;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .view-answers li.correct-show {
      background: var(--success-bg);
      font-weight: 700;
      color: #065f46;
    }

    .results-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 20px 0;
    }

    .stat-box {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--primary); }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--primary);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 16px;
      border: none;
      background: none;
      font-family: inherit;
      padding: 0;
    }
    .back-link:hover { text-decoration: underline; }

    .hidden-answers .view-answers li.correct-show {
      background: transparent;
      font-weight: normal;
      color: inherit;
    }

    .meta-tag {
      display: inline-block;
      padding: 4px 10px;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 12px;
    }

    @media (min-width: 600px) {
      .home-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .home-buttons .btn { margin-bottom: 0; }
      .home-buttons .btn-wide { grid-column: 1 / -1; }
    }
  </style>
</head>
<body>
  <div class="app">
    <!-- Главный экран -->
    <section id="screen-home" class="screen active">
      <div class="card">
        <h1>Тренажёр по производственной безопасности</h1>
        <p class="instruction">В каждом вопросе может быть один или несколько правильных ответов. Выберите все варианты, которые считаете правильными.</p>
        <div id="resume-banner" class="card" style="display:none;background:#eff6ff;border-color:#93c5fd;margin-bottom:16px">
          <p style="margin-bottom:10px;font-size:0.9rem">Есть незавершённая тренировка</p>
          <button type="button" class="btn btn-primary" data-action="resume-session">Продолжить</button>
        </div>
        <div class="home-buttons">
          <button type="button" class="btn btn-primary btn-wide" data-action="start-training">Начать тренировку</button>
          <button type="button" class="btn btn-secondary" data-action="random-ticket">Случайный билет</button>
          <button type="button" class="btn btn-secondary" data-action="all-tickets">Все билеты</button>
          <button type="button" class="btn btn-secondary" data-action="study-mode">Режим изучения</button>
        </div>
      </div>
    </section>

    <!-- Тренировка / билет (режим теста) -->
    <section id="screen-quiz" class="screen">
      <button type="button" class="back-link" data-action="go-home">← На главную</button>
      <div class="progress-bar" id="quiz-progress"></div>
      <div class="card">
        <div class="question-text" id="quiz-question"></div>
        <ul class="answers-list" id="quiz-answers"></ul>
        <div id="quiz-feedback" class="feedback" style="display:none"></div>
        <button type="button" class="btn btn-secondary" id="btn-back-quiz" style="display:none;margin-bottom:10px">Назад</button>
        <button type="button" class="btn btn-primary" id="btn-check">Проверить</button>
        <div id="quiz-nav" style="display:none">
          <div class="btn-row" style="margin-top:10px">
            <button type="button" class="btn btn-secondary" id="btn-prev">Назад</button>
            <button type="button" class="btn btn-primary" id="btn-next">Следующий вопрос</button>
          </div>
          <button type="button" class="btn btn-secondary" id="btn-finish" style="margin-top:10px">Завершить</button>
        </div>
      </div>
    </section>

    <!-- Список билетов -->
    <section id="screen-tickets" class="screen">
      <button type="button" class="back-link" data-action="go-home">← На главную</button>
      <h2>Все билеты</h2>
      <p class="subtitle">В каждом билете 20 вопросов</p>
      <div class="ticket-grid" id="tickets-list"></div>
    </section>

    <!-- Меню билета -->
    <section id="screen-ticket-menu" class="screen">
      <button type="button" class="back-link" data-action="all-tickets">← К списку билетов</button>
      <h2 id="ticket-menu-title">Билет</h2>
      <button type="button" class="btn btn-primary" data-action="ticket-test">Пройти тест</button>
      <button type="button" class="btn btn-secondary" data-action="ticket-view">Просмотр билета</button>
    </section>

    <!-- Просмотр билета -->
    <section id="screen-ticket-view" class="screen">
      <button type="button" class="back-link" data-action="ticket-menu-back">← Назад</button>
      <h2 id="view-ticket-title">Просмотр билета</h2>
      <button type="button" class="btn btn-secondary" id="btn-toggle-answers">Скрыть правильные ответы</button>
      <div class="card" id="ticket-view-content" style="margin-top:16px"></div>
    </section>

    <!-- Режим изучения -->
    <section id="screen-study" class="screen">
      <button type="button" class="back-link" data-action="go-home">← На главную</button>
      <h2>Режим изучения</h2>
      <div class="study-controls">
        <input type="search" id="study-search" placeholder="Поиск по словам..." autocomplete="off">
        <select id="study-ticket-filter">
          <option value="">Все билеты</option>
        </select>
      </div>
      <div class="card" style="padding:0; overflow:hidden">
        <ul class="study-list" id="study-list"></ul>
      </div>
    </section>

    <!-- Детали вопроса (изучение) -->
    <section id="screen-study-detail" class="screen">
      <button type="button" class="back-link" data-action="study-back">← К списку</button>
      <div class="card" id="study-detail-content"></div>
    </section>

    <!-- Итоги -->
    <section id="screen-results" class="screen">
      <button type="button" class="back-link" data-action="go-home">← На главную</button>
      <h2>Результаты</h2>
      <div class="card">
        <div class="results-stats" id="results-stats"></div>
        <button type="button" class="btn btn-success" data-action="retry">Пройти заново</button>
        <button type="button" class="btn btn-secondary" data-action="go-home">На главную</button>
      </div>
    </section>
  </div>

  <script>
    // === Данные вопросов (из Word-файлов) ===
    const QUESTIONS = __QUESTIONS_JSON__;

    const STORAGE_KEY = 'safety-trainer-progress';

    // === Состояние приложения ===
    const state = {
      screen: 'home',
      mode: null,           // 'training' | 'ticket' | 'random'
      questionIds: [],      // порядок вопросов в текущей сессии
      currentIndex: 0,
      correctCount: 0,
      errorCount: 0,
      checked: false,
      selected: new Set(),
      currentTicket: null,
      viewAnswersVisible: true,
      studyFilterTicket: '',
      studySearch: '',
      answerHistory: {},
      lastSession: null
    };

    // === Утилиты ===
    function $(id) { return document.getElementById(id); }

    function showScreen(name) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const el = $('screen-' + name);
      if (el) el.classList.add('active');
      state.screen = name;
      saveProgress();
    }

    function getQuestionById(id) {
      return QUESTIONS.find(q => q.id === id);
    }

    function getQuestionsByTicket(ticket) {
      return QUESTIONS.filter(q => q.ticket === ticket);
    }

    function getTicketCount() {
      return Math.max(...QUESTIONS.map(q => q.ticket));
    }

    function getCorrectIndices(question) {
      return question.answers
        .map((a, i) => a.correct ? i : -1)
        .filter(i => i >= 0);
    }

    function getCorrectCount(question) {
      return question.answers.filter(a => a.correct).length;
    }

  function setsEqual(a, b) {
      if (a.size !== b.size) return false;
      for (const x of a) if (!b.has(x)) return false;
      return true;
    }

    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const LETTERS = ['а', 'б', 'в', 'г'];

    // === localStorage ===
    function saveProgress() {
      try {
        const data = {
          screen: state.screen,
          mode: state.mode,
          questionIds: state.questionIds,
          currentIndex: state.currentIndex,
          correctCount: state.correctCount,
          errorCount: state.errorCount,
          currentTicket: state.currentTicket,
          viewAnswersVisible: state.viewAnswersVisible,
          answerHistory: state.answerHistory
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) { /* ignore */ }
    }

    function loadProgress() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data.questionIds || !data.questionIds.length) return false;
        Object.assign(state, {
          mode: data.mode,
          questionIds: data.questionIds,
          currentIndex: data.currentIndex || 0,
          correctCount: data.correctCount || 0,
          errorCount: data.errorCount || 0,
          currentTicket: data.currentTicket,
          viewAnswersVisible: data.viewAnswersVisible !== false,
          answerHistory: data.answerHistory || {}
        });
        return true;
      } catch (e) {
        return false;
      }
    }

    function clearSession() {
      state.questionIds = [];
      state.currentIndex = 0;
      state.correctCount = 0;
      state.errorCount = 0;
      state.checked = false;
      state.selected = new Set();
      state.mode = null;
      state.currentTicket = null;
      state.answerHistory = {};
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    function resetQuizCounters() {
      state.correctCount = 0;
      state.errorCount = 0;
      state.answerHistory = {};
      state.currentIndex = 0;
    }

    // === Рендер тренировки ===
    function startTraining(ids, keepMode) {
      if (!keepMode) state.mode = state.mode || 'training';
      state.questionIds = ids || QUESTIONS.map(q => q.id);
      resetQuizCounters();
      state.checked = false;
      state.selected = new Set();
      showScreen('quiz');
      renderQuizQuestion();
    }

    function startTicket(ticket, randomize) {
      if (!ticket) return;
      state.mode = 'ticket';
      state.currentTicket = ticket;
      let ids = getQuestionsByTicket(ticket).map(q => q.id);
      if (!ids.length) return;
      if (randomize) ids = shuffle(ids);
      startTraining(ids, true);
    }

    function renderQuizQuestion() {
      const id = state.questionIds[state.currentIndex];
      const q = getQuestionById(id);
      if (!q) return finishQuiz();

      const hist = state.answerHistory[state.currentIndex];
      state.checked = !!(hist && hist.checked);
      state.selected = new Set(hist && hist.selected ? hist.selected : []);

      const total = state.questionIds.length;
      const num = state.currentIndex + 1;
      $('quiz-progress').innerHTML =
        `Вопрос <strong>${num}</strong> из <strong>${total}</strong> · ` +
        `Верно: <strong>${state.correctCount}</strong> · ` +
        `Ошибок: <strong>${state.errorCount}</strong>`;

      $('quiz-question').textContent = q.question;
      const list = $('quiz-answers');
      list.innerHTML = '';

      q.answers.forEach((ans, i) => {
        const li = document.createElement('li');
        li.className = 'answer-item';
        li.dataset.index = i;
        li.innerHTML =
          `<span class="answer-label">${LETTERS[i]})</span>` +
          `<span class="answer-checkbox"></span>` +
          `<span class="answer-text">${escapeHtml(ans.text)}</span>`;
        if (state.selected.has(i)) li.classList.add('selected');
        if (state.checked) {
          li.classList.add('locked');
          const selected = state.selected.has(i);
          if (ans.correct && selected) li.classList.add('correct');
          else if (!ans.correct && selected) li.classList.add('wrong');
          else if (ans.correct && !selected) li.classList.add('missed');
        } else {
          li.addEventListener('click', () => toggleAnswer(i, li));
        }
        list.appendChild(li);
      });

      const backBtn = $('btn-back-quiz');
      backBtn.style.display = state.currentIndex > 0 ? 'block' : 'none';

      if (state.checked) {
        showCheckedFeedback(q, hist && hist.wasCorrect);
      } else {
        $('quiz-feedback').style.display = 'none';
        $('btn-check').style.display = 'block';
        $('btn-check').disabled = state.selected.size === 0;
        $('quiz-nav').style.display = 'none';
      }
    }

    function showCheckedFeedback(q, wasCorrect) {
      const correctTotal = getCorrectCount(q);
      const fb = $('quiz-feedback');
      fb.style.display = 'block';
      fb.className = 'feedback ' + (wasCorrect ? 'success' : 'error');
      fb.textContent = wasCorrect
        ? `Верно! Правильных ответов: ${correctTotal}`
        : `Неверно. Правильных ответов: ${correctTotal}`;
      $('btn-check').style.display = 'none';
      $('quiz-nav').style.display = 'block';
      const isLast = state.currentIndex >= state.questionIds.length - 1;
      $('btn-next').textContent = isLast ? 'К результатам' : 'Следующий вопрос';
      $('btn-prev').disabled = state.currentIndex === 0;
    }

    function escapeHtml(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    function toggleAnswer(index, el) {
      if (state.checked) return;
      if (state.selected.has(index)) {
        state.selected.delete(index);
        el.classList.remove('selected');
      } else {
        state.selected.add(index);
        el.classList.add('selected');
      }
      $('btn-check').disabled = state.selected.size === 0;
    }

    function checkAnswer() {
      if (state.checked || state.selected.size === 0) return;

      const id = state.questionIds[state.currentIndex];
      const q = getQuestionById(id);
      const correctSet = new Set(getCorrectIndices(q));
      const isFullyCorrect = setsEqual(state.selected, correctSet);

      const prev = state.answerHistory[state.currentIndex];
      if (!prev || !prev.checked) {
        if (isFullyCorrect) state.correctCount++;
        else state.errorCount++;
      }

      state.checked = true;
      state.answerHistory[state.currentIndex] = {
        selected: [...state.selected],
        checked: true,
        wasCorrect: isFullyCorrect
      };

      renderQuizQuestion();
      saveProgress();
    }

    function nextQuestion() {
      if (state.currentIndex < state.questionIds.length - 1) {
        state.currentIndex++;
        renderQuizQuestion();
        saveProgress();
      } else {
        finishQuiz();
      }
    }

    function goPrevQuestion() {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuizQuestion();
        saveProgress();
      }
    }

    function finishQuiz() {
      state.lastSession = {
        mode: state.mode,
        questionIds: [...state.questionIds],
        currentTicket: state.currentTicket
      };
      showScreen('results');
      const total = state.questionIds.length;
      const correct = state.correctCount;
      const errors = state.errorCount;
      const pct = total ? Math.round((correct / total) * 100) : 0;

      $('results-stats').innerHTML = `
        <div class="stat-box"><div class="stat-value">${total}</div><div class="stat-label">Всего вопросов</div></div>
        <div class="stat-box"><div class="stat-value" style="color:var(--success)">${correct}</div><div class="stat-label">Правильных</div></div>
        <div class="stat-box"><div class="stat-value" style="color:var(--error)">${errors}</div><div class="stat-label">Ошибок</div></div>
        <div class="stat-box"><div class="stat-value">${pct}%</div><div class="stat-label">Результат</div></div>
      `;
      clearSession();
    }

    // === Билеты ===
    function renderTicketsList() {
      const container = $('tickets-list');
      container.innerHTML = '';
      const count = getTicketCount();
      for (let t = 1; t <= count; t++) {
        const from = (t - 1) * 20 + 1;
        const to = t * 20;
        const card = document.createElement('div');
        card.className = 'card ticket-card';
        card.innerHTML = `
          <div>
            <strong>Билет ${t}</strong><br>
            <span style="font-size:0.85rem;color:var(--text-muted)">Вопросы ${from}–${to}</span>
          </div>
          <button type="button" class="btn btn-primary" data-ticket="${t}">Открыть билет</button>
        `;
        card.querySelector('button').addEventListener('click', () => openTicketMenu(t));
        container.appendChild(card);
      }
      showScreen('tickets');
    }

    function openTicketMenu(ticket) {
      state.currentTicket = ticket;
      const from = (ticket - 1) * 20 + 1;
      const to = ticket * 20;
      $('ticket-menu-title').textContent = `Билет ${ticket} (вопросы ${from}–${to})`;
      showScreen('ticket-menu');
    }

    function renderTicketView() {
      const ticket = state.currentTicket;
      const questions = getQuestionsByTicket(ticket);
      $('view-ticket-title').textContent = `Просмотр билета ${ticket}`;
      const container = $('ticket-view-content');
      container.classList.toggle('hidden-answers', !state.viewAnswersVisible);

      container.innerHTML = questions.map(q => {
        const correctN = getCorrectCount(q);
        const answersHtml = q.answers.map((a, i) => {
          const cls = state.viewAnswersVisible && a.correct ? 'correct-show' : '';
          return `<li class="${cls}">${LETTERS[i]}) ${escapeHtml(a.text)}</li>`;
        }).join('');
        return `
          <div class="view-question">
            <div class="view-question-num">Вопрос ${q.id} · Правильных ответов: ${correctN}</div>
            <div class="question-text">${escapeHtml(q.question)}</div>
            <ul class="view-answers">${answersHtml}</ul>
          </div>
        `;
      }).join('');

      $('btn-toggle-answers').textContent = state.viewAnswersVisible
        ? 'Скрыть правильные ответы'
        : 'Показать правильные ответы';

      showScreen('ticket-view');
    }

    // === Режим изучения ===
    function initStudyFilter() {
      const sel = $('study-ticket-filter');
      const count = getTicketCount();
      sel.innerHTML = '<option value="">Все билеты</option>';
      for (let t = 1; t <= count; t++) {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = `Билет ${t}`;
        sel.appendChild(opt);
      }
    }

    function renderStudyList() {
      const search = ($('study-search').value || '').toLowerCase().trim();
      const ticketFilter = $('study-ticket-filter').value;

      let list = QUESTIONS;
      if (ticketFilter) list = list.filter(q => q.ticket === Number(ticketFilter));
      if (search) {
        list = list.filter(q =>
          q.question.toLowerCase().includes(search) ||
          q.answers.some(a => a.text.toLowerCase().includes(search))
        );
      }

      const ul = $('study-list');
      if (!list.length) {
        ul.innerHTML = '<li class="study-item">Ничего не найдено</li>';
        return;
      }

      ul.innerHTML = list.map(q => `
        <li class="study-item" data-id="${q.id}">
          <div class="study-item-num">Вопрос ${q.id} · Билет ${q.ticket}</div>
          <div class="study-item-text">${escapeHtml(q.question)}</div>
        </li>
      `).join('');

      ul.querySelectorAll('.study-item').forEach(li => {
        li.addEventListener('click', () => openStudyDetail(Number(li.dataset.id)));
      });
    }

    function openStudyDetail(id) {
      const q = getQuestionById(id);
      if (!q) return;
      const correctN = getCorrectCount(q);
      const answersHtml = q.answers.map((a, i) => {
        const cls = a.correct ? 'correct-show' : '';
        return `<li class="${cls}">${LETTERS[i]}) ${escapeHtml(a.text)}</li>`;
      }).join('');

      $('study-detail-content').innerHTML = `
        <span class="meta-tag">Билет ${q.ticket} · Вопрос ${q.id}</span>
        <p class="meta-tag" style="background:#d1fae5;color:#065f46">Правильных ответов: ${correctN}</p>
        <div class="question-text">${escapeHtml(q.question)}</div>
        <ul class="view-answers">${answersHtml}</ul>
      `;
      showScreen('study-detail');
    }

    // === Обработчики ===
    function bindEvents() {
      document.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', () => {
          const action = el.dataset.action;
          switch (action) {
            case 'start-training':
              clearSession();
              state.mode = 'training';
              startTraining(QUESTIONS.map(q => q.id));
              break;
            case 'random-ticket':
              clearSession();
              state.mode = 'random';
              const t = Math.floor(Math.random() * getTicketCount()) + 1;
              startTicket(t, true);
              break;
            case 'all-tickets':
              renderTicketsList();
              break;
            case 'study-mode':
              initStudyFilter();
              renderStudyList();
              showScreen('study');
              break;
            case 'go-home':
              showScreen('home');
              updateResumeBanner();
              break;
            case 'ticket-test': {
              const ticket = state.currentTicket;
              clearSession();
              startTicket(ticket, false);
              break;
            }
            case 'ticket-view':
              state.viewAnswersVisible = true;
              renderTicketView();
              break;
            case 'all-tickets':
              renderTicketsList();
              break;
            case 'study-back':
              showScreen('study');
              renderStudyList();
              break;
            case 'ticket-menu-back':
              openTicketMenu(state.currentTicket);
              break;
            case 'resume-session':
              if (loadProgress()) {
                showScreen('quiz');
                renderQuizQuestion();
              }
              break;
            case 'retry': {
              const ls = state.lastSession;
              if (!ls) break;
              if (ls.currentTicket) {
                const ticket = ls.currentTicket;
                clearSession();
                state.lastSession = ls;
                startTicket(ticket, false);
              } else if (ls.questionIds && ls.questionIds.length > 0) {
                const ids = [...ls.questionIds];
                const mode = ls.mode || 'training';
                clearSession();
                state.lastSession = ls;
                state.mode = mode;
                startTraining(ids, true);
              } else {
                clearSession();
                state.mode = 'training';
                startTraining(QUESTIONS.map(q => q.id));
              }
              break;
            }
          }
        });
      });

      document.querySelectorAll('[data-ticket]').forEach(el => {
        el.addEventListener('click', () => openTicketMenu(Number(el.dataset.ticket)));
      });

      $('btn-check').addEventListener('click', checkAnswer);
      $('btn-next').addEventListener('click', nextQuestion);
      $('btn-prev').addEventListener('click', goPrevQuestion);
      $('btn-back-quiz').addEventListener('click', goPrevQuestion);
      $('btn-finish').addEventListener('click', finishQuiz);

      $('btn-toggle-answers').addEventListener('click', () => {
        state.viewAnswersVisible = !state.viewAnswersVisible;
        renderTicketView();
      });

      $('study-search').addEventListener('input', renderStudyList);
      $('study-ticket-filter').addEventListener('change', renderStudyList);
    }

    // === Инициализация ===
    function hasSavedSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        return data.questionIds && data.questionIds.length &&
          (data.currentIndex || 0) < data.questionIds.length;
      } catch (e) {
        return false;
      }
    }

    function updateResumeBanner() {
      const banner = $('resume-banner');
      if (banner) banner.style.display = hasSavedSession() ? 'block' : 'none';
    }

    function init() {
      bindEvents();
      initStudyFilter();
      updateResumeBanner();
    }

    init();
  </script>
</body>
</html>
'''

html = HTML_TEMPLATE.replace('__QUESTIONS_JSON__', questions_js)
html = html.replace('motion.div', 'div')

out_path = os.path.join(BASE, 'index.html')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Written {out_path}, size {len(html)} bytes')
