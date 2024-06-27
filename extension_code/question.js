document.addEventListener("DOMContentLoaded", (event) => {
  document
    .getElementById("answer-a")
    .addEventListener("click", () => checkAnswer("A"));
  document
    .getElementById("answer-b")
    .addEventListener("click", () => checkAnswer("B"));
  document
    .getElementById("answer-c")
    .addEventListener("click", () => checkAnswer("C"));
  document
    .getElementById("answer-d")
    .addEventListener("click", () => checkAnswer("D"));

  document.getElementById("skipButton").addEventListener("click", () => {
    // Add functionality for the skip button if needed
  });
});
function checkAnswer(selectedAnswer) {
  const rightAnswer = document
    .getElementById("right-answer")
    .textContent.trim();
  console.log(rightAnswer);
  const feedback = document.getElementById("feedback");
  console.log(feedback);

  if (selectedAnswer === rightAnswer) {
    console.log("right");
    feedback.textContent = "Correct!";
    feedback.className = "correct";
    feedback.style.color = "green";
  } else {
    console.log("wrong");
    feedback.textContent = "Incorrect. Try again!";
    feedback.className = "incorrect";
    feedback.style.color = "red";
  }
}

document.getElementById("skipButton").onclick = function () {
  // Add functionality for the skip button if needed
};
