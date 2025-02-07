const BASE_URL = "https://opentdb.com/api.php";

export async function fetchQuizQuestions(category, difficulty, type) {
  const params = new URLSearchParams({
    amount: 5,
    type: type,
  });

  if (category && category !== "") {
    params.append("category", category);
  }
  if (difficulty && difficulty !== "") {
    params.append("difficulty", difficulty);
  }

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch quiz questions");
    }

    const data = await response.json();

    return data.results.map((question) => ({
      ...question,
      allAnswers: shuffleArray([
        ...question.incorrect_answers,
        question.correct_answer,
      ]),
    }));
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return null;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
