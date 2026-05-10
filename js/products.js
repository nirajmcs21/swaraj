// ===== SWARAJ MAKHANA — PRODUCTS DATA =====
const PRODUCTS = [
  {
    id: 1,
    name: "Classic Roasted",
    desc: "The original. Perfectly roasted makhana with a hint of Himalayan pink salt. Pure, simple, divine.",
    emoji: "🪷",
    category: "classic",
    priceINR: 249,
    priceUSD: 2.99,
    weight: "100g",
    badge: "Bestseller",
    tags: ["Natural", "Low Calorie", "Vegan"]
  },
  {
    id: 2,
    name: "Peri Peri Punch",
    emoji: "🌶️",
    desc: "Fiery African peri peri spice blend meets India's finest makhana. A flavour explosion.",
    category: "spicy",
    priceINR: 279,
    priceUSD: 3.49,
    weight: "100g",
    badge: "Hot 🔥",
    tags: ["Spicy", "Bold", "Vegan"]
  },
  {
    id: 3,
    name: "Himalayan Cheese",
    emoji: "🧀",
    desc: "Creamy cheese seasoning made with real cheddar. Indulgent but still guilt-free.",
    category: "classic",
    priceINR: 299,
    priceUSD: 3.69,
    weight: "100g",
    badge: null,
    tags: ["Cheesy", "Kids' Fave", "Crispy"]
  },
  {
    id: 4,
    name: "Dark Chocolate",
    emoji: "🍫",
    desc: "Belgian dark chocolate drizzled over hand-roasted makhana. Luxury meets health.",
    category: "sweet",
    priceINR: 349,
    priceUSD: 4.29,
    weight: "80g",
    badge: "New",
    tags: ["Sweet", "Premium", "Antioxidants"]
  },
  {
    id: 5,
    name: "Butter Pepper",
    emoji: "🧈",
    desc: "Lightly buttered with cracked black pepper and rosemary. Elegant everyday snacking.",
    category: "classic",
    priceINR: 269,
    priceUSD: 3.29,
    weight: "100g",
    badge: null,
    tags: ["Buttery", "Light", "Gluten Free"]
  },
  {
    id: 6,
    name: "Saffron & Rose",
    emoji: "🌸",
    desc: "Royal blend of Kashmiri saffron and rose water. Inspired by Mughal khazana.",
    category: "premium",
    priceINR: 449,
    priceUSD: 5.49,
    weight: "80g",
    badge: "Premium",
    tags: ["Exotic", "Royal", "Gift Worthy"]
  },
  {
    id: 7,
    name: "Green Chilli & Lime",
    emoji: "🍋",
    desc: "Tangy lime zest and raw green chilli — a zing that wakes up every taste bud.",
    category: "spicy",
    priceINR: 269,
    priceUSD: 3.29,
    weight: "100g",
    badge: null,
    tags: ["Tangy", "Spicy", "Refreshing"]
  },
  {
    id: 8,
    name: "Caramel Crunch",
    emoji: "🍯",
    desc: "Slow-cooked caramel with a whisper of sea salt. Sweet, crunchy, irresistible.",
    category: "sweet",
    priceINR: 329,
    priceUSD: 3.99,
    weight: "80g",
    badge: "Top Rated",
    tags: ["Sweet", "Caramel", "Crispy"]
  },
  {
    id: 9,
    name: "Truffle & Herb",
    emoji: "🫧",
    desc: "Black truffle oil and mixed Italian herbs. Fine dining snack experience at home.",
    category: "premium",
    priceINR: 499,
    priceUSD: 5.99,
    weight: "75g",
    badge: "Luxury",
    tags: ["Gourmet", "Truffle", "Premium"]
  },
  {
    id: 10,
    name: "Masala Magic",
    emoji: "🌿",
    desc: "Authentic Indian chaat masala blend. Nostalgia in every crunch.",
    category: "spicy",
    priceINR: 249,
    priceUSD: 2.99,
    weight: "100g",
    badge: null,
    tags: ["Desi", "Chaat", "Classic India"]
  },
  {
    id: 11,
    name: "Mango Tajin",
    emoji: "🥭",
    desc: "Sun-dried mango powder with mild tajin spice. A tropical fiesta.",
    category: "sweet",
    priceINR: 299,
    priceUSD: 3.69,
    weight: "80g",
    badge: "Summer Pick",
    tags: ["Fruity", "Tropical", "Mango"]
  },
  {
    id: 12,
    name: "Family Value Pack",
    emoji: "📦",
    desc: "5 assorted flavours in one big pack. Perfect for families, offices & gifting.",
    category: "premium",
    priceINR: 999,
    priceUSD: 11.99,
    weight: "500g",
    badge: "Best Value",
    tags: ["Variety", "Family Pack", "Gift Box"]
  }
];

