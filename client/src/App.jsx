import { Route, Routes } from 'react-router';
import { HomePage } from './pages/home/HomePage'
import { CFUBoyfriendQuiz } from './pages/quiz/CFUBoyfriendQuiz'
import { AboutMe } from './pages/about-me/AboutMe'
import { Rules } from './pages/rules/Rules'
import { PrivacyPolicy } from './pages/privacy-policy/PrivacyPolicyClean'
import { UserAgreement } from './pages/user-agreement/UserAgreement'
import { Accessibility } from './pages/accessibility/Accessibility'
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='cfu-boyfriend-quiz' element={<CFUBoyfriendQuiz />} />
      <Route path='about-me' element={<AboutMe />} />

      <Route path='rules' element={<Rules />} />
      <Route path='privacy-policy' element={<PrivacyPolicy />} />
      <Route path='user-agreement' element={<UserAgreement />} />
      <Route path='accessibility' element={<Accessibility />} />
      
      <Route path='*' element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App