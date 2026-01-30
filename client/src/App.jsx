import { Route, Routes } from 'react-router';
import { HomePage } from './pages/home/HomePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='cfu-boyfriend-quiz' element={<div>Test Quiz Page</div>} />
      <Route path='about-me' element={<div>Test About Me Page</div>} />

      <Route path='rules' element={<div>Test Rules Page</div>} />
      <Route path='privacy-policy' element={<div>Test Privacy Policy Page</div>} />
      <Route path='user-agreement' element={<div>Test User Agreement Page</div>} />
      <Route path='accessibility' element={<div>Test Accessibility Page</div>} />
      
      <Route path='*' element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App
