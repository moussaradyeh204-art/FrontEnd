import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import s from '../styles/Customer.module.scss';
import AppSidebar from '../components/layout/AppSidebar';
import { useAuth } from '../context/AuthContext';
import t from '../utils/translations';
import {
  loadProducts, loadCart, saveCart,
  loadWishlist, saveWishlist, loadOrders,
} from '../utils/storage';

// ── Product Card ─────────────────────────────────────────────
function ProductCard({ product, isLoggedIn, isWishlisted, onWishToggle, onAddToCart }) {
  const stock = product.stock ?? 10;
  const badge =
    stock === 0 ? { cls: 'red',    label: t.customer.outOfStock } :
    stock <= 3  ? { cls: 'yellow', label: `${t.customer.lowStock} ${stock}` } :
                  { cls: 'green',  label: t.customer.inStock };

  return (
    <div className={s.card}>
      <div className={s.imgWrap}>
        {product.img && <img src={product.img} alt={product.name} loading="lazy" />}
        {product.sale && <div className={s.saleTag}>SALE</div>}
        <button
          className={`${s.wishBtn} ${isWishlisted ? s.active : ''}`}
          onClick={() => onWishToggle(product.code)}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={s.body}>
        <div className={s.name}>{product.name}</div>
        <div className={s.code}>{product.code}</div>
        <div className={s.price}>₪{product.price}</div>
        <span className={`${s.badge} ${s[badge.cls]}`}>{badge.label}</span>
        <div className={s.actions}>
          {isLoggedIn && stock > 0 && (
            <button className={s.actBtn} onClick={() => onAddToCart(product.code)}>
              {t.customer.addToCart}
            </button>
          )}
          <button className={s.actBtn}>{t.customer.details}</button>
        </div>
      </div>
    </div>
  );
}

// ── Browse Panel ─────────────────────────────────────────────
function BrowsePanel({ products, isLoggedIn, wishlist, onWishToggle, onAddToCart }) {
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filtered = products
    .filter(p => !search || p.name?.includes(search) || p.code?.includes(search))
    .filter(p => !gender || p.gender === gender)
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name')       return (a.name || '').localeCompare(b.name || '', 'he');
      return 0;
    });

  return (
    <div>
      <div className={s.pageTitle}>{t.customer.browseTitle}</div>
      <div className={s.pageSub}>{filtered.length} {t.customer.browseTitle}</div>

      <div className={s.filterBar}>
        <input className={s.filterInput} placeholder={t.customer.searchPlaceholder}
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className={s.filterSelect} value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">{t.customer.filterAll}</option>
          <option value="נשים">{t.customer.filterWomen}</option>
          <option value="גברים">{t.customer.filterMen}</option>
          <option value="יוניסקס">{t.customer.filterUnisex}</option>
        </select>
        <select className={s.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">{t.customer.sortDefault}</option>
          <option value="price-asc">{t.customer.sortPriceAsc}</option>
          <option value="price-desc">{t.customer.sortPriceDesc}</option>
          <option value="name">{t.customer.sortName}</option>
        </select>
      </div>

      {filtered.length === 0
        ? <div className={s.empty}>{t.customer.noProducts}</div>
        : <div className={s.grid}>
            {filtered.map(p => (
              <ProductCard key={p.code} product={p} isLoggedIn={isLoggedIn}
                isWishlisted={wishlist.includes(p.code)}
                onWishToggle={onWishToggle} onAddToCart={onAddToCart} />
            ))}
          </div>
      }
    </div>
  );
}

// ── Cart Panel ───────────────────────────────────────────────
function CartPanel({ cart, products, onRemove, onCheckout }) {
  const items = cart
    .map(item => ({ ...item, product: products.find(p => p.code === item.code) }))
    .filter(i => i.product);
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  if (items.length === 0) return <div className={s.empty}>{t.customer.cartEmpty}</div>;

  return (
    <div>
      <div className={s.pageTitle}>{t.customer.cartTitle}</div>
      {items.map(item => (
        <div key={item.code} className={s.cartItem}>
          {item.product.img && <img className={s.cartImg} src={item.product.img} alt={item.product.name} />}
          <div style={{ flex: 1 }}>
            <div className={s.cartName}>{item.product.name}</div>
            <div className={s.cartQty}>x{item.qty}</div>
          </div>
          <div className={s.cartPrice}>₪{item.product.price * item.qty}</div>
          <button className={s.deleteBtn} onClick={() => onRemove(item.code)}>🗑️</button>
        </div>
      ))}
      <div className={s.cartTotal}>
        <span>{t.customer.cartTotal}</span>
        <span>₪{total}</span>
      </div>
      <button className={s.checkoutBtn} onClick={onCheckout}>{t.customer.checkoutBtn}</button>
    </div>
  );
}

