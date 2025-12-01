// === БАЗА ДАННЫХ: 50 ПРОФЕССИЙ ===
// match: Набор идеальных ответов (ключ: значение) для 10 вопросов
const DB = [
    // --- IT & Tech (10) ---
    {n: "Frontend Разработчик", cat: "IT_CODE", match: {q1:"create", q2:"art", q3:"math_it", q4:"intuitive", q9:"digital", q10:"big_picture"}},
    {n: "Backend Разработчик", cat: "IT_CODE", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"digital", q6:"alone"}},
    {n: "Data Scientist/Аналитик", cat: "IT_DATA", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q8:"structure", q7:"calculate"}},
    {n: "UX/UI Дизайнер", cat: "DES", match: {q1:"create", q2:"art", q3:"math_it", q4:"intuitive", q10:"big_picture", q9:"digital"}},
    {n: "DevOps Инженер", cat: "IT_SYS", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"digital", q7:"avoid"}},
    {n: "Cybersecurity Expert", cat: "IT_SYS", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q8:"structure", q7:"calculate"}},
    {n: "Game Developer", cat: "IT_GAME", match: {q1:"create", q2:"tech", q3:"math_it", q4:"intuitive", q9:"digital", q5:"interest"}},
    {n: "AI/ML Engineer", cat: "IT_DATA", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q8:"structure", q5:"interest"}},
    {n: "QA Тестировщик", cat: "IT_SYS", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q10:"detail", q6:"team_member"}},
    {n: "Mobile Разработчик", cat: "IT_CODE", match: {q1:"create", q2:"tech", q3:"math_it", q4:"structured", q9:"digital", q6:"alone"}},

    // --- Business & Management (12) ---
    {n: "Product Manager", cat: "BUS_PROD", match: {q1:"analyze", q2:"social", q4:"collaborative", q6:"team_leader", q5:"money", q8:"summarize"}},
    {n: "Project Manager", cat: "BUS_ORG", match: {q1:"analyze", q2:"social", q4:"structured", q6:"team_leader", q7:"calculate", q9:"service"}},
    {n: "Digital Маркетолог", cat: "MKT", match: {q1:"create", q2:"social", q4:"intuitive", q8:"summarize", q9:"digital", q5:"money"}},
    {n: "SMM Специалист", cat: "MKT", match: {q1:"create", q2:"social", q4:"intuitive", q8:"discuss", q9:"digital", q10:"feeling"}},
    {n: "Бизнес-аналитик", cat: "FIN", match: {q1:"analyze", q2:"social", q3:"math_it", q4:"structured", q8:"structure", q7:"calculate"}},
    {n: "Финансовый аналитик", cat: "FIN", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q5:"money", q7:"calculate"}},
    {n: "HR-Менеджер", cat: "HR", match: {q1:"ignore", q2:"social", q4:"collaborative", q6:"team_member", q5:"help", q10:"feeling"}},
    {n: "Sales Менеджер", cat: "SALES", match: {q1:"ignore", q2:"social", q4:"collaborative", q6:"team_leader", q5:"money", q8:"discuss"}},
    {n: "Предприниматель (CEO)", cat: "BIZ_OWN", match: {q1:"create", q2:"social", q4:"intuitive", q6:"team_leader", q7:"embrace", q5:"money"}},
    {n: "Инвестиционный банкир", cat: "FIN", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q5:"money", q7:"embrace"}},
    {n: "Логист", cat: "BUS_ORG", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q7:"avoid", q9:"physical"}},
    {n: "Бухгалтер", cat: "FIN", match: {q1:"analyze", q3:"math_it", q4:"structured", q7:"avoid", q10:"detail", q6:"alone"}},

    // --- Creative & Arts (10) ---
    {n: "Графический Дизайнер", cat: "DES", match: {q1:"create", q2:"art", q3:"language", q4:"intuitive", q9:"digital", q6:"alone"}},
    {n: "3D Художник/Моделлер", cat: "ART", match: {q1:"create", q2:"art", q3:"math_it", q4:"intuitive", q9:"digital", q5:"interest"}},
    {n: "Архитектор", cat: "ARCH", match: {q1:"create", q2:"art", q3:"math_it", q4:"structured", q9:"physical", q6:"team_member"}},
    {n: "Видеомонтажер", cat: "ART", match: {q1:"create", q2:"art", q3:"language", q4:"intuitive", q9:"digital", q6:"alone"}},
    {n: "Сценарист/Копирайтер", cat: "TEXT", match: {q1:"create", q2:"art", q3:"language", q4:"intuitive", q9:"digital", q6:"alone"}},
    {n: "Арт-директор", cat: "ART_LEAD", match: {q1:"create", q2:"art", q3:"language", q4:"collaborative", q6:"team_leader", q10:"big_picture"}},
    {n: "Фотограф", cat: "ART", match: {q1:"create", q2:"art", q3:"language", q4:"intuitive", q9:"service", q5:"freedom"}},
    {n: "UI Писатель (UX Writer)", cat: "TEXT", match: {q1:"create", q2:"art", q3:"language", q4:"structured", q9:"digital", q10:"detail"}},
    {n: "Ландшафтный Дизайнер", cat: "ARCH", match: {q1:"create", q2:"art", q3:"science", q4:"intuitive", q9:"physical", q5:"interest"}},
    {n: "Моушн Дизайнер", cat: "ART", match: {q1:"create", q2:"art", q3:"math_it", q4:"intuitive", q9:"digital", q5:"interest"}},

    // --- Science, Health & Engineering (10) ---
    {n: "Инженер-механик", cat: "ENG", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"physical", q7:"avoid"}},
    {n: "Инженер-строитель", cat: "ENG", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"physical", q6:"team_leader"}},
    {n: "Биоинженер", cat: "SCI", match: {q1:"analyze", q2:"tech", q3:"science", q4:"structured", q5:"help", q9:"physical"}},
    {n: "Врач/Хирург", cat: "MED", match: {q1:"analyze", q2:"social", q3:"science", q4:"structured", q5:"help", q7:"calculate"}},
    {n: "Эколог", cat: "SCI", match: {q1:"analyze", q2:"social", q3:"science", q4:"structured", q5:"help", q9:"service"}},
    {n: "Психолог/Психотерапевт", cat: "MED_PSY", match: {q1:"ignore", q2:"social", q3:"language", q4:"collaborative", q5:"help", q10:"feeling"}},
    {n: "Фармацевт", cat: "MED", match: {q1:"analyze", q2:"social", q3:"science", q4:"structured", q5:"help", q10:"detail"}},
    {n: "Авиаконструктор", cat: "ENG", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q7:"avoid", q10:"detail"}},
    {n: "Химик-исследователь", cat: "SCI", match: {q1:"analyze", q2:"tech", q3:"science", q4:"structured", q5:"interest", q6:"alone"}},
    {n: "Ветеринар", cat: "MED", match: {q1:"ignore", q2:"social", q3:"science", q4:"structured", q5:"help", q9:"service"}},

    // --- Social, Education & Law (8) ---
    {n: "Юрист/Адвокат", cat: "LAW", match: {q1:"analyze", q2:"social", q3:"language", q4:"structured", q5:"money", q8:"structure"}},
    {n: "Учитель/Преподаватель", cat: "EDU", match: {q1:"ignore", q2:"social", q3:"language", q4:"collaborative", q5:"help", q6:"team_leader"}},
    {n: "Журналист/Корреспондент", cat: "MEDIA", match: {q1:"create", q2:"social", q3:"language", q4:"intuitive", q9:"service", q8:"summarize"}},
    {n: "PR-менеджер", cat: "MEDIA", match: {q1:"create", q2:"social", q3:"language", q4:"collaborative", q6:"team_member", q10:"big_picture"}},
    {n: "Event Менеджер", cat: "ORG", match: {q1:"create", q2:"social", q3:"language", q4:"collaborative", q6:"team_leader", q7:"embrace"}},
    {n: "Переводчик/Лингвист", cat: "TEXT", match: {q1:"analyze", q2:"social", q3:"language", q4:"structured", q9:"service", q6:"alone"}},
    {n: "Социальный работник", cat: "EDU", match: {q1:"ignore", q2:"social", q3:"language", q4:"collaborative", q5:"help", q10:"feeling"}},
    {n: "Дипломат", cat: "LAW", match: {q1:"ignore", q2:"social", q3:"language", q4:"collaborative", q6:"team_leader", q7:"calculate"}},

    // --- Crafts & Others (10) ---
    {n: "Шеф-повар", cat: "CRAFT", match: {q1:"create", q2:"art", q3:"science", q4:"intuitive", q9:"physical", q7:"embrace"}},
    {n: "Пилот", cat: "CRAFT", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"physical", q7:"calculate"}},
    {n: "Машинист/Оператор", cat: "CRAFT", match: {q1:"fix", q2:"tech", q3:"math_it", q4:"structured", q9:"physical", q7:"avoid"}},
    {n: "Фитнес-тренер", cat: "EDU", match: {q1:"ignore", q2:"social", q3:"science", q4:"collaborative", q5:"help", q6:"team_leader"}},
    {n: "Стилист/Имиджмейкер", cat: "CRAFT", match: {q1:"create", q2:"art", q3:"language", q4:"intuitive", q9:"service", q5:"money"}},
    {n: "Гид/Экскурсовод", cat: "ORG", match: {q1:"communicate", q2:"social", q3:"language", q4:"intuitive", q9:"service", q5:"freedom"}},
    {n: "Флорист", cat: "CRAFT", match: {q1:"create", q2:"art", q3:"science", q4:"intuitive", q9:"physical", q6:"alone"}},
    {n: "Специалист по охране труда (ОТ)", cat: "ENG", match: {q1:"analyze", q2:"tech", q3:"science", q4:"structured", q7:"avoid", q10:"detail"}},
    {n: "Веб-аналитик (SEO)", cat: "MKT", match: {q1:"analyze", q2:"tech", q3:"math_it", q4:"structured", q9:"digital", q6:"alone"}},
    {n: "Агроном", cat: "SCI", match: {q1:"analyze", q2:"tech", q3:"science", q4:"structured", q9:"physical", q7:"avoid"}},
];

