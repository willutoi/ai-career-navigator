// === КОНФИГУРАЦИЯ ===
const API_URL = "https://cold-water-2c56.baqberqauratuly.workers.dev";
const TOTAL_QUESTIONS = 10;

// === ЗАПУСК ===
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#quiz-form select').forEach(select => select.addEventListener('change', updateProgress));

    document.getElementById('quiz-form').addEventListener('submit', e => {
        e.preventDefault();
        startLoadingScreen();
    });
});

// === ПРОГРЕСС-БАР ===
function updateProgress() {
    const answered = Array.from(document.querySelectorAll('#quiz-form select')).filter(s => s.value !== "").length;
    const percent = (answered / TOTAL_QUESTIONS) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
}

// === ЭКРАН ЗАГРУЗКИ ===
function startLoadingScreen() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    const phrases = ["Анализируем твои ответы...", "Подбираем профессии...", "Формируем рекомендации..."];
    let i = 0;
    const interval = setInterval(() => {
        if (i < phrases.length) document.getElementById('loading-text').textContent = phrases[i++];
    }, 800);

    setTimeout(() => {
        clearInterval(interval);
        calculateResultsWithAI();
    }, 3000);
}

// === ПОКАЗ РЕЗУЛЬТАТОВ ===
function showResultScreen(html) {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('results-container').innerHTML = html;
}

// === РАСКРЫТИЕ ROADMAP ===
function toggleRoadmap(btn) {
    const content = btn.nextElementSibling;
    content.classList.toggle('hidden');
    btn.textContent = content.classList.contains('hidden') ? 'Посмотреть Roadmap (краткий)' : 'Скрыть Roadmap';
}

// === ЗАПРОС К GROK ===
async function calculateResultsWithAI() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form);

    const prompt = `Ты — лучший карьерный консультант для подростков в России.

На основе этих ответов дай ТОП-3 самых подходящих профессий.

ОБЯЗАТЕЛЬНЫЙ формат ответа (ни слова лишнего):
### 1. Название профессии | 88% | (Категория)
Краткое объяснение почему подходит (2-3 предложения).
* Шаг 1: ...
* Шаг 2: ...
* Шаг 3: ...
---
### 2. ...
---
### 3. ...

Ответы пользователя:
${JSON.stringify(answers, null, 2)}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Отвечай строго по шаблону выше, только на русском, без приветствий и заключений." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) throw new Error(`Ошибка ${response.status}`);

        const data = await response.json();
        const text = data.choices[0].message.content;

        const html = parseResponse(text);
        showResultScreen(html);

    } catch (err) {
        console.error(err);
        showResultScreen(`<h3>Ошибка</h3><p>${err.message}</p>`);
    }
}

// === ПАРСИНГ ОТВЕТА ===
function parseResponse(text) {
    const blocks = text.trim().split('---').map(b => b.trim()).filter(b => b);
    let html = '';

    blocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 3) return;

        const header = lines[0].replace(/^###\s*\d+\.\s*/, '').trim();
        const [title, score, category] = header.split('|').map(s => s.trim());
        const desc = lines[1];

        const steps = lines.slice(2)
            .filter(l => l.startsWith('*'))
            .map(l => `<div class="roadmap-step"><span class="step-icon">→</span>${l.replace(/^\*\s*/, '').trim()}</div>`)
            .join('');

        html += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${title}</h3>
                    <span class="score">${score}</span>
                </div>
                <div class="tag">${category}</div>
                <p>${desc}</p>
                <button class="roadmap-btn" onclick="toggleRoadmap(this)">Посмотреть Roadmap (краткий)</button>
                <div class="roadmap-content hidden">
                    <div class="short-roadmap">
                        <h4>Краткий план действий:</h4>
                        ${steps}
                    </div>
                </div>
            </div>`;
    });

    return html || "<p>ИИ не смог дать ответ :(</p>";
}
