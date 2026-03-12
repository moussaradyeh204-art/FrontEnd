import { useTheme } from '../../context/ThemeContext';
import t from '../../utils/translations';

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button className={className} onClick={toggleTheme} aria-label={isLight ? t.themeDark : t.themeLight}>
      <span>{isLight ? '☀️' : '🌙'}</span>
      <span>{isLight ? t.themeLight : t.themeDark}</span>
    </button>
  );
}
