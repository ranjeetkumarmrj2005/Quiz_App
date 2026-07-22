let startBtn = document.querySelector('.startBtn');
let infoBox = document.querySelector('.infoBox');
let exitBtn = document.querySelector('.exitBtn');
let continueBtn = document.querySelector('.continueBtn');
let quizBox = document.querySelector('.quiz-box');
let questionText = document.querySelector('.questionText');
let allOptions = document.querySelectorAll('.options');
let nextBtn = document.querySelector('.nextBtn');
let timeline = document.querySelector('.timeline');
let currentQuestionIndicator = document.querySelector(
	'.currentQuestionIndicator'
);
let progressBar = document.querySelector('.progressBar');
let timeLineTitle = document.querySelector('.time-line-title');
let replayQuiz = document.querySelector('.replay_Quiz');
let quitQuiz = document.querySelector('.quit_Quiz');
let resultBox = document.querySelector('.result-box');
let scoreText = document.querySelector('.score_text');
let currentQustionIndex = 0;
let userScore = 0;
let timeLineInterval = null;
let progressBarInterval = null;
const TickIcon = `<div class="icon tick"><i class="fa-solid fa-check"></i></div>`;
const CrossIcon = `<div class="icon cross"><i class="fa-solid fa-xmark"></i></div>`;
startBtn.addEventListener('click', () => {
	//we have to inject a class name to info box
	infoBox.classList.add('activeInfoBox');
});

exitBtn.addEventListener('click', () => {
	//we have to remove the class name from info box
	infoBox.classList.remove('activeInfoBox');
});

continueBtn.addEventListener('click', () => {
	infoBox.classList.remove('activeInfoBox');
	quizBox.classList.add('activeQuizBox');
	//here we need to start showing questions
	showQuestion(currentQustionIndex);
	handleTiming(15);
	handleProgressBar();
	timeLineTitle.innerText = 'Time Left';
});

nextBtn.addEventListener('click', () => {
	if (currentQustionIndex < 9) {
		currentQustionIndex = currentQustionIndex + 1;
		//reset the time
		//reset the progress bar
		handleTiming(15);
		handleProgressBar();
		showQuestion(currentQustionIndex);
		nextBtn.classList.remove('active');
		timeLineTitle.innerText = 'Time Left';
	} else {
		//you reached the last question
		//you need to show result
		clearInterval(progressBarInterval);
		clearInterval(timeLineInterval);
		quizBox.classList.remove('activeQuizBox');
		resultBox.classList.add('activeResultBox');
		handleShowResults();
	}
});

quitQuiz.addEventListener('click', () => {
	restart();
	resultBox.classList.remove('activeResultBox');
});

replayQuiz.addEventListener('click', () => {
	restart();
	resultBox.classList.remove('activeResultBox');
	quizBox.classList.add('activeQuizBox');
	showQuestion(currentQustionIndex);
	handleTiming(15);
	handleProgressBar();
	timeLineTitle.innerText = 'Time Left';
});

//function to show/render questions
const showQuestion = (index) => {
	questionText.innerText =
		'' + questions?.[index].numb + '. ' + questions?.[index].question;

	for (let i = 0; i < allOptions?.length; i++) {
		allOptions[i].innerText = questions?.[index].options?.[i];
		allOptions[i].classList.remove('correct');
		allOptions[i].classList.remove('incorrect');
		allOptions[i].classList.remove('disabled');

		if (index === 0) {
			allOptions[i]?.addEventListener('click', optionClickHanlder);
		}
	}

	currentQuestionIndicator.innerText = index + 1;
};

const handleTiming = (time) => {
	clearInterval(timeLineInterval);
	timeline.innerText = time;
	let timeValue = time;
	timeLineInterval = setInterval(() => {
		timeValue--;

		if (timeValue < 10) {
			timeline.innerText = '0' + timeValue;
		} else {
			timeline.innerText = timeValue;
		}

		if (timeValue === 0) {
			//you crossed the time
			timeLineTitle.innerText = 'Time Off';
			clearInterval(timeLineInterval);
			nextBtn.classList.add('active');
			const correctAnswer = questions[currentQustionIndex].answer;
			for (let i = 0; i < allOptions?.length; i++) {
				allOptions[i].classList.add('disabled');

				if (allOptions[i].innerText === correctAnswer) {
					allOptions[i].classList.add('correct');
					allOptions[i].insertAdjacentHTML('beforeend', TickIcon);
				}
			}
		}
	}, 1000);
};

const handleProgressBar = () => {
	clearInterval(progressBarInterval);
	progressBar.style.width = '0%';
	let currentPercentage = 0;
	progressBarInterval = setInterval(() => {
		currentPercentage += 1 / 15;
		progressBar.style.width = currentPercentage + '%';

		if (currentPercentage >= 100) {
			clearInterval(progressBarInterval);
		}
	}, 10);
};

const optionClickHanlder = (e) => {
	clearInterval(progressBarInterval);
	clearInterval(timeLineInterval);
	nextBtn.classList.add('active');
	const userAnswer = e.target.innerText;
	const correctAnswer = questions[currentQustionIndex].answer;

	if (userAnswer === correctAnswer) {
		userScore++;
		e.target.classList.add('correct');
		e.target.insertAdjacentHTML('beforeend', TickIcon);
	} else {
		e.target.classList.add('incorrect');
		e.target.insertAdjacentHTML('beforeend', CrossIcon);
	}

	for (let i = 0; i < allOptions?.length; i++) {
		allOptions[i].classList.add('disabled');

		if (
			userAnswer !== correctAnswer &&
			allOptions[i].innerText === correctAnswer
		) {
			allOptions[i].classList.add('correct');
			allOptions[i].insertAdjacentHTML('beforeend', TickIcon);
		}
	}
};

const restart = () => {
	clearInterval(progressBarInterval);
	clearInterval(timeLineInterval);
	userScore = 0;
	currentQustionIndex = 0;
	timeLineTitle.innerText = 'Time Left';
};

const handleShowResults = () => {
	scoreText.innerHTML = `
	<span>and nice 😎, You got
					<p>${userScore}</p>
					out of
					<p>${questions?.length}</p></span>`;
};
