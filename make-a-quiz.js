document.addEventListener('DOMContentLoaded', function() {
  fetchQuestions();
});

let selectedQuestions = []; // Array to hold selected questions for the quiz

async function fetchQuestions() {
  const response = await fetch('https://midterm-aarrb.onrender.com/questions');
  const questions = await response.json();
  
  const questionsBank = document.getElementById('questionsBank');
  questions.forEach(question => {
    let questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
      <img src="https://midterm-aarrb.onrender.com/questions/${question.id}/image" alt="Question image">
      <p>Question ${question.id}: ${question.description}</p>
      <div class="choices">
        ${question.choices.map((choice, index) => `
          <label>
            <input type="radio" name="question${question.id}" value="${choice}" disabled>
            ${choice}
          </label>
        `).join('')}
      </div>
    `;
    questionDiv.onclick = function() { selectQuestion(question); };
    questionsBank.appendChild(questionDiv);
  });
}

function selectQuestion(question) {
  // Toggle question selection
  if (selectedQuestions.some(q => q.id === question.id)) {
    selectedQuestions = selectedQuestions.filter(q => q.id !== question.id);
  } else {
    selectedQuestions.push(question);
  }
  updateSelectedQuestionsUI();
  updateQuestionCount();
}

function updateSelectedQuestionsUI() {
  const selectedQuestionsContainer = document.getElementById('selectedQuestions');
  selectedQuestionsContainer.innerHTML = '';
  
  selectedQuestions.forEach(question => {
    let questionDiv = document.createElement('div');
    questionDiv.className = 'selected-question';
    questionDiv.innerHTML = `
      <p>Question ${question.id}: ${question.description}</p>
      <div class="choices">
        ${question.choices.map((choice, index) => `
          <label>
            <input type="radio" name="selectedQuestion${question.id}" value="${choice}" disabled>
            ${choice}
          </label>
        `).join('')}
      </div>
    `;
    questionDiv.onclick = function() { deselectQuestion(question); };
    selectedQuestionsContainer.appendChild(questionDiv);
  });
}

function deselectQuestion(question) {
  selectedQuestions = selectedQuestions.filter(q => q.id !== question.id);
  updateSelectedQuestionsUI();
  updateQuestionCount();
}

function updateQuestionCount() {
  document.getElementById('questionCount').textContent = selectedQuestions.length;
}

async function saveQuiz() {
  const title = document.getElementById('quizTitle').value;
  if (title.trim() === "") {
    alert('Please enter a title for the quiz.');
    return;
  }

  const payload = {
    title: title,
    questionIds: selectedQuestions.map(q => q.id)
  };

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  const response = await fetch('https://midterm-aarrb.onrender.com/quizzes', request);
  if (response.ok) {
    alert('Quiz saved successfully!');
    // Optionally reset the UI for a new quiz
    selectedQuestions = [];
    document.getElementById('quizTitle').value = '';
    updateSelectedQuestionsUI();
    updateQuestionCount();
  } else {
    alert('Failed to save the quiz. Please try again.');
  }
}

async function saveAndNewQuiz() {
  await saveQuiz();
  // Reset for a new quiz
  selectedQuestions = [];
  document.getElementById('quizTitle').value = '';
  updateSelectedQuestionsUI();
  updateQuestionCount();
}