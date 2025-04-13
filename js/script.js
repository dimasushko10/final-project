let score = 0;
let targetNumber;
let gameInterval;
let countdownInterval;
let timeLeft = 30;  
let timeForAnswer = 6;  
let gameStarted = false;
let numbers = [];
let numberRange = 9;  
let numberChangeInterval = 6000; 
let selectedDifficulty = '';  

// Завантаження таблиці лідерів
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = ''; 

    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score} (${entry.difficulty})`;
        leaderboardList.appendChild(listItem);
    });

    document.getElementById('leaderboard').style.display = leaderboard.length > 0 ? 'block' : 'none';  
}

// Збереження результату в таблиці лідерів
function saveScore(name, score, difficulty) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score, difficulty });
    leaderboard.sort((a, b) => b.score - a.score); 

    
    if (leaderboard.length > 100) {
        leaderboard.pop();
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();  
}

// Генерація чисел в залежності від рівня складності
function generateNumbers() {
    numbers = [];
    for (let i = 1; i <= numberRange; i++) {
        numbers.push(i);
    }
    numbers = numbers.sort(() => Math.random() - 0.5);  
}

// Виведення чисел на екран
function displayNumbers() {
    const numberContainer = document.getElementById('numberContainer');
    numberContainer.innerHTML = '';  

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
    timeLeft = 30;  
    gameStarted = true;

    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameResult').style.display = 'none';
    document.getElementById('message').textContent = 'Готуйся до гри!';
    document.getElementById('timer').textContent = `Час: ${timeLeft}`;
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'none';  
    document.getElementById('startButton').style.display = 'none'; 

    // Стартуємо таймер і змінюємо числа після початку гри
    generateNumbers(); 
    displayNumbers();  
    targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
    document.getElementById('message').textContent = `Натискайте на ${targetNumber}!`;

    gameInterval = setInterval(() => {
        generateNumbers();
        displayNumbers();
        targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
        document.getElementById('message').textContent = `Натискайте на ${targetNumber}!`;
    }, numberChangeInterval); 

    countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Час: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);  
}

// Перевірка числа
function checkNumber(num, numberElement) {
    const messageElement = document.getElementById('message');
    if (num === targetNumber) {
        score++;
        numberElement.style.backgroundColor = '#4CAF50';  
        messageElement.textContent = `Правильно! Твій рахунок: ${score}`;
        messageElement.style.color = '#4CAF50';  

        // Затримка перед наступною генерацією
        setTimeout(() => {
            generateNumbers();
            displayNumbers();
            targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
            messageElement.textContent = `Натискайте на ${targetNumber}!`;
            messageElement.style.color = '#333';  
            numberElement.style.backgroundColor = '#4CAF50';  
        }, 500);  
    } else {
        numberElement.style.backgroundColor = '#f44336';  
        messageElement.textContent = `Помилка! Твій рахунок: ${score}`;
        messageElement.style.color = '#f44336';  
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
    document.getElementById('leaderboard').style.display = 'block';  

    // Показуємо кнопку зберегти результат
    document.getElementById('saveScore').style.display = 'inline-block';

    // Зберігаємо результат у таблиці лідерів, якщо є ім'я
    document.getElementById('saveScore').addEventListener('click', () => {
        const userName = document.getElementById('userName').value;
        if (userName) {
            saveScore(userName, score, selectedDifficulty);
            document.getElementById('userName').value = '';  
        }
    });

    document.getElementById('restartButton').style.display = 'block'; 
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

loadLeaderboard();