// ── Wishlist Panel ───────────────────────────────────────────
function WishlistPanel({ wishlist, products, onRemove, onAddToCart }) {
  const items = wishlist.map(code => products.find(p => p.code === code)).filter(Boolean);
  if (items.length === 0) return <div className={s.empty}>{t.customer.wishlistEmpty}</div>;

  return (
    <div>
      <div className={s.pageTitle}>{t.customer.wishlistTitle}</div>
      <div className={s.grid}>
        {items.map(p => (
          <div key={p.code} className={s.card}>
            <div className={s.imgWrap}>{p.img && <img src={p.img} alt={p.name} />}</div>
            <div className={s.body}>
              <div className={s.name}>{p.name}</div>
              <div className={s.price}>₪{p.price}</div>
              <div className={s.actions}>
                <button className={s.actBtn} onClick={() => onAddToCart(p.code)}>{t.customer.addToCart}</button>
                <button className={s.actBtn} onClick={() => onRemove(p.code)}>{t.customer.removeBtn}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Orders Panel ─────────────────────────────────────────────
function OrdersPanel({ orders }) {
  if (orders.length === 0) return <div className={s.empty}>{t.customer.ordersEmpty}</div>;
  return (
    <div>
      <div className={s.pageTitle}>{t.customer.ordersTitle}</div>
      {orders.map(order => (
        <div key={order.id} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.2rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>#{order.id}</span>
            <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>{order.date}</span>
          </div>
          <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}>₪{order.total}</div>
        </div>
      ))}
    </div>
  );
}

// ── CustomerPage ─────────────────────────────────────────────
export default function CustomerPage() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [activePanel, setActivePanel] = useState('browse');
  const [products,    setProducts]    = useState([]);
  const [cart,        setCartState]   = useState([]);
  const [wishlist,    setWishState]   = useState([]);
  const [orders,      setOrders]      = useState([]);

  const refresh = useCallback(() => {
    setProducts(loadProducts());
    if (isLoggedIn) {
      setCartState(loadCart());
      setWishState(loadWishlist());
      setOrders(loadOrders());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  function addToCart(code) {
    if (!isLoggedIn) return;
    const updated = [...cart];
    const existing = updated.find(i => i.code === code);
    if (existing) existing.qty += 1;
    else updated.push({ code, qty: 1 });
    saveCart(updated);
    setCartState(updated);
  }

  function removeFromCart(code) {
    const updated = cart.filter(i => i.code !== code);
    saveCart(updated);
    setCartState(updated);
  }

  function toggleWishlist(code) {
    if (!isLoggedIn) return;
    const updated = wishlist.includes(code)
      ? wishlist.filter(c => c !== code)
      : [...wishlist, code];
    saveWishlist(updated);
    setWishState(updated);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navItems = [
    { id: 'browse',   icon: '🛍️', label: t.customer.navBrowse },
    { id: 'wishlist', icon: '❤️',  label: t.customer.navWishlist, locked: !isLoggedIn },
    { id: 'cart',     icon: '🛒',  label: t.customer.navCart,     locked: !isLoggedIn, badge: cartCount || undefined },
    { id: 'orders',   icon: '📦',  label: t.customer.navOrders,   locked: !isLoggedIn },
    { id: 'visual',   icon: '👁️',  label: t.customer.navVisual },
    { id: 'tryon',    icon: '🪞',  label: t.customer.navTryon },
    { id: 'profile',  icon: '👤',  label: t.customer.navProfile,  locked: !isLoggedIn },
  ];

  const sidebarHeader = isLoggedIn ? (
    <div className={s.userBar}>
      <div className={s.userName}>{currentUser.name}</div>
      <div className={s.userEmail}>{currentUser.email}</div>
    </div>
  ) : (
    <div className={s.guestBar}>
      <div className={s.guestLabel}>{t.customer.guestLabel}</div>
      <button className={s.guestBtn} onClick={() => navigate('/')}>{t.customer.guestLoginBtn}</button>
    </div>
  );

  const sidebarFooter = (
    <>
      <button className="" style={{ display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.68rem 0.85rem', borderRadius:10, cursor:'pointer', color:'var(--color-text-dim)', background:'none', border:'none', width:'100%', fontFamily:'var(--font-body)', textAlign:'right' }}
        onClick={() => navigate('/')}>🏠 {t.customer.navHome}
      </button>
      {isLoggedIn && (
        <button style={{ display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.68rem 0.85rem', borderRadius:10, cursor:'pointer', color:'var(--color-red)', background:'none', border:'none', width:'100%', fontFamily:'var(--font-body)', textAlign:'right' }}
          onClick={() => { logout(); navigate('/'); }}>🚪 {t.customer.navLogout}
        </button>
      )}
    </>
  );

  return (
    <div className={s.layout}>
      <AppSidebar
        brand={t.brand}
        roleLabel={t.customer.roleLabel}
        navItems={navItems}
        activePanel={activePanel}
        onNavClick={setActivePanel}
        header={sidebarHeader}
        footer={sidebarFooter}
      />
      <main style={{ marginRight: 'var(--sidebar-width)', flex: 1, padding: '2.5rem' }}>
        {activePanel === 'browse'   && <BrowsePanel products={products} isLoggedIn={isLoggedIn} wishlist={wishlist} onWishToggle={toggleWishlist} onAddToCart={addToCart} />}
        {activePanel === 'cart'     && <CartPanel cart={cart} products={products} onRemove={removeFromCart} onCheckout={() => navigate('/checkout')} />}
        {activePanel === 'wishlist' && <WishlistPanel wishlist={wishlist} products={products} onRemove={toggleWishlist} onAddToCart={addToCart} />}
        {activePanel === 'orders'   && <OrdersPanel orders={orders} />}
        {activePanel === 'visual'   && <div className={s.empty}>{t.customer.navVisual} — {t.customer.comingSoon}</div>}
        {activePanel === 'tryon'    && <div className={s.empty}>{t.customer.navTryon}  — {t.customer.comingSoon}</div>}
        {activePanel === 'profile'  && isLoggedIn && (
          <div>
            <div className={s.pageTitle}>{t.customer.profileTitle}</div>
            <div style={{ color: 'var(--color-text-dim)' }}>{currentUser?.email}</div>
          </div>
        )}
      </main>
    </div>
  );
}
