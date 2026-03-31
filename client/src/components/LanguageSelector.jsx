import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router';
import { supportedLanguages } from '../i18n';
import './LanguageSelector.css';

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();

  const currentLang = lang || 'en';

  const handleLanguageChange = (newLang) => {
    if (newLang === currentLang) return;

    // Strip current lang prefix from path
    let path = location.pathname;
    if (lang) {
      path = path.replace(`/${lang}`, '') || '/';
    }

    // Add new lang prefix (omit for English)
    const newPath = newLang === 'en' ? path : `/${newLang}${path === '/' ? '' : path}`;
    navigate(newPath);
  };

  return (
    <nav className="language-selector" role="navigation" aria-label={t('language.selectLanguage')}>
      {supportedLanguages.map((code, index) => (
        <span key={code}>
          {index > 0 && <span className="language-separator" aria-hidden="true">|</span>}
          <button
            className={`language-btn${code === currentLang ? ' active' : ''}`}
            onClick={() => handleLanguageChange(code)}
            aria-current={code === currentLang ? 'true' : undefined}
            lang={code}
          >
            {t(`language.${code}`)}
          </button>
        </span>
      ))}
    </nav>
  );
}
