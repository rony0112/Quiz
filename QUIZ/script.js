// script.js
const questions = [
    { question: "Qual é o maior animal do mundo?", answers: ["Elefante", "Baleia-azul", "Tubarão-branco", "Girafa"], correct: 1 },
    { question: "Qual a capital do Japão?", answers: ["Seul", "Pequim", "Tóquio", "Bangcoc"], correct: 2 },
    { question: "Quem pintou a Mona Lisa?", answers: ["Van Gogh", "Picasso", "Da Vinci", "Dalí"], correct: 2 },
    { question: "Qual planeta é conhecido como planeta vermelho?", answers: ["Vênus", "Marte", "Júpiter", "Saturno"], correct: 1 },
    { question: "Em que ano o Titanic afundou?", answers: ["1910", "1912", "1915", "1920"], correct: 1 },
    { question: "Qual é o animal mais rápido em terra?", answers: ["Leão", "Guepardo", "Cavalo", "Antílope"], correct: 1 },
    { question: "Quantos continentes existem?", answers: ["5", "6", "7", "8"], correct: 2 },
    { question: "Qual é o maior oceano do mundo?", answers: ["Atlântico", "Índico", "Pacífico", "Ártico"], correct: 2 },
    { question: "Quem escreveu Dom Quixote?", answers: ["Shakespeare", "Cervantes", "Machado de Assis", "Camões"], correct: 1 },
    { question: "Qual elemento tem símbolo 'O'?", answers: ["Ouro", "Oxigênio", "Ósmio", "Osmanto"], correct: 1 },
    { question: "Qual país tem mais Copas do Mundo (até 2026)?", answers: ["Alemanha", "Argentina", "Brasil", "Itália"], correct: 2 },
    { question: "Qual é a moeda do Japão?", answers: ["Yuan", "Iene", "Won", "Baht"], correct: 1 },
    { question: "Quantos lados tem um hexágono?", answers: ["5", "6", "7", "8"], correct: 1 },
    { question: "Qual é o menor país do mundo?", answers: ["Mônaco", "Vaticano", "San Marino", "Liechtenstein"], correct: 1 },
    { question: "Quem é o rei do pop?", answers: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], correct: 1 }
];

let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let timerInterval;
let timeLeft = 15;


const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    end: document.getElementById('end-screen')
};
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const timeEl = document.getElementById('time-left');
const correctEl = document.getElementById('correct-count');
const wrongEl = document.getElementById('wrong-count');
const percentEl = document.getElementById('percentage');
const finalCorrect = document.getElementById('final-correct');
const finalPercent = document.getElementById('final-percentage');
const resultMsg = document.getElementById('result-message');
const highScoreEl = document.getElementById('high-score');


function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
}

function updateProgress() {
    const percent = ((currentIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${percent}%`;
}

function updateScoreDisplay() {
    correctEl.textContent = correctCount;
    wrongEl.textContent = wrongCount;
    const total = correctCount + wrongCount;
    const perc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    percentEl.textContent = `${perc}%`;
}

function startTimer() {
    timeLeft = 15;
    timeEl.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            wrongCount++;
            updateScoreDisplay();
            disableButtons();
            nextBtn.disabled = false;
        }
    }, 1000);
}

function disableButtons() {
    answersEl.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
}

function loadQuestion() {
    const q = questions[currentIndex];
    questionEl.textContent = q.question;
    answersEl.innerHTML = '';

    q.answers.forEach((ans, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.textContent = ans;
        btn.addEventListener('click', () => handleAnswer(idx, btn));
        answersEl.appendChild(btn);
    });

    nextBtn.disabled = true;
    updateProgress();
    startTimer();
}

function handleAnswer(selectedIdx, btn) {
    clearInterval(timerInterval);
    const correctIdx = questions[currentIndex].correct;
    const buttons = answersEl.querySelectorAll('.btn');

    buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === correctIdx) b.classList.add('correct');
        if (i === selectedIdx && i !== correctIdx) b.classList.add('wrong');
    });

    if (selectedIdx === correctIdx) {
        correctCount++;
    } else {
        wrongCount++;
    }

    updateScoreDisplay();
    nextBtn.disabled = false;
}

function nextOrEnd() {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    showScreen('end');
    finalCorrect.textContent = correctCount;
    const perc = Math.round((correctCount / questions.length) * 100);
    finalPercent.textContent = `${perc}%`;
    finalPercent.style.color = perc >= 70 ? '#16a34a' : perc >= 40 ? '#d97706' : '#dc2626';

    let msg = perc >= 80 ? "Você é um gênio absoluto! 🏆" :
              perc >= 60 ? "Muito bom! Continue assim 🔥" :
              perc >= 40 ? "Bom esforço! Dá pra melhorar 😊" :
              "Foi uma batalha... Tenta de novo? 💪";
    resultMsg.textContent = msg;

    let high = localStorage.getItem('quizHighScore') || 0;
    if (correctCount > high) {
        localStorage.setItem('quizHighScore', correctCount);
        high = correctCount;
    }
    highScoreEl.textContent = high;
}


document.getElementById('start-btn').addEventListener('click', () => {
    showScreen('quiz');
    loadQuestion();
});

nextBtn.addEventListener('click', nextOrEnd);

document.getElementById('restart-btn').addEventListener('click', () => {
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    showScreen('start');
});


showScreen('start');