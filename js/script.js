let score = 0;
let targetNumber;
let gameInterval;
let countdownInterval;
let timeLeft = 30;  // Змінено час гри на 30 секунд
let timeForAnswer = 6;  // Початковий час для відповіді (по замовчуванню для легкого рівня)
let gameStarted = false;
let numbers = [];
let numberRange = 9;  // Максимум 9 чисел на всіх рівнях
let numberChangeInterval = 6000; // Початковий інтервал для зміни чисел (6 секунд для легкого рівня)
let selectedDifficulty = '';  // Змінна для зберігання вибраного рівня складності

// Завантаження таблиці лідерів
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = ''; // Очищаємо список перед завантаженням

    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score} (${entry.difficulty})`;
        leaderboardList.appendChild(listItem);
    });

    document.getElementById('leaderboard').style.display = leaderboard.length > 0 ? 'block' : 'none';  // Показуємо таблицю лише якщо є дані
}

// Збереження результату в таблиці лідерів
function saveScore(name, score, difficulty) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score, difficulty });
    leaderboard.sort((a, b) => b.score - a.score); // Сортуємо від найвищого до найнижчого

    // Якщо більше 100 записів, видаляємо найгірший
    if (leaderboard.length > 100) {
        leaderboard.pop();
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();  // Оновлюємо таблицю лідерів
}

// Генерація чисел в залежності від рівня складності
function generateNumbers() {
    numbers = [];
    for (let i = 1; i <= numberRange; i++) {
        numbers.push(i);
    }
    numbers = numbers.sort(() => Math.random() - 0.5);  // Перемішуємо числа
}

// Виведення чисел на екран
function displayNumbers() {
    const numberContainer = document.getElementById('numberContainer');
    numberContainer.innerHTML = '';  // Очищаємо контейнер

    numbers.forEach(num => {
        const numberElement = document.createElement('div');
        numberElement.textContent = num;
        numberElement.classList.add('number');
        numberElement.addEventListener('click', () => checkNumber(num, numberElement));
        numberContainer.appendChild(numberElement);
    });
}

// Початок гри
function startGame() {
    if (gameStarted) return;

    score = 0;
    timeLeft = 30;  // Час гри встановлено на 30 секунд
    gameStarted = true;

    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameResult').style.display = 'none';
    document.getElementById('message').textContent = 'Готуйся до гри!';
    document.getElementById('timer').textContent = `Час: ${timeLeft}`;
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'none';  // Сховати вибір складності
    document.getElementById('startButton').style.display = 'none'; // Ховаємо кнопку "Почати гру"

    // Стартуємо таймер і змінюємо числа після початку гри
    generateNumbers(); // Генеруємо числа одразу після старту гри
    displayNumbers();  // Виводимо числа на екран
    targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
    document.getElementById('message').textContent = `Натискайте на ${targetNumber}!`;

    gameInterval = setInterval(() => {
        generateNumbers();
        displayNumbers();
        targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
        document.getElementById('message').textContent = `Натискайте на ${targetNumber}!`;
    }, numberChangeInterval); // Зміна чисел з інтервалом в залежності від рівня складності

    countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Час: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);  // Таймер кожну секунду
}

// Перевірка числа
function checkNumber(num, numberElement) {
    const messageElement = document.getElementById('message');
    if (num === targetNumber) {
        score++;
        numberElement.style.backgroundColor = '#4CAF50';  // Зелене підсвічування для правильного числа
        messageElement.textContent = `Правильно! Твій рахунок: ${score}`;
        messageElement.style.color = '#4CAF50';  // Зелений колір тексту

        // Затримка перед наступною генерацією
        setTimeout(() => {
            generateNumbers();
            displayNumbers();
            targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
            messageElement.textContent = `Натискайте на ${targetNumber}!`;
            messageElement.style.color = '#333';  // Повертаємо стандартний колір повідомлення
            numberElement.style.backgroundColor = '#4CAF50';  // Повертаємо колір
        }, 500);  // 500 мс на відновлення кольору перед зміною числа
    } else {
        numberElement.style.backgroundColor = '#f44336';  // Червоне підсвічування для неправильного числа
        messageElement.textContent = `Помилка! Твій рахунок: ${score}`;
        messageElement.style.color = '#f44336';  // Червоний колір тексту
        setTimeout(() => numberElement.style.backgroundColor = '', 500);
    }
}

// Завершення гри
function endGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);

    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameResult').style.display = 'block';
    document.getElementById('score').textContent = `Твій рахунок: ${score}`;
    document.getElementById('leaderboard').style.display = 'block';  // Показуємо таблицю лідерів

    // Показуємо кнопку зберегти результат
    document.getElementById('saveScore').style.display = 'inline-block';

    // Зберігаємо результат у таблиці лідерів, якщо є ім'я
    document.getElementById('saveScore').addEventListener('click', () => {
        const userName = document.getElementById('userName').value;
        if (userName) {
            saveScore(userName, score, selectedDifficulty);
            document.getElementById('userName').value = '';  // Очищаємо поле введення
        }
    });

    document.getElementById('restartButton').style.display = 'block'; // Показуємо кнопку для перезапуску гри
}

// Перезапуск гри
function restartGame() {
    document.getElementById('gameResult').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
    gameStarted = false;
    score = 0;
    timeLeft = 30;
}

// Очистити таблицю лідерів
function resetLeaderboard() {
    localStorage.removeItem('leaderboard');
    loadLeaderboard();
}

// Обробка вибору складності
document.getElementById('easyButton').addEventListener('click', () => {
    selectedDifficulty = 'Легкий';
    timeForAnswer = 6;
    numberChangeInterval = 6000;  // 6 секунд
    document.getElementById('startButton').style.display = 'block';
});

document.getElementById('mediumButton').addEventListener('click', () => {
    selectedDifficulty = 'Середній';
    timeForAnswer = 4;
    numberChangeInterval = 4000;  // 4 секунди
    document.getElementById('startButton').style.display = 'block';
});

document.getElementById('hardButton').addEventListener('click', () => {
    selectedDifficulty = 'Складний';
    timeForAnswer = 2;
    numberChangeInterval = 2000;  // 2 секунди
    document.getElementById('startButton').style.display = 'block';
});

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('resetLeaderboardButton').addEventListener('click', resetLeaderboard);

// Завантажуємо таблицю лідерів при старті сторінки
loadLeaderboard();
