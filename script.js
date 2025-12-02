// =======================================================================
// === КОНФИГУРАЦИЯ API GEMINI (ОБЯЗАТЕЛЬНО ИЗМЕНИТЬ) ===
// =======================================================================
// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
const API_URL = "https://cold-water-2c56.baqberqauratuly.workers.dev";
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// Если создашь новый Worker — замени URL здесь

const TOTAL_QUESTIONS = 10;

document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();
        startLoadingScreen();
    });
});

function startQuiz() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    updateProgress();
}

function updateProgress() {
    const form = document.getElementById('quiz-form');
    const answeredCount = Array.from(form.querySelectorAll('select')).filter(s => s.value !== "").length;
    const percentage = (answeredCount / TOTAL_QUESTIONS) * 100;
    document.getElementById('progress-bar').style.width = percentage + "%";
}

function startLoadingScreen() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    const phrases = ["Анализ психотипа...", "Формирование запроса к AI...", "Генерация Roadmap...", "Финальный расчет..."];
    let i = 0;
    const interval = setInterval(() => {
        if (i < phrases.length) document.getElementById('loading-text').innerText = phrases[i++];
    }, 700);

    setTimeout(() => {
        clearInterval(interval);
        calculateResultsWithAI();
    }, 3000);
}

function showResultScreen(htmlContent) {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('results-container').innerHTML = htmlContent;
}

function toggleRoadmap(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('hidden');
    button.textContent = content.classList.contains('hidden') ? 'Посмотреть Roadmap (краткий)' : 'Скрыть Roadmap';
}

// === ГЛАВНАЯ ФУНКЦИЯ ОТПРАВКИ НА GEMINI ===
async function calculateResultsWithAI() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form.entries());
    const prompt = createAIPrompt(answers);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
                // ← БЕЗ config и generationConfig — Worker сам добавит нужное
            })
        });

        if (!response.ok) throw new Error(`Worker error: ${response.status}`);

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) throw new Error("AI не вернул текст");

        const htmlContent = parseAITextToHTML(aiText);
        showResultScreen(htmlContent);

    } catch (error) {
        console.error("Ошибка Gemini:", error);
        showResultScreen(`
            <h3>Ошибка подключения к AI</h3>
            <p>${error.message}</p>
            <p>Проверь Worker и ключ.</p>
        `);
    }
}

// === ДЕТАЛЬНЫЙ ПЛАН (12 месяцев) ===
async function generateDetailedPlan(button, jobName) {
    const roadmapContainer = button.closest('.roadmap-content');
    if (roadmapContainer.querySelector('.detailed-plan')) {
        roadmapContainer.querySelector('.detailed-plan').classList.toggle('hidden');
        return;
    }

    button.disabled = true;
    button.textContent = "Генерация...";

    const detailedPrompt = `Сделай максимально практичный 12-месячный план развития для профессии "${jobName}" для подростка. Только список:\n## ${jobName}\n- Месяц 1: ...\n- Месяц 2: ... и т.д. до 12.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: detailedPrompt }] }]
            })
        });

        if (!response.ok) throw new Error(response.status);

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Ошибка генерации";

        let html = text
            .replace(/## (.*)/, '<h4>$1</h4>')
            .replace(/- (.*)/g, '<div class="roadmap-step detailed"><span class="step-icon">★</span>$1</div>');

        const div = document.createElement('div');
        div.className = 'detailed-plan';
        div.innerHTML = html;
        roadmapContainer.appendChild(div);

        button.textContent = "Скрыть детальный план";
    } catch (e) {
        button.textContent = "Ошибка";
    } finally {
        button.disabled = false;
    }
}

// === ПРОМПТ И ПАРСИНГ ОТВЕТА ===
function createAIPrompt(answers) {
    const formatted = JSON.stringify(answers, null, 2);
    return `
Ты — карьерный консультант для подростков. На основе ответов дай ТОП-3 профессии.

Формат ответа (строго!):
### 1. [Название] | [Процент 70-99] | [Категория: IT/DESIGN/SCIENCE и т.д.]
[Краткое объяснение]
* Шаг 1: ...
* Шаг 2: ...
* Шаг 3: ...
---
### 2. ...
---
### 3. ...

Ответы пользователя:
${formatted}
`;
}

function parseAITextToHTML(aiText) {
    const blocks = aiText.trim().split('---').filter(b => b.trim());
    let html = '';

    blocks.forEach(block => {
        const lines = block.trim().split('\n').filter(l => l.trim());
        if (lines.length < 2) return;

        const header = lines[0].replace('###', '').trim();
        const [title, score, tag] = header.split('|').map(s => s.trim());
        const desc = lines[1].trim();

        const steps = lines.slice(2)
            .filter(l => l.trim().startsWith('*'))
            .map(l => {
                const text = l.trim().substring(1).trim();
                return `<div class="roadmap-step"><span class="step-icon">→</span>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
            }).join('');

        html += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${title}</h3>
                    <span class="score">${score}% Match</span>
                </div>
                <div class="tag">${tag}</div>
                <p>${desc}</p>
                <button class="roadmap-btn" onclick="toggleRoadmap(this)">Посмотреть Roadmap (краткий)</button>
                <div class="roadmap-content hidden">
                    <div class="short-roadmap">
                        <h4>Краткий план:</h4>
                        ${steps}
                        <button class="detailed-btn" onclick="generateDetailedPlan(this, '${title}')">
                            Сгенерировать 12-Месячный План
                        </button>
                    </div>
                </div>
            </div>`;
    });

    return html || "<p>AI не смог сгенерировать ответ</p>";
}
