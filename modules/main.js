import { fetchQuizQuestions } from "./api.js";
import { createQuiz } from "./quiz.js";
import { getQuizResults } from "./storage.js";

let currentQuiz = null;

const quizForm = document.getElementById("quiz-form");
const quizSetup = document.getElementById("quiz-setup");
const quizContainer = document.getElementById("quiz-container");
const nextQuestionBtn = document.getElementById("next-question");
const restartBtn = document.getElementById("restart-btn");
const resultsBody = document.getElementById("results-body");

document.addEventListener("DOMContentLoaded", () => {
  loadPreviousResults();

  quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;

    const questions = await fetchQuizQuestions(category, difficulty, type);

    if (questions && questions.length) {
      quizSetup.classList.add("hidden");
      quizContainer.classList.remove("hidden");

      currentQuiz = createQuiz(questions, difficulty, category);
      currentQuiz.startQuiz();
    } else {
      alert("Could not fetch questions. Please try again.");
    }
  });

  nextQuestionBtn.addEventListener("click", () => {
    currentQuiz.nextQuestion();
  });

  restartBtn.addEventListener("click", () => {
    document.getElementById("results-container").classList.add("hidden");
    quizSetup.classList.remove("hidden");
    loadPreviousResults();
  });
});

function loadPreviousResults() {
  const results = getQuizResults();
  resultsBody.innerHTML = "";

  results.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${result.score}/5</td>
            <td>${result.difficulty}</td>
            <td>${result.category}</td>
            <td>${result.date}</td>
        `;
    resultsBody.appendChild(row);
  });
}
