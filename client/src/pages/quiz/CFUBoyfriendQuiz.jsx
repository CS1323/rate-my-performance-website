import { useState } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { quizData } from "../../data/quizData";
import './CFUBoyfriendQuiz.css';

export function CFUBoyfriendQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: answerIndex
    };
    setAnswers(newAnswers);

    // Move to next question or calculate results
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const scores = {};
    
    // Initialize scores for all boyfriends
    quizData.boyfriends.forEach(boyfriend => {
      scores[boyfriend.id] = 0;
    });

    // Calculate scores based on answers
    quizData.questions.forEach((question, questionIndex) => {
      const answerIndex = finalAnswers[questionIndex];
      if (answerIndex !== undefined) {
        const selectedAnswer = question.answers[answerIndex];
        selectedAnswer.traits.forEach(trait => {
          quizData.boyfriends.forEach(boyfriend => {
            if (boyfriend.traits.includes(trait)) {
              scores[boyfriend.id]++;
            }
          });
        });
      }
    });

    // Find the boyfriend with the highest score
    const winningBoyfriendId = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    const winningBoyfriend = quizData.boyfriends.find(b => b.id === winningBoyfriendId);
    
    setResult(winningBoyfriend);
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setResult(null);
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <>
      <title>CFU Boyfriend Quiz - RMP</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar />
        
        <main className="content">
          <div className="quiz-container">
            {!quizCompleted ? (
              <div className="quiz-active">
                <div className="quiz-header">
                  <h1>CFU Boyfriend Quiz</h1>
                  <p className="quiz-subtitle">Discover which CFU hockey player is your perfect match!</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    Question {currentQuestionIndex + 1} of {quizData.questions.length}
                  </p>
                </div>

                <div className="question-card">
                  <h2 className="question-title">{currentQuestion.question}</h2>
                  <div className="answers-list">
                    {currentQuestion.answers.map((answer, index) => (
                      <button
                        key={index}
                        className="answer-button"
                        onClick={() => handleAnswerSelect(index)}
                      >
                        {answer.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quiz-navigation">
                  {currentQuestionIndex > 0 && (
                    <button className="nav-button back-button" onClick={goBack}>
                      ← Back
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="quiz-result">
                <div className="result-card">
                  <h1>Your CFU Boyfriend is...</h1>
                  <div className="boyfriend-result">
                    <h2 className="boyfriend-name">{result.name}</h2>
                    <p className="boyfriend-position">{result.position} • #{result.number}</p>
                    <p className="boyfriend-description">{result.description}</p>
                    <div className="boyfriend-traits">
                      <h3>Why you're perfect together:</h3>
                      <ul>
                        {result.compatibility.map((trait, index) => (
                          <li key={index}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                    {result.bookQuote && (
                      <div className="book-quote">
                        <p className="quote-text">"{result.bookQuote}"</p>
                      </div>
                    )}
                  </div>
                  <button className="restart-button" onClick={restartQuiz}>
                    Take Quiz Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <AdsSidebar />
      </div>
    </>
  );
}