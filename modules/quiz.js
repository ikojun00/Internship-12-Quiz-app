import { saveQuizResult } from "./storage.js";

export function createQuiz(questions, difficulty, category) {
  let currentQuestionIndex = 0;
  let score = 0;
  let timer = null;
  let selectedAnswer = null;
  let confirmTimer = null;
  let timeLeft = 20;
  let isTimedOut = false;

  function startTimer() {
    const timerElement = document.getElementById("timer");
    timeLeft = 20;
    timerElement.innerHTML = timeLeft;
    isTimedOut = false;

    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      timeLeft--;
      timerElement.innerHTML = timeLeft;

      if (timeLeft <= 0) {
        handleTimeOut();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (timer) {
      clearInterval(timer);
    }
  }

  function resumeTimer() {
    const timerElement = document.getElementById("timer");
    timer = setInterval(() => {
      timeLeft--;
      timerElement.innerHTML = timeLeft;

      if (timeLeft <= 0) {
        handleTimeOut();
      }
    }, 1000);
  }

  function renderQuestion() {
    const questionContainer = document.getElementById("question-container");
    const currentQuestion = questions[currentQuestionIndex];

    questionContainer.innerHTML = `
            <p>Question ${currentQuestionIndex + 1}/5</p>
            <h2>${currentQuestion.question}</h2>
            <div id="answers">
                ${currentQuestion.allAnswers
                  .map(
                    (answer) => `
                    <div class="answer" data-answer="${answer}">
                        ${answer}
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;

    const answers = document.querySelectorAll(".answer");
    answers.forEach((answer) => {
      answer.addEventListener("click", () => {
        if (!isTimedOut) {
          handleAnswer(answer);
        }
      });
    });

    startTimer();
  }

  function handleAnswer(answerElement) {
    if (confirmTimer) {
      clearTimeout(confirmTimer);
    }

    const currentQuestion = questions[currentQuestionIndex];
    selectedAnswer = answerElement.dataset.answer;

    const answers = document.querySelectorAll(".answer");
    answers.forEach((a) => a.classList.remove("selected"));
    answerElement.classList.add("selected");

    pauseTimer();

    confirmTimer = setTimeout(() => {
      const confirmed = confirm("Do you want to confirm this answer?");

      if (confirmed) {
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        answers.forEach((a) => {
          if (a.dataset.answer === currentQuestion.correct_answer) {
            a.classList.add("correct");
          }
          if (a.dataset.answer === selectedAnswer && !isCorrect) {
            a.classList.add("incorrect");
          }
        });

        if (isCorrect) {
          score++;
        }

        const nextBtn = document.getElementById("next-question");
        nextBtn.classList.remove("hidden");

        document.getElementById(
          "score"
        ).innerHTML = `Score: ${score}/${questions.length}`;
      } else {
        answers.forEach((a) => a.classList.remove("selected"));
        selectedAnswer = null;
        resumeTimer();
      }
    }, 2000);
  }

  function handleTimeOut() {
    clearInterval(timer);
    isTimedOut = true;

    const answers = document.querySelectorAll(".answer");
    const currentQuestion = questions[currentQuestionIndex];
    answers.forEach((a) => {
      if (a.dataset.answer === currentQuestion.correct_answer) {
        a.classList.add("correct");
      }
    });

    const nextBtn = document.getElementById("next-question");
    nextBtn.classList.remove("hidden");
  }

  function nextQuestion() {
    currentQuestionIndex += 1;

    const nextBtn = document.getElementById("next-question");
    nextBtn.classList.add("hidden");

    currentQuestionIndex < 5 ? renderQuestion() : endQuiz();
  }

  function endQuiz() {
    document.getElementById("quiz-container").classList.add("hidden");

    const resultsContainer = document.getElementById("results-container");
    const finalScoreElement = document.getElementById("final-score");
    const feedbackElement = document.getElementById("feedback");
    resultsContainer.classList.remove("hidden");

    finalScoreElement.innerHTML = `You scored ${score} out of 5`;

    let feedback;
    if (score === 5) feedback = "Perfect score! You're a trivia master!";
    else if (score >= 4)
      feedback = "Excellent job! You really know your stuff!";
    else if (score >= 3) feedback = "Good effort! Keep learning!";
    else if (score >= 2)
      feedback = "Not bad, but there's room for improvement.";
    else feedback = "Keep practicing and you'll get better!";

    feedbackElement.innerHTML = feedback;
    saveQuizResult(
      score,
      difficulty,
      questions.every((q) => q.category === questions[0].category)
        ? questions[0].category
        : "Any Category"
    );

    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = "Score: 0/5";
  }

  return {
    startQuiz: () => renderQuestion(),
    nextQuestion,
  };
}
