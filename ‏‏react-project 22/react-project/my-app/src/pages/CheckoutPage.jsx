import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from '../styles/Checkout.module.scss';
import t from '../utils/translations';
import { loadCart, loadProducts, saveCart, saveOrders, loadOrders, getCurrentUser } from '../utils/storage';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('credit');
  const [done,      setDone]      = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [error,     setError]     = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', city: '', street: '',
    cardNum: '', cardExp: '', cardCvv: '',
  });

  const cart     = loadCart();
  const products = loadProducts();
  const items    = cart
    .map(i => ({ ...i, product: products.find(p => p.code === i.code) }))
    .filter(i => i.product);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleSubmit() {
    if (!form.firstName || !form.lastName || !form.city) {
      setError(t.checkout.validationErr);
      return;
    }
    setError('');
    const user  = getCurrentUser();
    const order = {
      id:    Date.now(),
      date:  new Date().toLocaleDateString('he-IL'),
      items: items.map(i => ({ code: i.code, qty: i.qty, name: i.product.name, price: i.product.price })),
      total: subtotal,
      status: 'ממתין',
    };
    const existing = loadOrders();
    saveOrders([...existing, order]);
    saveCart([]);
    setOrderTotal(subtotal);
    setDone(true);
  }

  if (done) return (
    <div className={s.success}>
      <div className={s.successIcon}>{t.checkout.successIcon}</div>
      <div className={s.successTitle}>{t.checkout.successTitle}</div>
      <div className={s.successSub}>{t.checkout.successTotal} ₪{orderTotal}</div>
      <button className={s.backBtn} onClick={() => navigate('/customer')}>{t.checkout.backToStore}</button>
    </div>
  );

  return (
    <div className={s.page}>
      <div className={s.pageTitle}>{t.checkout.title}</div>
      <div className={s.pageSub}>{t.checkout.subtitle}</div>

      <div className={s.grid}>
        {/* Left column */}
        <div>
          {/* Shipping */}
          <div className={s.card}>
            <div className={s.cardTitle}>{t.checkout.shippingTitle}</div>
            <div className={s.formGrid}>
              {[
                ['firstName', t.checkout.fieldFirstName, 'text'],
                ['lastName',  t.checkout.fieldLastName,  'text'],
                ['email',     t.checkout.fieldEmail,     'email'],
                ['phone',     t.checkout.fieldPhone,     'tel'],
              ].map(([key, lbl, type]) => (
                <div key={key} className={s.field}>
                  <label>{lbl}</label>
                  <input type={type} value={form[key]} onChange={e => setField(key, e.target.value)} />
                </div>
              ))}
              <div className={`${s.field} ${s.formFull}`}>
                <label>{t.checkout.fieldCity}</label>
                <input type="text" value={form.city} onChange={e => setField('city', e.target.value)} />
              </div>
              <div className={`${s.field} ${s.formFull}`}>
                <label>{t.checkout.fieldStreet}</label>
                <input type="text" value={form.street} onChange={e => setField('street', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className={s.card}>
            <div className={s.cardTitle}>{t.checkout.paymentTitle}</div>
            <div className={s.payOptions}>
              {[
                ['credit', t.checkout.payCredit],
                ['paypal', t.checkout.payPaypal],
                ['bit',    t.checkout.payBit],
              ].map(([id, label]) => (
                <div key={id}
                  className={`${s.payOption} ${payMethod === id ? s.selected : ''}`}
                  onClick={() => setPayMethod(id)}>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {payMethod === 'credit' && (
              <div className={s.formGrid}>
                <div className={`${s.field} ${s.formFull}`}>
                  <label>{t.checkout.cardNum}</label>
                  <input type="text" placeholder={t.checkout.cardNumPlaceholder} value={form.cardNum} onChange={e => setField('cardNum', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label>{t.checkout.cardExp}</label>
                  <input type="text" placeholder={t.checkout.cardExpPlaceholder} value={form.cardExp} onChange={e => setField('cardExp', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label>{t.checkout.cardCvv}</label>
                  <input type="text" placeholder="123" value={form.cardCvv} onChange={e => setField('cardCvv', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column — order summary */}
        <div>
          <div className={s.card}>
            <div className={s.cardTitle}>{t.checkout.orderTitle}</div>

            {items.map(item => (
              <div key={item.code} className={s.orderItem}>
                {item.product.img && <img className={s.orderImg} src={item.product.img} alt={item.product.name} />}
                <div className={s.orderInfo}>
                  <div className={s.orderName}>{item.product.name}</div>
                  <div className={s.orderMeta}>{t.checkout.qty} {item.qty}</div>
                </div>
                <div className={s.orderPrice}>₪{item.product.price * item.qty}</div>
              </div>
            ))}

            <div className={s.summaryRow}>
              <span>{t.checkout.subtotal}</span>
              <span>₪{subtotal}</span>
            </div>
            <div className={s.summaryRow}>
              <span>{t.checkout.shipping}</span>
              <span>{t.checkout.shippingFree}</span>
            </div>
            <div className={s.summaryTotal}>
              <span>{t.checkout.total}</span>
              <span>₪{subtotal}</span>
            </div>

            {error && <div style={{ color: 'var(--color-red)', fontSize: '0.85rem', marginTop: '0.75rem' }}>{error}</div>}
            <button className={s.submitBtn} onClick={handleSubmit}>{t.checkout.submitBtn}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
