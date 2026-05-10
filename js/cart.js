// ===== SWARAJ MAKHANA — CART =====
let cart = JSON.parse(localStorage.getItem('swarajCart') || '[]');

function saveCart() {
  localStorage.setItem('swarajCart', JSON.stringify(cart));
}

function addToCart(productId, event) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to cart!`);
  spawnBurst(event);
  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  updateCartUI();
  updateCartCount();
}

function updateQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
  updateCartCount();
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalAmt = document.getElementById('cartTotalAmt');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span>🪷</span>
        <p>Your cart is empty</p>
        <button class="btn-primary" onclick="closeCart(); document.getElementById('products').scrollIntoView({behavior:'smooth'})">Start Shopping</button>
      </div>`;
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.priceINR * item.qty).toLocaleString()}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.priceINR * item.qty, 0);
  if (cartTotalAmt) cartTotalAmt.textContent = `₹${total.toLocaleString()}`;
  if (cartFooter) cartFooter.style.display = 'block';
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) {
    el.textContent = count;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  updateCartUI();
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  updateCartCount();
}

// ===== CHECKOUT =====
let currentStep = 1;
let selectedPayment = 'card';

function openCheckout() {
  closeCart();
  goToStep(1);
  buildOrderSummary();
  document.getElementById('checkoutOverlay').classList.add('active');
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('active');
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function goToStep(step) {
  currentStep = step;
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`checkoutStep${i}`);
    const indicatorEl = document.getElementById(`step${i}Indicator`);
    if (stepEl) stepEl.classList.toggle('hidden', i !== step);
    if (indicatorEl) indicatorEl.classList.toggle('active', i === step);
  }
}

function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.pay-method').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  ['cardForm', 'upiForm', 'paypalForm', 'netbankingForm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const formMap = { card: 'cardForm', upi: 'upiForm', paypal: 'paypalForm', netbanking: 'netbankingForm' };
  const formEl = document.getElementById(formMap[method]);
  if (formEl) formEl.classList.remove('hidden');
}

function buildOrderSummary() {
  const el = document.getElementById('orderSummaryMini');
  if (!el || cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.priceINR * item.qty, 0);
  const shipping = total >= 999 ? 0 : 99;
  el.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(item => `
      <div class="summary-item">
        <span>${item.emoji} ${item.name} × ${item.qty}</span>
        <span>₹${item.priceINR * item.qty}</span>
      </div>
    `).join('')}
    <div class="summary-item"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span></div>
    <div class="summary-total"><span>Total</span><strong>₹${(total + shipping).toLocaleString()}</strong></div>
  `;
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

function validateDelivery() {
  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country'];
  for (const id of fields) {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.focus();
      el.style.borderColor = '#e74c3c';
      setTimeout(() => el.style.borderColor = '', 2000);
      showToast('⚠️ Please fill all delivery details');
      return false;
    }
  }
  return true;
}

function validatePayment() {
  if (selectedPayment === 'card') {
    const cardNum = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    if (!cardNum || cardNum.length < 16) { showToast('⚠️ Enter a valid 16-digit card number'); return false; }
    const name = document.getElementById('cardName')?.value.trim();
    if (!name) { showToast('⚠️ Enter cardholder name'); return false; }
    const expiry = document.getElementById('cardExpiry')?.value;
    if (!expiry || expiry.length < 5) { showToast('⚠️ Enter valid expiry date'); return false; }
    const cvv = document.getElementById('cardCvv')?.value;
    if (!cvv || cvv.length < 3) { showToast('⚠️ Enter valid CVV'); return false; }
  } else if (selectedPayment === 'upi') {
    const upi = document.getElementById('upiId')?.value.trim();
    if (!upi || !upi.includes('@')) { showToast('⚠️ Enter valid UPI ID (e.g. name@upi)'); return false; }
  }
  return true;
}

function placeOrder() {
  if (!validateDelivery()) { goToStep(1); return; }
  if (!validatePayment()) return;

  // Simulate payment processing
  const placeBtn = document.querySelector('#checkoutStep2 .btn-primary');
  if (placeBtn) {
    placeBtn.textContent = 'Processing...';
    placeBtn.disabled = true;
  }

  setTimeout(() => {
    const orderId = 'SWM' + Date.now().toString().slice(-8).toUpperCase();
    const orderIdEl = document.getElementById('orderIdDisplay');
    if (orderIdEl) orderIdEl.textContent = orderId;
    goToStep(3);
    if (placeBtn) { placeBtn.textContent = 'Place Order 🛍️'; placeBtn.disabled = false; }
  }, 2000);
}

// ===== VISUAL EFFECTS =====
function spawnBurst(event) {
  if (!event) return;
  const emojis = ['🪷', '✨', '🌿', '⭐'];
  for (let i = 0; i < 5; i++) {
    const el = document.createElement('div');
    el.className = 'burst-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${event.clientX + (Math.random() - 0.5) * 60}px`;
    el.style.top = `${event.clientY + (Math.random() - 0.5) * 60}px`;
    el.style.animationDelay = `${Math.random() * 0.2}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateCartUI();
});
