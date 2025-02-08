const RESULTS_KEY = "quizResults";

export function saveQuizResult(score, difficulty, category) {
  const results = getQuizResults();
  const newResult = {
    score: score,
    difficulty: difficulty,
    category: category,
    date: new Date().toLocaleString(),
  };

  results.push(newResult);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function getQuizResults() {
  const results = localStorage.getItem(RESULTS_KEY);
  return results ? JSON.parse(results) : [];
}
