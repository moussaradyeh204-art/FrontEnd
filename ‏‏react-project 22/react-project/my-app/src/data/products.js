// ============================================================
// FashionSync — Static Product Data
// When you add a backend, replace this file's export with an API call
// ============================================================

const PRODUCTS = [
  {
    code: 'FS-001', name: 'חולצת לינן קלאסית', gender: 'גברים', cat: 'חולצות',
    stock: 12, price: 189, originalPrice: 189, minStock: 5, sale: false,
    img: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&w=400',
    desc: 'חולצת לינן איכותית ונוחה.',
    colors: ['לבן', 'כחול', 'בז', 'ירוק זית', 'מוקה'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    trending: true, bestseller: false,
  },
  {
    code: 'FS-002', name: "ג'ינס סלים פיט", gender: 'גברים', cat: 'מכנסיים',
    stock: 7, price: 349, originalPrice: 349, minStock: 5, sale: false,
    img: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&w=400',
    desc: "ג'ינס כהה בגזרת סלים.",
    colors: ['כחול כהה', 'שחור'],
    sizes: ['28', '30', '32', '34', '36'],
    trending: false, bestseller: true,
  },
  {
    code: 'FS-003', name: 'שמלת קיץ פרחונית', gender: 'נשים', cat: 'שמלות',
    stock: 4, price: 279, originalPrice: 279, minStock: 4, sale: false,
    img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&w=400',
    desc: 'שמלה קיצית קלילה.',
    colors: ['פרחוני', 'ורוד', 'לבן', 'תכלת', 'צהוב'],
    sizes: ['XS', 'S', 'M', 'L'],
    trending: true, bestseller: true,
  },
  {
    code: 'FS-004', name: "ז'קט עור שחור", gender: 'נשים', cat: 'עליוניות',
    stock: 2, price: 699, originalPrice: 699, minStock: 3, sale: false,
    img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&w=400',
    desc: "ז'קט עור שחור קלאסי.",
    colors: ['שחור', 'חום', 'בורדו'],
    sizes: ['S', 'M', 'L'],
    trending: false, bestseller: false,
  },
  {
    code: 'FS-005', name: 'חולצת טי בייסיק', gender: 'נשים', cat: 'חולצות',
    stock: 20, price: 99, originalPrice: 99, minStock: 8, sale: false,
    img: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&w=400',
    desc: 'חולצת טי נוחה ופשוטה.',
    colors: ['שחור', 'לבן', 'אפור', 'ורוד', 'טבעי'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    trending: false, bestseller: true,
  },
  {
    code: 'FS-006', name: 'שמלת ערב אלגנטית', gender: 'נשים', cat: 'שמלות',
    stock: 0, price: 599, originalPrice: 599, minStock: 3, sale: false,
    img: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&w=400',
    desc: 'שמלת ערב ארוכה.',
    colors: ['שחור', 'אדום', 'כחול'],
    sizes: ['S', 'M', 'L'],
    trending: true, bestseller: false,
  },
  {
    code: 'FS-007', name: 'עליונית פוטר חמה', gender: 'גברים', cat: 'עליוניות',
    stock: 5, price: 459, originalPrice: 459, minStock: 4, sale: false,
    img: 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&w=400',
    desc: 'פוטר חם ונוח.',
    colors: ['אפור', 'שחור', 'כחול', 'בורדו'],
    sizes: ['S', 'M', 'L', 'XL'],
    trending: false, bestseller: false,
  },
  {
    code: 'FS-008', name: 'מכנסי טרנינג נוח', gender: 'גברים', cat: 'מכנסיים',
    stock: 9, price: 219, originalPrice: 219, minStock: 5, sale: false,
    img: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&w=400',
    desc: 'מכנסי טרנינג רחבים.',
    colors: ['שחור', 'אפור', 'כחול'],
    sizes: ['S', 'M', 'L', 'XL'],
    trending: false, bestseller: true,
  },
  {
    code: 'FS-009', name: 'חולצת מכופתרת קלאסית', gender: 'גברים', cat: 'חולצות',
    stock: 6, price: 229, originalPrice: 229, minStock: 4, sale: false,
    img: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&w=400',
    desc: 'מכופתרת אלגנטית.',
    colors: ['לבן', 'תכלת', 'ורוד עתיק'],
    sizes: ['S', 'M', 'L', 'XL'],
    trending: true, bestseller: false,
  },
  {
    code: 'FS-010', name: 'חצאית מידי אלגנטית', gender: 'נשים', cat: 'שמלות',
    stock: 8, price: 199, originalPrice: 199, minStock: 4, sale: false,
    img: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&w=400',
    desc: 'חצאית מידי מחמיאה.',
    colors: ['שחור', 'בז', 'ירוק כהה'],
    sizes: ['XS', 'S', 'M', 'L'],
    trending: true, bestseller: true,
  },
  
];

export default PRODUCTS;