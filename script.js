// =======================================================================
// === 🔑 КОНФИГУРАЦИЯ API GEMINI (ОБЯЗАТЕЛЬНО К ЗАПОЛНЕНИЮ) ===
// =======================================================================

// !!! ВСТАВЬТЕ СЮДА СВОЙ ЛИЧНЫЙ API-КЛЮЧ GEMINI !!!
// Ключ должен быть внутри двойных кавычек.
const GEMINI_API_KEY = ; 
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
    const interval = setInterval(() => {
        if(i < phrases.length) document.getElementById('loading-text').innerText = phrases[i++];
    }, 700);

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
 * Переключает видимость короткого Roadmap.
 */
function toggleRoadmap(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('hidden');
    
    if (content.classList.contains('hidden')) {
        button.textContent = 'Посмотреть Roadmap (краткий)';
    } else {
        button.textContent = 'Скрыть Roadmap';
    }
}


// =======================================================================
// === 🧠 ФУНКЦИИ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (GEMINI API) ===
// =======================================================================

/**
 * Главная функция: делает первый API-запрос для получения ТОП-3 профессий
 */
async function calculateResultsWithAI() {
    // Собираем все ответы пользователя для отправки ИИ
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form.entries());
    
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
                    temperature: 0.2
                }
            })
        });

        const data = await response.json();
        
        const aiText = data.candidates[0].content.parts[0].text;
        const htmlContent = parseAITextToHTML(aiText);
        
        showResultScreen(htmlContent);

    } catch (error) {
        console.error("Ошибка при обращении к Gemini API:", error);
        showResultScreen("<h3>К сожалению, произошла ошибка подключения к AI-модели. Пожалуйста, проверьте API-ключ.</h3>");
    }
}

/**
 * Формирует подробный запрос для модели ИИ, чтобы она знала, как ответить.
 */
function createAIPrompt(answers) {
    const formattedAnswers = JSON.stringify(answers, null, 2);

    return `
        Ты — высококвалифицированный AI-карьерный консультант для подростков. Твоя задача — проанализировать ответы на 10 вопросов и предложить ТОП-3 наиболее подходящих профессий.

        Твои результаты должны быть строго структурированы.

        Используй следующую структуру для ответа, без лишних слов до и после:
        
        ### 1. [Название Профессии 1] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Короткий практический шаг]
        * Шаг 2: [Короткий практический шаг]
        * Шаг 3: [Короткий практический шаг]
        ---
        ### 2. [Название Профессии 2] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Короткий практический шаг]
        * Шаг 2: [Короткий практический шаг]
        * Шаг 3: [Короткий практический шаг]
        ---
        ### 3. [Название Профессии 3] | [Процент Соответствия] | [Категория]
        [Краткое описание, почему эта профессия подходит]
        * Шаг 1: [Короткий практический шаг]
        * Шаг 2: [Короткий практический шаг]
        * Шаг 3: [Короткий практический шаг]
        
        Пример категорий: IT, DESIGN, SCIENCE, MANAGEMENT, HUMANITIES.
        Процент соответствия должен быть целым числом от 70 до 99.
        
        Вот ответы пользователя:
        ${formattedAnswers}
    `;
}

/**
 * Парсит структурированный текст от ИИ в HTML-карточки.
 */
function parseAITextToHTML(aiText) {
    const blocks = aiText.trim().split('---').filter(block => block.trim() !== '');
    let html = '';

    blocks.forEach(block => {
        const lines = block.trim().split('\n').filter(line => line.trim() !== '');

        if (lines.length < 2) return; 

        const header = lines[0].replace('###', '').trim();
        const parts = header.split('|').map(p => p.trim());

        if (parts.length < 3) return;

        const title = parts[0];
        const score = parts[1];
        const tag = parts[2];
        
        const description = lines[1].trim();

        // Формируем КРАТКИЙ Roadmap (шаги начинаются с '*')
        const roadmapSteps = lines.slice(2)
            .filter(line => line.trim().startsWith('*'))
            .map(line => {
                const stepText = line.trim().substring(1).trim();
                const formattedStep = stepText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return `<div class="roadmap-step"><span class="step-icon">→</span>${formattedStep}</div>`;
            }).join('');
        
        html += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${title}</h3>
                    <span class="score">${score}% Match</span>
                </div>
                <div class="tag">${tag}</span></div>
                <p>${description}</p>
                
                <button class="roadmap-btn" onclick="toggleRoadmap(this)">
                    Посмотреть Roadmap (краткий)
                </button>
                <div class="roadmap-content hidden">
                    <div class="short-roadmap">
                        <h4>Краткий план действий:</h4>
                        ${roadmapSteps}
                        <button class="detailed-btn" onclick="generateDetailedPlan(this, '${title}')">
                            Сгенерировать 12-Месячный План 🔥
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

/**
 * НОВАЯ ВОЗМОЖНОСТЬ: Делает второй API-запрос для генерации детального 12-месячного плана.
 */
async function generateDetailedPlan(button, jobName) {
    const roadmapContainer = button.closest('.roadmap-content');
    const existingPlan = roadmapContainer.querySelector('.detailed-plan');
    
    // Предотвращаем повторную генерацию
    if (existingPlan) {
        existingPlan.classList.toggle('hidden');
        button.textContent = existingPlan.classList.contains('hidden') ? 'Сгенерировать 12-Месячный План 🔥' : 'Скрыть Детальный План';
        return;
    }
    
    // 1. Показываем загрузку
    button.disabled = true;
    button.textContent = 'Генерация... Это может занять несколько секунд.';

    // 2. Создаем специальный промпт для 12-месячного плана
    const detailedPrompt = `
        Сгенерируй детальный 12-месячный план обучения и развития для профессии "${jobName}". 
        План должен быть максимально практичным и полезным для подростка.
        
        Используй следующую структуру (строго):
        ## Годовой План Развития: ${jobName}
        - Месяц 1: [Конкретные действия, что изучить и какой проект начать]
        - Месяц 2: [Конкретные действия, что изучить и какой проект начать]
        - Месяц 3: [Конкретные действия, что изучить и какой проект начать]
        ...
        - Месяц 12: [Итог и цель]
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: detailedPrompt }] }],
                config: {
                    temperature: 0.5 // Чуть выше, чтобы ИИ был более креативным
                }
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        
        // 3. Парсим и вставляем результат
        let htmlContent = aiText.replace(/## (.*?)\n/, '<h4>$1</h4>'); // Заголовок
        htmlContent = htmlContent.replace(/- (.*?)\n/g, '<div class="roadmap-step detailed"><span class="step-icon">★</span>$1</div>'); // Маркеры
        
        const detailedDiv = document.createElement('div');
        detailedDiv.classList.add('detailed-plan');
        detailedDiv.innerHTML = htmlContent;

        roadmapContainer.appendChild(detailedDiv);
        button.textContent = 'Скрыть Детальный План';
        
    } catch (error) {
        console.error("Ошибка при генерации детального плана:", error);
        button.textContent = 'Ошибка генерации. Попробуйте снова.';
    } finally {
        button.disabled = false;
    }
}
}



