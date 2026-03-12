import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from '../styles/Employee.module.scss';
import AppSidebar from '../components/layout/AppSidebar';
import t from '../utils/translations';
import { getItem, setItem, LS, loadProducts } from '../utils/storage';

const EMPLOYEES = {
  'emp@fashionsync.com':  { name: 'שירה לוי', pass: '1234' },
  'emp2@fashionsync.com': { name: 'דן כהן',   pass: '1234' },
};

// ── Login ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    const emp = EMPLOYEES[email.trim().toLowerCase()];
    if (!emp || emp.pass !== pass) { setError(t.employee.loginErr); return; }
    onLogin({ email: email.trim().toLowerCase(), name: emp.name });
  }

  return (
    <div className={s.loginScreen}>
      <div className={s.loginBox}>
        <div className={s.loginBrand}>{t.brand}</div>
        <div className={s.loginRole}>{t.employee.loginRole}</div>

        <div className={s.field}>
          <label>{t.employee.emailLabel}</label>
          <input type="email" value={email} placeholder={t.employee.emailPlaceholder}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className={s.field}>
          <label>{t.employee.passLabel}</label>
          <input type="password" value={pass} placeholder={t.employee.passPlaceholder}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <div className={s.loginErr}>{error}</div>}
        <button className={s.loginBtn} onClick={handleLogin}>{t.employee.loginBtn}</button>
      </div>
    </div>
  );
}

// ── Dashboard Panel ──────────────────────────────────────────
function DashboardPanel({ employee, shiftActive, clockIn, clockOut }) {
  const products = loadProducts();
  const allOrders = Object.values(getItem('fs_orders', {})).flat();

  const stats = [
    { label: t.employee.statProducts,    value: products.length,                             color: 'blue' },
    { label: t.employee.statOrders,      value: allOrders.length,                            color: 'green' },
    { label: t.employee.statOutOfStock,  value: products.filter(p => (p.stock ?? 10) === 0).length, color: 'red' },
    { label: t.employee.statOnSale,      value: products.filter(p => p.sale).length,         color: 'orange' },
  ];

  return (
    <div>
      <div className={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} className={`${s.statCard} ${s[stat.color]}`}>
            <div className={s.statLabel}>{stat.label}</div>
            <div className={s.statValue}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={s.empChip}>
        <span>👤</span>
        <span className={s.empName}>{employee.name}</span>
        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>{employee.email}</span>
      </div>

      <div className={`${s.shiftChip} ${shiftActive ? s.active : ''}`}>
        <span className={s.shiftDot} />
        {shiftActive ? t.employee.shiftActive : t.employee.shiftInactive}
      </div>

      <div className={s.clockBtns}>
        <button className={`${s.clockBtn} ${s.in}`}  disabled={shiftActive}  onClick={clockIn}>{t.employee.clockIn}</button>
        <button className={`${s.clockBtn} ${s.out}`} disabled={!shiftActive} onClick={clockOut}>{t.employee.clockOut}</button>
      </div>
    </div>
  );
}