// === СЛОВАРЬ КАТЕГОРИЙ для ПОЛЬЗОВАТЕЛЬСКОГО ВЫВОДА (Расширенный) ===
const CATEGORY_NAMES = {
    "IT_CODE": "Разработка ПО (Backend/Frontend)",
    "IT_DATA": "Аналитика и Data Science",
    "IT_SYS": "Системы и IT-Безопасность",
    "IT_GAME": "Разработка Игр (GameDev)",
    "DES": "Дизайн Интерфейсов (UX/UI)",
    "ARCH": "Архитектура и Проектирование",
    "ART": "Искусство и Цифровой Креатив",
    "ART_LEAD": "Арт-Менеджмент",
    "TEXT": "Работа с Текстом и Контентом",
    "BUS_PROD": "Управление Продуктом (PM)",
    "BUS_ORG": "Управление Проектами и Логистика",
    "MKT": "Маркетинг и Продвижение",
    "HR": "Управление Персоналом (HR)",
    "FIN": "Финансы, Бухгалтерия и Аналитика",
    "BIZ_OWN": "Предпринимательство (CEO)",
    "SALES": "Продажи и Клиентский Сервис",
    "ENG": "Инженерия и Техническая сфера",
    "SCI": "Наука и Естественные Исследования",
    "MED": "Медицина и Здравоохранение",
    "MED_PSY": "Психология и Терапия",
    "LAW": "Право и Юриспруденция",
    "EDU": "Образование и Тренерство",
    "ORG": "Организация и Event-менеджмент",
    "MEDIA": "СМИ и Коммуникации",
    "CRAFT": "Специальные Навыки и Ремесла"
};

