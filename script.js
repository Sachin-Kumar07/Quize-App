let questions = [];
let index = 0;
let score = 0;

async function startQuiz() {
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;

  const apiURL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

  const res = await fetch(apiURL);
  const data = await res.json();

  questions = data.results;
  index = 0;
  score = 0;

  showScreen("quizScreen");
  loadQuestion();
}

function loadQuestion() {
  updateProgress();

  const q = questions[index];

  document.getElementById("qCount").innerText =
    `Question ${index + 1} of ${questions.length}`;

  document.getElementById("question").innerHTML = q.question;

  let options = [...q.incorrect_answers, q.correct_answer];
  options = shuffle(options);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const labels = ["A", "B", "C", "D"];

  options.forEach((option, i) => {
    const div = document.createElement("div");
    div.className = "option";

    div.innerHTML = `
      <span>${labels[i]}.</span>
      <span>${option}</span>
    `;

    div.onclick = () => checkAnswer(option, q.correct_answer);
    optionsDiv.appendChild(div);
  });
}


function checkAnswer(selected, correct) {
  if (selected === correct) score++;

  index++;
  index < questions.length ? loadQuestion() : showResult();
}

function showResult() {
  showScreen("resultScreen");
  document.getElementById("score").innerText =
    `You scored ${score} out of ${questions.length}`;
}

function updateProgress() {
  const percent = (index / questions.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
