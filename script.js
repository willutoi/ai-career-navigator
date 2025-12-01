// =======================================================================
// === 🔑 КОНФИГУРАЦИЯ API GEMINI (ОБЯЗАТЕЛЬНО К ЗАПОЛНЕНИЮ) ===
// =======================================================================

// !!! ВСТАВЬТЕ СЮДА СВОЙ ЛИЧНЫЙ API-КЛЮЧ GEMINI !!!
// Ключ должен быть внутри двойных кавычек.
const GEMINI_API_KEY = AIzaSyDlf46A5gJNyHnUp3w_BE1pWTOV-v0hPOs; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

// =======================================================================
// === ИНТЕРФЕЙС и ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ===
// =======================================================================

const TOTAL_QUESTIONS = 10;

document.addEventListener('DOMContentLoaded', () => {
    // Обработка отправки формы для запуска теста
    const quizForm = document.getElementById('quiz-form');
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        startLoadingScreen();
    });
});

/**
 * Переключает экран на тест
 */
function startQuiz() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    updateProgress();
}

/**
 * Обновляет прогресс-бар в зависимости от количества ответов
 */
function updateProgress() {
    const form = document.getElementById('quiz-form');
    // Считаем, сколько <select> элементов имеют выбранное значение
    const answeredCount = Array.from(form.querySelectorAll('select')).filter(select => select.value !== "").length;
    
    const percentage = (answeredCount / TOTAL_QUESTIONS) * 100;
    document.getElementById('progress-bar').style.width = percentage + "%";
}

/**
 * Показывает экран загрузки и запускает логику ИИ после задержки
 */
function startLoadingScreen() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    const phrases = ["Анализ психотипа...", "Формирование запроса к AI...", "Генерация Roadmap...", "Финальный расчет..."];
    let i = 0;
    // Анимация текста загрузки
    const interval = setInterval(() => {
        if(i < phrases.length) document.getElementById('loading-text').innerText = phrases[i++];
    }, 700);

    // Запускаем ИИ после имитации загрузки
    setTimeout(() => {
        clearInterval(interval);
        calculateResultsWithAI(); // <-- ВЫЗЫВАЕМ ФУНКЦИЮ ИИ
    }, 3000); // 3 секунды задержки
}

/**
 * Переключает экран на результаты
 */
function showResultScreen(htmlContent) {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('results-container').innerHTML = htmlContent;
}

/**
 * Переключает видимость Roadmap.
 */
function toggleRoadmap(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('hidden');
    
    if (content.classList.contains('hidden')) {
        button.textContent = 'Посмотреть Roadmap';
    } else {
        button.textContent = 'Скрыть Roadmap';
    }
}


// =======================================================================
// === 🧠 ФУНКЦИИ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (GEMINI API) ===
// =======================================================================

async function calculateResultsWithAI() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form.entries());
    
    // 1. Создаем запрос для модели Gemini (Профессиональный Пропмт)
    const prompt = createAIPrompt(answers);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    temperature: 0.2 // Низкая температура для точных и структурированных результатов
                }
            })
        });

        const data = await response.json();
        
        // Получаем чистый текст ответа от ИИ
        const aiText = data.candidates[0].content.parts[0].text;
        
        // 2. Парсим текст и генерируем HTML
        const htmlContent = parseAITextToHTML(aiText);
        
        // 3. Показываем результат
        showResultScreen(htmlContent);

    } catch (error) {
        console.error("Ошибка при обращении к Gemini API:", error);
        // Если API-ключ неверный или лимиты исчерпаны
        showResultScreen("<h3>К сожалению, произошла ошибка подключения к AI-модели. Пожалуйста, проверьте API-ключ.</h3>");
    }
}

/**
 * Формирует подробный запрос для модели ИИ.
 */
function createAIPrompt(answers) {
    const formattedAnswers = JSON.stringify(answers, null, 2);

    return `
        Ты — высококвалифицированный AI-карьерный консультант для подростков. Твоя задача — проанализировать ответы на 10 вопросов и предложить ТОП-3 наиболее подходящих профессий, а также детальный план действий (Roadmap) для каждой.

        Твои результаты должны быть строго структурированы, чтобы их можно было легко распарсить и отобразить на сайте.
        
        Используй следующую структуру для ответа, без лишних слов до и после:
        
        ### 1. [Название Профессии 1] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Первый практический шаг]
        * Шаг 2: [Второй практический шаг]
        * Шаг 3: [Третий практический шаг]
        ---
        ### 2. [Название Профессии 2] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Первый практический шаг]
        * Шаг 2: [Второй практический шаг]
        * Шаг 3: [Третий практический шаг]
        ---
        ### 3. [Название Профессии 3] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Первый практический шаг]
        * Шаг 2: [Второй практический шаг]
        * Шаг 3: [Третий практический шаг]
        
        Пример категорий: IT, DESIGN, SCIENCE, MANAGEMENT, HUMANITIES.
        Процент соответствия должен быть целым числом от 70 до 99.
        
        Вот ответы пользователя (ключ q1..q10 и значение ответа):
        ${formattedAnswers}
    `;
}

/**
 * Парсит структурированный текст от ИИ в HTML-карточки.
 */
function parseAITextToHTML(aiText) {
    // Разбиваем ответ на отдельные блоки по разделителю "---"
    const blocks = aiText.trim().split('---').filter(block => block.trim() !== '');
    let html = '';

    blocks.forEach(block => {
        const lines = block.trim().split('\n').filter(line => line.trim() !== '');

        if (lines.length < 2) return; 

        // Парсим заголовок (например, "### 1. 3D Художник | 92 | DESIGN")
        const header = lines[0].replace('###', '').trim();
        const parts = header.split('|').map(p => p.trim());

        if (parts.length < 3) return;

        const title = parts[0];
        const score = parts[1];
        const tag = parts[2];
        
        const description = lines[1].trim();

        // Формируем Roadmap (шаги начинаются с '*')
        const roadmapSteps = lines.slice(2)
            .filter(line => line.trim().startsWith('*'))
            .map(line => {
                const stepText = line.trim().substring(1).trim();
                // Заменяем жирный текст (**) на <strong>
                const formattedStep = stepText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return `<div class="roadmap-step"><span class="step-icon">→</span>${formattedStep}</div>`;
            }).join('');
        
        // Собираем HTML-карточку
        html += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${title}</h3>
                    <span class="score">${score}% Match</span>
                </div>
                <div class="tag">${tag}</span></div>
                <p>${description}</p>
                
                <button class="roadmap-btn" onclick="toggleRoadmap(this)">
                    Посмотреть Roadmap
                </button>
                <div class="roadmap-content hidden">
                    ${roadmapSteps}
                </div>
            </div>
        `;
    });

    return html;
}

