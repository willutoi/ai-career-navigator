// === КОНФИГУРАЦИЯ ===
const API_URL = "https://cold-water-2c56.baqberqauratuly.workers.dev";
const TOTAL_QUESTIONS = 10;

// === ЗАПУСК ===
document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('#quiz-form select');
    selects.forEach(select => select.addEventListener('change', updateProgress));

    document.getElementById('quiz-form').addEventListener('submit', e => {
        e.preventDefault();
        startLoadingScreen();
    });
});

// === ПРОГРЕСС-БАР ===
function updateProgress() {
    const answered = Array.from(document.querySelectorAll('#quiz-form select'))
        .filter(s => s.value !== "").length;
    const percent = (answered / TOTAL_QUESTIONS) * 100;
    document.getElementById('progress-bar').style.width = percent + "%";
}

// === ЭКРАНЫ ===
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

function showResultScreen(html) {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('results-container').innerHTML = html;
}

function toggleRoadmap(btn) {
    const content = btn.nextElementSibling;
    content.classList.toggle('hidden');
    btn.textContent = content.classList.contains('hidden') ? 'Посмотреть Roadmap (краткий)' : 'Скрыть Roadmap';
}

// === ГЛАВНАЯ ЛОГИКА С OPENAI ===
async function calculateResultsWithAI() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form);

    const userPrompt = `Ты — лучший карьерный консультант для подростков в России.

На основе этих ответов дай ТОП-3 самых подходящих профессий.
Ответ должен быть строго в таком формате:

### 1. Название профессии | 88% | (Категория)
Краткое объяснение, почему подходит.
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
                    { role: "system", content: "Отвечай только по шаблону выше, на русском языке, без лишних слов." },
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Worker вернул ${response.status}: ${text}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        const html = parseOpenAIResponse(text);
        showResultScreen(html);

    } catch (err) {
        console.error(err);
        showResultScreen(`
            <h3>Ошибка</h3>
            <p>${err.message}</p>
            <button onclick="location.reload()" style="padding:12px 24px;margin-top:20px;font-size:16px;">
                Попробовать заново
            </button>
        `);
    }
}

// === ПАРСИНГ ОТВЕТА В КРАСИВЫЕ КАРТОЧКИ ===
function parseOpenAIResponse(text) {
    const blocks = text.trim().split('---').map(b => b.trim()).filter(b => b);
    let html = '';

    blocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 3) return;

        const header = lines[0].replace('###', '').trim();
        const [titlePart, score, category] = header.split('|').map(s => s.trim());
        const title = titlePart.trim();
        const description = lines[1];

        const steps = lines.slice(2)
            .filter(l => l.startsWith('*'))
            .map(l => {
                const step = l.replace(/^\*\s*/, '').trim();
                return `<div class="roadmap-step"><span class="step-icon">→</span>${step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
            }).join('');

        html += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${title}</h3>
                    <span class="score">${score}</span>
                </div>
                <div class="tag">${category}</div>
                <p>${description}</p>
                <button class="roadmap-btn" onclick="toggleRoadmap(this)">
                    Посмотреть Roadmap (краткий)
                </button>
                <div class="roadmap-content hidden">
                    <div class="short-roadmap">
                        <h4>Краткий план действий:</h4>
                        ${steps}
                    </div>
                </div>
            </div>`;
    });

    return html || "<p>Не удалось сгенерировать ответ.</p>";
}