// === ФУНКЦИОНАЛ ===

function startQuiz() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
}

function updateProgress() {
    const form = document.getElementById('quiz-form');
    // Внимание: 10 вопросов!
    const total = 10; 
    let answered = 0;
    for(let el of form.elements) {
        if(el.tagName === 'SELECT' && el.value) answered++;
    }
    const percent = (answered / total) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
}

document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    const phrases = ["Анализ психотипа...", "Сравнение с базой 50 профессий...", "Подбор Roadmap...", "Финальный расчет..."];
    let i = 0;
    const interval = setInterval(() => {
        if(i < phrases.length) document.getElementById('loading-text').innerText = phrases[i++];
    }, 700);

    setTimeout(() => {
        clearInterval(interval);
        calculateResults();
    }, 3000);
});

// --- ЛОГИКА ПОДСЧЕТА ---
function calculateResults() {
    const form = new FormData(document.getElementById('quiz-form'));
    const answers = Object.fromEntries(form.entries());
    
    const scoredDB = DB.map(job => {
        let score = 0;
        // Проходим по критериям профессии
        for (let key in job.match) {
            if (answers[key] === job.match[key]) {
                score += 10; // Точное совпадение
            } else {
                score += 3; // Частичное совпадение (за каждый отвеченный вопрос)
            }
        }
        // Максимальный балл: 6*10 = 60 (так как всего 6 критериев, но 10 вопросов)
        // Добавляем немного рандома (0-5), чтобы результаты не были скучными
        score += Math.floor(Math.random() * 5); 
        return { ...job, score };
    });

    scoredDB.sort((a, b) => b.score - a.score);
    const top3 = scoredDB.slice(0, 3);

    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    top3.forEach((job, index) => {
        // Макс. возможный балл за 6 критериев: 6*10 + 5 = 65. Берем 60 для нормы.
        const percent = Math.min(Math.round((job.score / 60) * 100), 99); 
        const color = index === 0 ? '#10b981' : '#f59e0b';
        const visibleCatName = CATEGORY_NAMES[job.cat] || 'Неизвестная сфера';
        
        container.innerHTML += `
            <div class="career-card">
                <div class="career-header">
                    <h3>${index + 1}. ${job.n}</h3>
                    <span class="score" style="color:${color}">${percent}% Совпадение</span>
                </div>
                <p>Отличный выбор для категории <span class="tag">${visibleCatName}</span>.</p>
                
                <button class="roadmap-btn" onclick="toggleRoadmap(this, '${job.n}', '${job.cat}')">
                    ⚡ Сгенерировать Детальный Roadmap
                </button>
                <div class="roadmap-content hidden"></div>
            </div>
        `;
    });

    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
}