// ── Inventory Panel ──────────────────────────────────────────
function InventoryPanel() {
  const [products, setProducts] = useState(loadProducts());
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    !search || p.name?.includes(search) || p.code?.includes(search)
  );

  function updateStock(code, delta) {
    const updated = products.map(p =>
      p.code === code ? { ...p, stock: Math.max(0, (p.stock ?? 10) + delta) } : p
    );
    setItem(LS.PRODUCTS, updated);
    setProducts(updated);
  }

  return (
    <div>
      <input
        className=""
        style={{ background:'var(--color-surface2)', border:'1px solid var(--color-border)', borderRadius:9, padding:'0.7rem 1rem', color:'var(--color-text)', fontFamily:'var(--font-body)', marginBottom:'1.2rem', width:'100%', outline:'none' }}
        placeholder={t.employee.inventorySearch}
        value={search} onChange={e => setSearch(e.target.value)}
      />
      <div className={s.tableWrap}>
        <table>
          <thead>
            <tr>
              {[t.employee.colName, t.employee.colCode, t.employee.colPrice, t.employee.colStock, t.employee.colActions].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.code}>
                <td>{p.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>{p.code}</td>
                <td style={{ color: 'var(--color-gold)' }}>₪{p.price}</td>
                <td style={{ color: (p.stock ?? 10) === 0 ? 'var(--color-red)' : (p.stock ?? 10) <= 3 ? 'var(--color-orange)' : 'var(--color-green)' }}>{p.stock ?? 10}</td>
                <td>
                  <button className={s.btnPlus}  onClick={() => updateStock(p.code, +1)}>+</button>
                  <button className={s.btnMinus} onClick={() => updateStock(p.code, -1)}>−</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── EmployeePage ─────────────────────────────────────────────
export default function EmployeePage() {
  const navigate = useNavigate();
  const [employee,     setEmployee]     = useState(null);
  const [activePanel,  setActivePanel]  = useState('dashboard');
  const [shiftActive,  setShiftActive]  = useState(false);

  const navItems = [
    { id: 'dashboard', icon: '📊', label: t.employee.navDashboard },
    { id: 'inventory', icon: '📦', label: t.employee.navInventory },
    { id: 'orders',    icon: '🧾', label: t.employee.navOrders    },
    { id: 'barcode',   icon: '📷', label: t.employee.navBarcode   },
    { id: 'shifts',    icon: '🕐', label: t.employee.navShifts    },
  ];

  function clockIn() {
    const shifts = getItem(LS.EMP_SHIFTS, []);
    shifts.push({ employee: employee.email, type: 'in', time: new Date().toISOString() });
    setItem(LS.EMP_SHIFTS, shifts);
    setShiftActive(true);
  }
  function clockOut() {
    const shifts = getItem(LS.EMP_SHIFTS, []);
    shifts.push({ employee: employee.email, type: 'out', time: new Date().toISOString() });
    setItem(LS.EMP_SHIFTS, shifts);
    setShiftActive(false);
  }

  if (!employee) return <LoginScreen onLogin={setEmployee} />;

  const footerBtnStyle = { display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.68rem 0.85rem', borderRadius:10, cursor:'pointer', background:'none', border:'none', width:'100%', fontFamily:'var(--font-body)', textAlign:'right' };

  return (
    <div className={s.layout}>
      <AppSidebar
        brand={t.brand}
        roleLabel={t.employee.roleLabel}
        navItems={navItems}
        activePanel={activePanel}
        onNavClick={setActivePanel}
        footer={
          <>
            <button style={{ ...footerBtnStyle, color: 'var(--color-text-dim)' }} onClick={() => navigate('/')}>🏠 {t.employee.navHome}</button>
            <button style={{ ...footerBtnStyle, color: 'var(--color-red)'      }} onClick={() => setEmployee(null)}>🚪 {t.employee.navLogout}</button>
          </>
        }
      />
      <main style={{ marginRight: 'var(--sidebar-width)', flex: 1, padding: '2.5rem' }}>
        {activePanel === 'dashboard' && <DashboardPanel employee={employee} shiftActive={shiftActive} clockIn={clockIn} clockOut={clockOut} />}
        {activePanel === 'inventory' && <InventoryPanel />}
        {activePanel === 'orders'    && <div style={{ color: 'var(--color-text-dim)' }}>{t.employee.navOrders}  — {t.employee.comingSoon}</div>}
        {activePanel === 'barcode'   && <div style={{ color: 'var(--color-text-dim)' }}>{t.employee.navBarcode} — {t.employee.comingSoon}</div>}
        {activePanel === 'shifts'    && <div style={{ color: 'var(--color-text-dim)' }}>{t.employee.navShifts}  — {t.employee.comingSoon}</div>}
      </main>
    </div>
  );
}
