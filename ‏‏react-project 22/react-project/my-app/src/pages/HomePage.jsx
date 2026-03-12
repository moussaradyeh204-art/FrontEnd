import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.scss';
import ms from '../styles/Modal.module.scss';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import t from '../utils/translations';

// ── Intent Modal ─────────────────────────────────────────────
function IntentModal({ isOpen, onClose, onBrowse, onLogin }) {
  if (!isOpen) return null;
  return (
    <div className={ms.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={ms.card} role="dialog" aria-modal="true">
        <div className={ms.header}>
          <h3>{t.intent.title}</h3>
          <button className={ms.closeBtn} onClick={onClose}>{t.close}</button>
        </div>
        <p className={ms.intro}>{t.intent.intro}</p>

        <button className={ms.choiceBtn} onClick={onLogin}>
          <span className={ms.choiceIcon}>🛍️</span>
          <div>
            <div className={ms.choiceLabel}>{t.intent.loginLabel}</div>
            <div className={ms.choiceSub}>{t.intent.loginSub}</div>
          </div>
        </button>

        <button className={ms.choiceBtn} onClick={onBrowse}>
          <span className={ms.choiceIcon}>👀</span>
          <div>
            <div className={ms.choiceLabel}>{t.intent.browseLabel}</div>
            <div className={ms.choiceSub}>{t.intent.browseSub}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Login Modal ──────────────────────────────────────────────
function LoginModal({ isOpen, onClose, onBack, onSuccess }) {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    setError('');
    const result = loginWithEmail(email, pass);
    if (result.ok) onSuccess();
    else setError(result.error);
  }

  if (!isOpen) return null;
  return (
    <div className={ms.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={ms.card} role="dialog" aria-modal="true">
        <div className={ms.header}>
          <h3>{t.login.title}</h3>
          <button className={ms.closeBtn} onClick={onClose}>{t.close}</button>
        </div>

        <div className={ms.hint}>{t.login.hint}</div>

        <div className={ms.field}>
          <label>{t.login.emailLabel}</label>
          <input type="email" value={email} placeholder={t.login.emailPlaceholder}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <div className={ms.field}>
          <label>{t.login.passLabel}</label>
          <input type="password" value={pass} placeholder={t.login.passPlaceholder}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <div className={ms.error}>{error}</div>}

        <div className={ms.actions}>
          <button className={ms.btnPrimary} onClick={handleLogin}>{t.login.submitBtn}</button>
          <button className={ms.btnGhost}   onClick={onClose}>{t.login.cancelBtn}</button>
        </div>

        <div className={ms.backLink} onClick={onBack}>{t.login.backLink}</div>
      </div>
    </div>
  );
}

// ── HomePage ─────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();
  const [intentOpen, setIntentOpen] = useState(false);
  const [loginOpen,  setLoginOpen]  = useState(false);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { setIntentOpen(false); setLoginOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function handleBrowse()       { loginAsGuest(); navigate('/customer'); }
  function handleLoginSuccess() { navigate('/customer'); }
  function openLogin()          { setIntentOpen(false); setLoginOpen(true); }
  function backToIntent()       { setLoginOpen(false);  setIntentOpen(true); }

  return (
    <div>
      <div className={styles.bgImage} />
      <div className={styles.grain} />

      {['👗', '👔', '👠', '💍'].map((emoji, i) => (
        <div key={i} className={styles.floatItem}
          style={{ top: `${15 + i * 20}%`, left: `${5 + i * 22}%`, animationDelay: `${i * 5}s` }}>
          {emoji}
        </div>
      ))}

      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <span className={styles.navBrand}>{t.brand}</span>
          <span className={styles.navTagline}>{t.tagline}</span>
        </div>
        <div className={styles.navInternal}>
          <a href="/employee">{t.home.employeeLink}</a>
          <a href="/manager">{t.home.managerLink}</a>
        </div>
        <ThemeToggle className={styles.themeToggle} />
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroEyebrow}>{t.home.eyebrow}</div>
        <h1 className={styles.heroTitle}>
          {t.home.title1}<span>{t.home.title2}</span>
        </h1>
        <p className={styles.heroSub}>{t.home.subtitle}</p>

        <div className={styles.roleCards}>
          <div
            className={styles.roleCard}
            onClick={() => setIntentOpen(true)}
            tabIndex={0} role="button"
            onKeyDown={e => e.key === 'Enter' && setIntentOpen(true)}
          >
            <div className={styles.cardIcon}>🛍️</div>
            <div className={styles.cardTitle}>{t.home.customerCardTitle}</div>
            <div className={styles.cardDesc}>{t.home.customerCardDesc}</div>
            <div className={styles.cardArrow}>↓</div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>{t.home.footerCopyright}</span>
        <a href="/employee">{t.home.footerEmployee}</a>
        <a href="/manager">{t.home.footerManager}</a>
      </footer>

      <IntentModal isOpen={intentOpen} onClose={() => setIntentOpen(false)} onBrowse={handleBrowse} onLogin={openLogin} />
      <LoginModal  isOpen={loginOpen}  onClose={() => setLoginOpen(false)}  onBack={backToIntent}   onSuccess={handleLoginSuccess} />
    </div>
  );
}
