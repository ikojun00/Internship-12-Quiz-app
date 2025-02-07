import { fetchQuizQuestions } from "./api.js";

const quizForm = document.getElementById("quiz-form");
const quizSetup = document.getElementById("quiz-setup");
const quizContainer = document.getElementById("quiz-container");

document.addEventListener("DOMContentLoaded", () => {
  quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;

    const questions = await fetchQuizQuestions(category, difficulty, type);

    if (questions && questions.length) {
      quizSetup.classList.add("hidden");
      quizContainer.classList.remove("hidden");
      console.log(questions);
    } else {
      alert("Could not fetch questions. Please try again.");
    }
  });
});