// Render products
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = '';
  filtered.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.setAttribute('data-category', product.category);
    card.innerHTML = `
      <div class="product-img">
        <span style="font-size:5rem">${product.emoji}</span>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-tags">
          ${product.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          <span class="tag">${product.weight}</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-inr">₹${product.priceINR}</span>
            <span class="price-usd">~$${product.priceUSD} USD</span>
          </div>
          <button class="add-to-cart" onclick="addToCart(${product.id}, event)">Add to Cart +</button>
        </div>
      </div>
    `;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });
    grid.appendChild(card);
  });

  // Re-trigger scroll reveal for new cards
  setTimeout(() => {
    document.querySelectorAll('.product-card.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

function filterProducts(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(category);
}

// Render nutrition cards
const NUTRITION_FACTS = [
  { icon: "💪", title: "High in Protein", desc: "9.7g per 100g — more protein than most nuts. Builds and repairs muscle." },
  { icon: "🫀", title: "Heart Healthy", desc: "Zero cholesterol, ultra-low fat. Magnesium supports healthy blood pressure." },
  { icon: "🩸", title: "Low Glycemic", desc: "GI of 55 — safe for diabetics. Slow energy release, no sugar spikes." },
  { icon: "🦴", title: "Calcium Rich", desc: "60mg calcium per 100g. Stronger bones, healthier teeth." },
  { icon: "🌿", title: "Antioxidant Boost", desc: "Rich in kaempferol — fights aging, reduces inflammation." },
  { icon: "😴", title: "Ayurvedic Tonic", desc: "Used for 3,000 years in Ayurveda for kidney health and restful sleep." }
];

function renderNutrition() {
  const grid = document.getElementById('nutritionGrid');
  if (!grid) return;
  grid.innerHTML = NUTRITION_FACTS.map(f => `
    <div class="nutrition-card reveal">
      <span class="nutrition-icon">${f.icon}</span>
      <strong>${f.title}</strong>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

// Render testimonials
const TESTIMONIALS = [
  { name: "Niraj Raj", location: "Delhi, New Delhi", emoji: "👨🏽", stars: 5, text: "I've tried so many makhana brands but Swaraj is on another level. The roasting is perfect — light, crispy, not oily at all. The Saffron & Rose is absolutely heavenly!" },
  { name: "Swapnil Baranwal", location: "Mau, Uttar Pradesh", emoji: "👩🏽", stars: 4.5, text: "Ordering from Mau and the delivery was surprisingly fast. The Family Pack is amazing value. My kids can't stop eating the Caramel Crunch!" },
  { name: "Mukesh Mahala", location: "Sikar, Rajasthan", emoji: "👨🏽", stars: 5, text: "As a nutritionist I'm always skeptical of 'superfood' claims, but makhana genuinely delivers. Swaraj's quality is the best I've tasted. The Himalayan Cheese is my office snack." },
  { name: "Monika Rohilia", location: "Sikar, Rajasthan", emoji: "👨🏽", stars: 5, text: "The Truffle & Herb flavour is extraordinary. I've been bringing these to dinner parties and everyone asks where to buy them. Premium product!" },
  { name: "Fatima Al-Rashid", location: "Patna, Bihar", emoji: "👩🏼", stars: 5, text: "Finally a healthy snack my whole family loves. The masala magic reminds me of street food in India. Shipping was fast and packaging was intact." },
  { name: "Vikram Singh", location: "Banaras, Uttar Pradesh", emoji: "👨🏽‍🦱", stars: 5, text: "The Peri Peri is dangerously addictive. I've now become the person who brings Indian snacks to every gathering. Nobody complains. 10/10." }
];

function renderTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.getElementById('testimonialDots');
  if (!track) return;
  track.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial-card reveal" style="transition-delay:${i * 0.1}s">
      <div class="stars">${'⭐'.repeat(t.stars)}</div>
      <div class="testimonial-text">"${t.text}"</div>
      <div class="testimonial-author">
        <div class="author-avatar">${t.emoji}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-location">📍 ${t.location}</div>
        </div>
      </div>
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = TESTIMONIALS.map((_, i) => `<div class="dot${i === 0 ? ' active' : ''}" onclick="scrollToTestimonial(${i})"></div>`).join('');
  }
}

function scrollToTestimonial(idx) {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards[idx]) return;
  // Scroll only inside the track container — never jumps the page
  const cardLeft = cards[idx].offsetLeft - track.offsetLeft;
  track.scrollTo({ left: cardLeft, behavior: 'smooth' });
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderNutrition();
  renderTestimonials();
});
