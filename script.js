// === КОНФИГУРАЦИЯ ===
const API_URL = "https://cold-water-2c56.baqberqauratuly.workers.dev"; // твой Worker
const TOTAL_QUESTIONS = 10;

// === ЗАПУСК ===
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('quiz-form').addEventListener('submit', e => {
        e.preventDefault();
        startLoadingScreen();
    });
});

// === ЭКРАНЫ ===
function startLoadingScreen() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    const phrases = ["Анализируем твои ответы...", "Подбираем идеальные профессии...", "Формируем рекомендации..."];
    let i = 0;
    const interval = setInterval(() => {
        if (i < phrases.length) {
            document.getElementById('loading-text').textContent = phrases[i++];
        }
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
    btn.textContent = content.classList.contains('hidden') ? 'Показать Roadmap' : 'Скрыть';
}

// === ОСНОВНАЯ ЛОГИКА С OPENAI ===
async function calculateResultsWithAI() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form);

    const userPrompt = `Проанализируй эти ответы подростка и дай ТОП-3 самых подходящих профессий.
Ответы:
${JSON.stringify(answers, null, 2)}

Требования к ответу:
- Только на русском языке
- Чёткая структура: номер, название, процент соответствия (75-98%), категория в скобках
- Краткое объяснение (2-3 предложения)
- 3 практических шага для старта
- Разделяй профессии тремя дефисами "---"
Пример:
### 1. Веб-разработчик | 94% | (IT)
Ты любишь логику и творчество...
* Шаг 1: Изучи HTML/CSS за 2 недели
---`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Ты — лучший карьерный консультант для подростков в России. Отвечай честно, вдохновляюще и структурировано." },
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!response.ok) throw new Error(`Ошибка ${response.status}`);

        const data = await response.json();
        const text = data.choices[0].message.content;

        // Красивый Markdown → HTML
        const html = text
            .replace(/^### (.*)$/gm, '<div class="career-card"><h3>$1</h3>')
            .replace(/\|\s*(\d+%)\s*\|\s*\(([^)]+)\)/g, '<span class="score">$1</span><span class="tag">$2</span>')
            .replace(/\* Шаг \d+:? (.*)/g, '<div class="roadmap-step">→ $1</div>')
            .replace(/---/g, '</div><hr>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            + '</div>';

        showResultScreen(html);

    } catch (err) {
        console.error(err);
        showResultScreen(`
            <h3>Ошибка связи с ИИ</h3>
            <p>Проверь интернет или попробуй позже.</p>
            <button onclick="location.reload()" style="padding:10px 20px;margin-top:20px;">Попробовать заново</button>
        `);
    }
}
