import styles from '../../styles/Sidebar.module.scss';

/**
 * Reusable sidebar for all portals.
 * Props:
 *  brand        – brand name string
 *  roleLabel    – role subtitle string
 *  navItems     – [{ id, icon, label, badge?, badgeColor?, locked? }]
 *  activePanel  – currently active panel id
 *  onNavClick   – (id) => void
 *  header       – ReactNode (user info bar, etc.)
 *  footer       – ReactNode (logout, home links)
 */
export default function AppSidebar({ brand, roleLabel, navItems = [], activePanel, onNavClick, header, footer }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.roleLabel}>{roleLabel}</div>

      {header}

      <nav>
        {navItems.map(item => (
          <button
            key={item.id}
            className={[
              styles.navItem,
              activePanel === item.id ? styles.active : '',
              item.locked ? styles.locked : '',
            ].join(' ')}
            onClick={() => !item.locked && onNavClick(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge != null && (
              <span className={`${styles.navBadge} ${item.badgeColor === 'purple' ? styles.purple : ''}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