// --- ГЕНЕРАТОР ROADMAP (ФИНАЛЬНЫЙ ДЕТАЛЬНЫЙ) ---
function toggleRoadmap(btn, jobName, cat) {
    const contentDiv = btn.nextElementSibling;
    
    if (!contentDiv.classList.contains('hidden')) {
        contentDiv.classList.add('hidden');
        btn.innerHTML = '⚡ Сгенерировать Детальный Roadmap';
        return;
    }

    let steps = [];
    
    if (cat.includes('CODE') || cat.includes('IT_SYS') || cat.includes('IT_DATA') || cat.includes('IT_GAME')) {
        // IT (Объединенный)
        steps = [
            "**Шаг 1. Основы (3 мес):** Пройти курс по Python или JavaScript (CS50/FreeCodeCamp). Изучить основы Git.",
            "**Шаг 2. Инструменты (2 мес):** Освоить SQL и основы работы с базами данных (для всех IT-специальностей).",
            "**Шаг 3. Портфолио (3 мес):** Создать 3 **пет-проекта** (например, API, калькулятор, или клон сайта). Залить на GitHub.",
            "**Шаг 4. Углубление (2 мес):** Выбрать узкую специализацию (Backend, Data Science, Cyber) и пройти курс по ней.",
            "**Шаг 5. Карьера:** Подать заявку на **стажировку** или найти ментора на LinkedIn."
        ];
    } else if (cat.includes('DES') || cat.includes('ART') || cat.includes('ARCH') || cat.includes('TEXT')) {
        // Дизайн, Креатив, Текст
        steps = [
            "**Шаг 1. Инструмент (2 мес):** Мастерски освоить Figma (дизайнеры) или Adobe Illustrator/Premiere Pro (артисты).",
            "**Шаг 2. Теория (1 мес):** Изучить основы композиции, типографики, и, для UX — принципы юзабилити.",
            "**Шаг 3. Насмотренность:** Ежедневно анализировать лучшие работы на **Behance/Dribbble**.",
            "**Шаг 4. Проект (4 мес):** Сделать 3-5 **полноценных кейсов** (редро интерфейса, свой брендбук, или анимационный ролик).",
            "**Шаг 5. Публикация:** Оформить кейсы на Behance и начать рассылку резюме на фриланс-биржи."
        ];
    } else if (cat.includes('BUS') || cat.includes('FIN') || cat.includes('HR') || cat.includes('SALES')) {
        // Бизнес, Финансы, Менеджмент
        steps = [
            "**Шаг 1. База (3 мес):** Прочитать 3 ключевые книги по менеджменту/финансам (e.g., 'Lean Startup').",
            "**Шаг 2. Скиллы (2 мес):** Углубленное изучение **Excel/Google Sheets** и навыков презентации/переговоров.",
            "**Шаг 3. Нетворкинг:** Начать посещать профильные конференции, искать ментора в своей сфере.",
            "**Шаг 4. Практика (3 мес):** Участвовать в студенческом/школьном совете, или организовать мини-проект.",
            "**Шаг 5. Сертификация:** Получить сертификаты по Google Analytics/Яндекс.Метрика или основам проджект-менеджмента."
        ];
    } else if (cat.includes('SCI') || cat.includes('MED') || cat.includes('ENG')) {
        // Наука, Медицина, Инженерия
        steps = [
            "**Шаг 1. Фундамент:** Углубленное изучение профильных предметов (Биология, Физика, Математика, Химия).",
            "**Шаг 2. Литература:** Научиться читать **научные статьи** и исследования на английском.",
            "**Шаг 3. Опыт (3 мес):** Получить волонтерскую или летнюю **стажировку** в лаборатории/больнице/КБ.",
            "**Шаг 4. Проект:** Выполнить собственный исследовательский проект с наставником.",
            "**Шаг 5. Подготовка:** Целенаправленная подготовка к профильным экзаменам (ЕГЭ/ДВИ) или олимпиадам."
        ];
    } else {
        // Социальные, Право, Прочие
        steps = [
            "**Шаг 1. Теория:** Изучить основы психологии, риторики, и профильное законодательство.",
            "**Шаг 2. Коммуникация:** Развивать навыки публичных выступлений (вступить в клуб дебатов).",
            "**Шаг 3. Опыт:** Получить опыт **волонтерства** или организации социального мероприятия/акции.",
            "**Шаг 4. Практика:** Найти ментора в своей сфере (юриспруденция/образование) и участвовать в его работе.",
            "**Шаг 5. Портфолио:** Собрать лучшие примеры своих работ или проектов (речи, статьи, кейсы) в одно портфолио."
        ];
    }

    // --- РЕНДЕРИНГ ШАГОВ ---
    let htmlContent = '';
    steps.forEach((text, index) => {
        htmlContent += `<div class="roadmap-step"><span class="step-icon">${index + 1}.</span> ${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
    });

    contentDiv.innerHTML = htmlContent;
    contentDiv.classList.remove('hidden');
    btn.innerHTML = '❌ Скрыть Roadmap';
}