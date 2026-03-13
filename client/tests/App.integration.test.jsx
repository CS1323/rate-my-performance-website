import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';

import App from '../src/App';

vi.mock('../src/pages/home/HomePage', () => ({
  HomePage: () => <div>Home Page</div>,
}));
vi.mock('../src/pages/about-me/AboutMe', () => ({
  AboutMe: () => <div>About Me Page</div>,
}));
vi.mock('../src/pages/quiz/CFUBoyfriendQuiz', () => ({
  CFUBoyfriendQuiz: () => <div>Quiz Page</div>,
}));
vi.mock('../src/pages/rules/Rules', () => ({
  Rules: () => <div>Rules Page</div>,
}));
vi.mock('../src/pages/privacy-policy/PrivacyPolicyPage', () => ({
  PrivacyPolicy: () => <div>Privacy Policy Page</div>,
}));
vi.mock('../src/pages/user-agreement/UserAgreement', () => ({
  UserAgreement: () => <div>User Agreement Page</div>,
}));
vi.mock('../src/pages/accessibility/Accessibility', () => ({
  Accessibility: () => <div>Accessibility Page</div>,
}));

describe('App routing integration', () => {
  test('renders home page on index route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Home Page')).toBeInTheDocument();
  });

  test('renders not found route for unknown path', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Not Found')).toBeInTheDocument();
  });
});
