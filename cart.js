// cart.js — robust shared cart logic for ZAVYN
(function () {
  // Use a single key in localStorage
  const STORAGE_KEY = 'zavynCart';

  // Load or create cart
  window.zavynCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Save cart helper
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.zavynCart));
    updateCartCount();
  }

  // Public: addToCart(product)
  // product should be { id: Number|String, name: String, price: Number, image?: String }
  window.addToCart = function (product) {
    if (!product || typeof product.id === 'undefined') {
      console.error('addToCart: product missing id', product);
      return;
    }

    // Ensure price is a number
    product.price = Number(product.price) || 0;
    product.image = product.image || 'https://via.placeholder.com/150';

    const existing = window.zavynCart.find(item => String(item.id) === String(product.id));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      window.zavynCart.push({ ...product, quantity: 1 });
    }

    saveCart();
    // Friendly but non-blocking feedback
    const toast = document.createElement('div');
    toast.textContent = `${product.name} added to cart`;
    toast.style.position = 'fixed';
    toast.style.right = '16px';
    toast.style.bottom = '16px';
    toast.style.background = '#111';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
    toast.style.zhome = 99999;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1400);
  };

  // Public: updateCartCount() updates element with id="cart-count" if present
  window.updateCartCount = function () {
    try {
      const el = document.getElementById('cart-count');
      if (!el) return;
      const count = window.zavynCart.reduce((s, it) => s + (it.quantity || 0), 0);
      el.textContent = count;
    } catch (err) {
      console.error('updateCartCount error', err);
    }
  };

  // Public helper to get cart (read-only copy)
  window.getCart = function () {
    return JSON.parse(JSON.stringify(window.zavynCart || []));
  };

  // Public helper to set cart (used by cart.html)
  window.setCart = function (newCart) {
    window.zavynCart = newCart || [];
    saveCart();
  };

  // Initialize count on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.updateCartCount);
  } else {
    window.updateCartCount();
  }
})();
