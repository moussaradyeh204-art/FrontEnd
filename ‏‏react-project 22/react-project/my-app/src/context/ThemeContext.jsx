import { createContext, useContext, useEffect, useState } from 'react';
import { LS } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(LS.THEME);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem(LS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
