import { createContext, useContext, useState } from 'react';
import { LS, getItem, setItem, removeItem, isEmail } from '../utils/storage';
import t from '../utils/translations';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getItem(LS.CURRENT_USER, null));
  const [mode, setMode] = useState(() => getItem(LS.MODE, 'guest'));

  const isLoggedIn = !!(currentUser && currentUser.email);
  const isGuest    = mode === 'guest';

  function loginWithEmail(email, password) {
    const trimEmail = (email || '').trim().toLowerCase();
    const trimPass  = (password || '').trim();

    if (!trimEmail)       return { ok: false, error: t.login.errNoEmail };
    if (!isEmail(trimEmail)) return { ok: false, error: t.login.errBadEmail };
    if (!trimPass)        return { ok: false, error: t.login.errNoPass };

    let users = getItem(LS.USERS, {});
    if (!users[trimEmail]) {
      users[trimEmail] = { name: trimEmail.split('@')[0], pass: trimPass };
      setItem(LS.USERS, users);
    }

    const user = { email: trimEmail, name: users[trimEmail].name };
    setItem(LS.CURRENT_USER, user);
    setItem(LS.MODE, 'auth');
    setCurrentUser(user);
    setMode('auth');
    return { ok: true };
  }

  function loginAsGuest() {
    removeItem(LS.CURRENT_USER);
    setItem(LS.MODE, 'guest');
    setCurrentUser(null);
    setMode('guest');
  }

  function logout() {
    removeItem(LS.CURRENT_USER);
    removeItem(LS.MODE);
    setCurrentUser(null);
    setMode('guest');
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, isGuest, loginWithEmail, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
