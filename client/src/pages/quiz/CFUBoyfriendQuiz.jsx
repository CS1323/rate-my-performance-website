import { useState, useEffect } from 'react';
import { Header } from "../../components/Header";
import { NavSidebar } from "../../components/NavSidebar";
import { AdsSidebar } from "../../components/AdsSidebar";
import { quizData2 as quizData } from "../../data/quizData";
import './CFUBoyfriendQuiz.css';

export function CFUBoyfriendQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Shuffle answers when question changes
  useEffect(() => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const shuffled = [...currentQuestion.answers];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setShuffledAnswers(shuffled);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (selectedAnswer) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: selectedAnswer.character
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

    // Calculate scores based on character votes
    quizData.questions.forEach((question, questionIndex) => {
      const selectedCharacter = finalAnswers[questionIndex];
      if (selectedCharacter !== undefined) {
        scores[selectedCharacter]++;
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
                  <div className="progress-bar" role="progressbar" aria-valuenow={currentQuestionIndex + 1} aria-valuemin="1" aria-valuemax={quizData.questions.length} aria-label={`Quiz progress: question ${currentQuestionIndex + 1} of ${quizData.questions.length}`}>
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
                    {shuffledAnswers.map((answer, index) => (
                      <button
                        key={index}
                        className="answer-button"
                        onClick={() => handleAnswerSelect(answer)}
                        aria-label={`Answer option: ${answer.text}`}
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
              <div className="quiz-result" role="status" aria-live="polite" aria-atomic="true">
                <div className="result-card">
                  <h1>Your CFU Boyfriend is...</h1>
                  <div className="boyfriend-result">
                    <div className="boyfriend-emoji" aria-hidden="true">{result.emoji}</div>
                    <h2 className="boyfriend-name">{result.name}</h2>
                    <p className="boyfriend-position">{result.position} • #{result.number}</p>
                    <p className="boyfriend-description">{result.description}</p>
                    
                    <div className="boyfriend-traits">
                      <div className="traits-list">
                        {result.traits.map((trait, index) => (
                          <span key={index} className="trait-badge">{trait}</span>
                        ))}
                      </div>
                    </div>
                    
                    {result.bookQuote && (
                      <div className="book-quote">
                        <p className="quote-text">"{result.bookQuote}"</p>
                        <p className="quote-attribution">
                          — {result.name}
                          {result.book && <>, <em>{result.book}</em></>}
                        </p>
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