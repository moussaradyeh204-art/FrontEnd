import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from '../styles/Manager.module.scss';
import t from '../utils/translations';
import { getItem, setItem, LS, loadProducts } from '../utils/storage';

const MANAGERS = {
  'admin@fashionsync.com': { name: 'ניהול ראשי', pass: 'admin123' },
};

// ── Login ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    const mgr = MANAGERS[email.trim().toLowerCase()];
    if (!mgr || mgr.pass !== pass) { setError(t.manager.loginErr); return; }
    onLogin({ email: email.trim().toLowerCase(), name: mgr.name });
  }

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg)' }}>
      <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border-gold)', borderRadius:20, padding:'3rem 2.5rem', width:440, maxWidth:'94vw', boxShadow:'0 40px 80px rgba(0,0,0,0.55)' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'2.1rem', fontWeight:900, background:'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.22em', marginBottom:'0.15rem' }}>
          {t.brand}
        </div>
        <div style={{ color:'var(--color-gold)', opacity:0.45, fontSize:'0.75rem', letterSpacing:'0.35em', textTransform:'uppercase', marginBottom:'2rem' }}>
          {t.manager.loginRole}
        </div>

        {[[t.manager.emailLabel, 'email', email, setEmail, t.manager.emailPlaceholder],
          [t.manager.passLabel,  'password', pass,  setPass,  t.manager.passPlaceholder]
        ].map(([lbl, type, val, setter, ph]) => (
          <div key={lbl} style={{ marginBottom:'1.1rem' }}>
            <label style={{ display:'block', fontSize:'0.78rem', color:'var(--color-text-dim)', marginBottom:'0.4rem' }}>{lbl}</label>
            <input type={type} value={val} placeholder={ph}
              onChange={e => setter(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid var(--color-border)', borderRadius:10, padding:'0.85rem 1.1rem', color:'var(--color-text)', fontFamily:'var(--font-body)', fontSize:'0.95rem', outline:'none' }} />
          </div>
        ))}

        {error && <div style={{ color:'var(--color-red)', fontSize:'0.82rem', marginBottom:'0.75rem' }}>{error}</div>}
        <button onClick={handleLogin}
          style={{ display:'block', width:'100%', padding:'0.95rem', background:'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', color:'#080808', border:'none', borderRadius:10, fontFamily:'var(--font-body)', fontWeight:700, fontSize:'1rem', cursor:'pointer' }}>
          {t.manager.loginBtn}
        </button>
      </div>
    </div>
  );
}

