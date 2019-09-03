import Question from "./Questions.js";
import Quiz from "./Quiz.js";

const q1 = new Question(
    "what's 2 +2" , [2,3,4,5], 
    2
);
const q2 = new Question(
    "First president of US?",
    ["AL", "George", "Barrack", "Johnny"],
    1
);
const q3 = new Question();


const qArray = [q1, q2];

const myQuiz = new Quiz(qArray);

// console.log(myQuiz.getCurrentQuestion())

// //button
// myQuiz.nextIndex(); 
// console.log(myQuiz.getCurrentQuestion())
// myQuiz.nextIndex(); 
// console.log(myQuiz.getCurrentQuestion())

// const App = (function () {
//     let counter = 0;

//     const doubleCounter = () => {
//         counter *=2; 
//     }

//     const incrementCounter = () => {
//         counter +=1;
//     }

//     const getCounter = () => {
//         return counter; 
//     }
//     const setCounter = (newNum) => {
//         counter = newNum; 
//     }

//     // public methohds " revealing module pattern"
//     return {
//         get: getCounter,
//         set: setCounter
//     }
// }) ();

// console.log(App.get());
// App.set(2); 
// console.log(App.get());

const App = (() =>{
    //cache the dom
    const quizEl = document.querySelector(".jabquiz");
    const quizQuestionEl = document.querySelector(".jabquiz_question");
    const trackerEl = document.querySelector(".jabquiz_tracker");
    const taglineEl = document.querySelector(".jabquiz_tagline");
    const choicesEl = document.querySelector(".jabquiz_choices");
    const progressInnerEl = document.querySelector(".progress_inner");
    const nextButtonEl = document.querySelector(".next");
    // console.log(nextButtonEl)
    const restartButtonEl = document.querySelector(".restart");
    // console.log(restartButtonEl)

    const q1 = new Question (
        "First President of US?",
        ["Barrack", "Osama", "George", "Monkey"],
        2
    )
    const q2 = new Question (
        "When was Javascript created?",
        ["June 1995", "May 1995", "July 1885", "Sep 1996"],
        1
    )
    const q3 = new Question (
        "What does CSS stand for?",
        ["County Sheriff Service", "Cascading sexy sheets", "Cascading style sheets","something"],
        2
    )
    const q4 = new Question (
        " The full form of HTML is...?",
        ["Hyper Text Markup Language", "asdf", "err", "hello"],
        0
    )
    const q5 = new Question (
        "console.log(tyof []) would return what?",
        ["Array", "Null", "Object", "nan"],
        2
    )

    const quiz = new Quiz([q1,q2,q3,q4,q5]);
    
    const listeners = _ => {
        nextButtonEl.addEventListener("click", function () {
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked')
            if(selectedRadioElem) {
                const key = Number (selectedRadioElem.getAttribute("data-order"));
                quiz.guess(key);
                renderAll();
            }
        })

        restartButtonEl.addEventListener("click", function () {
            //0. reset tagline
            setValue(taglineEl, `Pick an option below!`)
            //1. reset the quiz
            quiz.reset();
            //2. renderAll
            renderAll();
            //3. restore the next button
            nextButtonEl.style.opacity = 1;

        })
    }

    const setValue = (elem, value) => {
        elem.innerHTML = value; 
    }


    const renderQuestion = _ => {
        const question = quiz.getCurrentQuestion ().question;
        setValue(quizQuestionEl, question)
    }

    const renderChoicesElements = _ => {
        let markup = "";
        const currentChoices = quiz.getCurrentQuestion().choices; 
        currentChoices.forEach((elem, index) => {
        markup += `
            <li class="jabquiz_choice">
                <input type="radio" name="choice" class="jabquiz_input" data-order="${index} "id="choice${index}" >
                <label for="choice${index}" class="jabquiz_label">
                    <i></i>
                    <span>${elem}</span> 
                </label>
            </li>
            `
        });


        setValue(choicesEl, markup);
    }

    const renderTracker = _ => {
        const index = quiz.currentIndex; 
        setValue (trackerEl, `${index+1} of ${quiz.questions.length}`)
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1/num2) * 100);
    }
    
    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if(width > maxPercent){
                clearInterval(loadingBar);
            } else {
                width ++;
                progressInnerEl.style.width = `${width}%`;
            }
        }, 3)
    }
   

    const renderProgress = _ => {
        // 1. width
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
        // 2. launc(0, width)
        launch(0, currentWidth); 
    }
    
    const renderEndScreen = _ => {
        setValue(quizQuestionEl,`Great Job!`);
        setValue(taglineEl, `Complete!`);
        setValue(trackerEl,`Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
        
    }

    const renderAll = _ => {
        if(quiz.hasEnded ()) {
            // renderEndScreen
            renderEndScreen();
        } else {
            //1. Render the question
            renderQuestion();
            //2. Render the choices Elements
            renderChoicesElements();
            //3. Render  Tracker
            renderTracker(); 
            //4. Render Progress 
            renderProgress();
        }
    }

    return {
        renderAll: renderAll,
        listeners: listeners
    }
})();

App.renderAll(); 
App.listeners();