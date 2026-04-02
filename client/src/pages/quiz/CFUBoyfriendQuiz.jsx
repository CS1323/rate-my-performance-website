import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Shuffle answers when question changes
  useEffect(() => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const answersWithIndex = currentQuestion.answers.map((a, i) => ({ ...a, originalIndex: i }));
    
    // Fisher-Yates shuffle
    for (let i = answersWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answersWithIndex[i], answersWithIndex[j]] = [answersWithIndex[j], answersWithIndex[i]];
    }
    
    setShuffledAnswers(answersWithIndex);
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

  const qNum = currentQuestionIndex + 1;

  return (
    <>
      <title>{t('quiz.pageTitle')}</title>

      <Header onToggleSidebar={handleToggleSidebar} />
      
      <div 
        className="layout"
        style={{ '--sidebar-open': sidebarOpen ? 'flex' : 'none' }}
      >
        <NavSidebar onLinkClick={() => setSidebarOpen(false)} />
        
        <main className="content">
          <div className="quiz-container">
            {!quizCompleted ? (
              <div className="quiz-active">
                <div className="quiz-header">
                  <h1>{t('quiz.heading')}</h1>
                  <p className="quiz-subtitle">{t('quiz.subtitle')}</p>
                  <div className="progress-bar" role="progressbar" aria-valuenow={qNum} aria-valuemin="1" aria-valuemax={quizData.questions.length} aria-label={t('quiz.progressLabel', { current: qNum, total: quizData.questions.length })}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(qNum / quizData.questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {t('quiz.progressText', { current: qNum, total: quizData.questions.length })}
                  </p>
                </div>

                <div className="question-card">
                  <h2 className="question-title">{t(`quizData.questions.q${qNum}.text`)}</h2>
                  <div className="answers-list">
                    {shuffledAnswers.map((answer, index) => {
                      const answerText = t(`quizData.questions.q${qNum}.answers.a${answer.originalIndex + 1}`);
                      return (
                        <button
                          key={index}
                          className="answer-button"
                          onClick={() => handleAnswerSelect(answer)}
                          aria-label={t('quiz.answerLabel', { text: answerText })}
                        >
                          {answerText}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="quiz-navigation">
                  {currentQuestionIndex > 0 && (
                    <button className="nav-button back-button" onClick={goBack}>
                      {t('quiz.back')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="quiz-result" role="status" aria-live="polite" aria-atomic="true">
                <div className="result-card">
                  <h1>{t('quiz.resultHeading')}</h1>
                  <div className="boyfriend-result">
                    <div className="boyfriend-emoji" aria-hidden="true">{result.emoji}</div>
                    <h2 className="boyfriend-name">{t(`quizData.boyfriends.${result.id}.name`)}</h2>
                    <p className="boyfriend-position">{t('quiz.resultPosition', { position: t(`quizData.boyfriends.${result.id}.position`), number: t(`quizData.boyfriends.${result.id}.number`) })}</p>
                    <p className="boyfriend-description">{t(`quizData.boyfriends.${result.id}.description`)}</p>
                    
                    <div className="boyfriend-traits">
                      <div className="traits-list">
                        {t(`quizData.boyfriends.${result.id}.traits`, { returnObjects: true }).map((trait, index) => (
                          <span key={index} className="trait-badge">{trait}</span>
                        ))}
                      </div>
                    </div>
                    
                    {t(`quizData.boyfriends.${result.id}.quote`) && (
                      <div className="book-quote">
                        <p className="quote-text">"{t(`quizData.boyfriends.${result.id}.quote`)}"</p>
                        <p className="quote-attribution">
                          — {t(`quizData.boyfriends.${result.id}.name`)}
                          {t(`quizData.boyfriends.${result.id}.book`) && <>, <em>{t(`quizData.boyfriends.${result.id}.book`)}</em></>}
                        </p>
                      </div>
                    )}
                  </div>
                  <button className="restart-button" onClick={restartQuiz}>
                    {t('quiz.takeAgain')}
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