// ── Overview Panel ────────────────────────────────────────────
function OverviewPanel() {
  const products  = loadProducts();
  const allOrders = Object.values(getItem('fs_orders', {})).flat();
  const revenue   = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const feedback  = getItem(LS.FEEDBACK, []);
  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : '—';

  const stats = [
    { label: t.manager.statProducts, value: products.length,              color: 'blue'   },
    { label: t.manager.statOrders,   value: allOrders.length,             color: 'green'  },
    { label: t.manager.statRevenue,  value: `₪${revenue.toLocaleString()}`, color: 'orange' },
    { label: t.manager.statRating,   value: avgRating,                    color: 'purple' },
  ];

  const lowStock = products.filter(p => (p.stock ?? 10) <= 3);

  return (
    <div>
      <div className={s.statsGrid}>
        {stats.map((st, i) => (
          <div key={i} className={`${s.stat} ${s[st.color]}`}>
            <div className={s.statLabel}>{st.label}</div>
            <div className={s.statValue}>{st.value}</div>
          </div>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardTitle}>{t.manager.lowStockTitle}</div>
        {lowStock.length === 0
          ? <div style={{ color:'var(--color-text-dim)', fontSize:'0.88rem' }}>{t.manager.noLowStock}</div>
          : lowStock.map(p => (
              <div key={p.code} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid var(--color-border)', fontSize:'0.88rem' }}>
                <span style={{ color:'var(--color-text)' }}>{p.name}</span>
                <span style={{ color:(p.stock ?? 10) === 0 ? 'var(--color-red)' : 'var(--color-orange)' }}>
                  {t.manager.stockLabel} {p.stock ?? 0}
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ── Products Panel ────────────────────────────────────────────
function ProductsPanel() {
  const [products,    setProducts]    = useState(loadProducts());
  const [showAdd,     setShowAdd]     = useState(false);
  const [newProduct,  setNewProduct]  = useState({ name:'', code:'', price:'', stock:'', gender:'יוניסקס', img:'' });

  function persist(updated) { setItem(LS.PRODUCTS, updated); setProducts(updated); }

  function addProduct() {
    if (!newProduct.name || !newProduct.code || !newProduct.price) return;
    persist([...products, { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) || 10 }]);
    setNewProduct({ name:'', code:'', price:'', stock:'', gender:'יוניסקס', img:'' });
    setShowAdd(false);
  }

  function deleteProduct(code) {
    if (!window.confirm(t.manager.confirmDelete)) return;
    persist(products.filter(p => p.code !== code));
  }

  function toggleSale(code, sale) {
    persist(products.map(p => p.code === code ? { ...p, sale } : p));
  }

  const fields = [
    ['name', t.manager.fieldName], ['code', t.manager.fieldCode],
    ['price', t.manager.fieldPrice], ['stock', t.manager.fieldStock], ['img', t.manager.fieldImg],
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--color-text)' }}>{t.manager.productsTitle}</h2>
        <button className={s.btnGold} onClick={() => setShowAdd(!showAdd)}>{t.manager.addProductBtn}</button>
      </div>

      {showAdd && (
        <div className={s.addForm}>
          {fields.map(([key, lbl]) => (
            <div key={key} className={s.formField}>
              <label>{lbl}</label>
              <input value={newProduct[key]} onChange={e => setNewProduct({ ...newProduct, [key]: e.target.value })} />
            </div>
          ))}
          <div className={`${s.formField} ${s.formFull}`}>
            <div className={s.formActions}>
              <button className={s.btnSave}   onClick={addProduct}>{t.manager.saveBtn}</button>
              <button className={s.btnCancel} onClick={() => setShowAdd(false)}>{t.manager.cancelBtn}</button>
            </div>
          </div>
        </div>
      )}

      <div className={s.tableWrap}>
        <table>
          <thead>
            <tr>
              {[t.manager.colName, t.manager.colCode, t.manager.colPrice, t.manager.colStock, t.manager.colSale, t.manager.colActions].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.code}>
                <td>{p.name}</td>
                <td style={{ fontFamily:'monospace', fontSize:'0.82rem', color:'var(--color-text-dim)' }}>{p.code}</td>
                <td style={{ color:'var(--color-gold)' }}>₪{p.price}</td>
                <td style={{ color:(p.stock??10)===0?'var(--color-red)':(p.stock??10)<=3?'var(--color-orange)':'var(--color-green)' }}>{p.stock ?? 10}</td>
                <td><input type="checkbox" checked={!!p.sale} onChange={e => toggleSale(p.code, e.target.checked)} /></td>
                <td><button className={s.btnDelete} onClick={() => deleteProduct(p.code)}>{t.manager.deleteBtn}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ManagerPage ───────────────────────────────────────────────
export default function ManagerPage() {
  const navigate = useNavigate();
  const [manager,      setManager]      = useState(null);
  const [activePanel,  setActivePanel]  = useState('overview');
  const [search,       setSearch]       = useState('');

  const navSections = [
    { id:'overview',   icon:'📊', label: t.manager.navOverview  },
    { id:'products',   icon:'👗', label: t.manager.navProducts  },
    { id:'orders',     icon:'🧾', label: t.manager.navOrders    },
    { id:'employees',  icon:'👥', label: t.manager.navEmployees },
    { id:'shifts',     icon:'🕐', label: t.manager.navShifts    },
    { id:'reports',    icon:'📈', label: t.manager.navReports   },
    { id:'feedback',   icon:'⭐', label: t.manager.navFeedback  },
    { id:'settings',   icon:'⚙️', label: t.manager.navSettings  },
  ];

  const currentTitle = navSections.find(n => n.id === activePanel)?.label || '';

  if (!manager) return <LoginScreen onLogin={setManager} />;

  return (
    <div className={s.layout}>
      {/* Sidebar */}
      <aside className={s.sidebar}>
        <div className={s.sbBrand}>
          <div className={s.sbLogo}>{t.brand}</div>
          <div className={s.sbRole}>{t.manager.roleLabel}</div>
        </div>
        <div className={s.sbNav}>
          {navSections.map(item => (
            <button key={item.id}
              className={`${s.navBtn} ${activePanel === item.id ? s.active : ''}`}
              onClick={() => setActivePanel(item.id)}>
              <span className={s.icon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className={s.sbFooter}>
          <button className={s.navBtn} onClick={() => navigate('/')}>🏠 {t.manager.navHome}</button>
          <button className={s.navBtn} style={{ color:'var(--color-red)' }} onClick={() => setManager(null)}>🚪 {t.manager.navLogout}</button>
        </div>
      </aside>

      {/* Main */}
      <div className={s.mainWrap}>
        <div className={s.topbar}>
          <div className={s.topbarTitle}>{currentTitle}</div>
          <div className={s.topbarSearch}>
            <span>🔍</span>
            <input placeholder={t.manager.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={s.tbRight}>
            <span style={{ fontSize:'0.82rem', color:'var(--color-text-dim)' }}>{manager.name}</span>
          </div>
        </div>

        <div className={s.content}>
          {activePanel === 'overview'  && <OverviewPanel />}
          {activePanel === 'products'  && <ProductsPanel />}
          {['orders','employees','shifts','reports','feedback','settings'].includes(activePanel) && (
            <div style={{ color:'var(--color-text-dim)', padding:'2rem' }}>{currentTitle} — {t.manager.comingSoon}</div>
          )}
        </div>
      </div>
    </div>
  );
}
