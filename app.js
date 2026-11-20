/**
 * BookVerse - Modern E-Commerce Ebook Store Application Logic
 */

// =============================================================================
// 1. EBOOK CATALOG DATA
// =============================================================================
const EBOOKS_DATA = [
  {
    id: 'book-1',
    title: 'The Algorithmic Mind: Architecture of Next-Gen AI',
    author: 'Dr. Elena Vance',
    category: 'Technology & Code',
    categorySlug: 'tech',
    price: 699,
    originalPrice: 999,
    rating: 4.9,
    reviewCount: 842,
    badge: 'Bestseller',
    badgeType: 'badge-bestseller',
    featured: true,
    formats: ['PDF'],
    pdfUrl: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
    pages: 480,
    fileSize: '14.2 MB',
    isbn: '978-0-192-84012-3',
    releaseYear: 2025,
    language: 'English',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    coverIcon: 'code',
    tagline: 'Deep Neural Architectures & Future Cognition',
    description: `A masterclass in contemporary neural system architecture. Dr. Elena Vance demystifies transformer designs, attention mechanisms, neuromorphic computing, and the frontier of autonomous artificial intelligence. Written with crisp technical rigor, this book is essential reading for engineers, researchers, and technology leaders aiming to design scalable next-generation intelligent systems.`,
    sampleChapter: {
      chapterNum: 'Chapter 1',
      title: 'The Silicon Lattice and The Ghost',
      text: `We stand upon the precipice of cognitive machines that no longer mimic heuristics, but reason in continuous latent spaces. To understand modern machine intelligence, one must first dismantle the illusion that code is merely deterministic instructions. Today's weights and activations behave more like synthetic synapses in a hyperdimensional resonance chamber.

When a 100-billion-parameter foundation model ingests a question, it projects thought through hundreds of stacked layers of multi-head self-attention. Each layer refines, abstracts, and contextualizes representations, transforming raw linguistic tokens into profound topological semantic landscapes.`
    },
    reviews: [
      { name: 'Julian Vance', rating: 5, date: '2 days ago', comment: 'The clearest explanation of attention mechanisms I have ever read. Worth every penny!' },
      { name: 'Sarah Wu', rating: 5, date: '1 week ago', comment: 'Spectacular balance between theoretical mathematical rigor and practical code architectures.' }
    ]
  },
  {
    id: 'book-2',
    title: 'Neon Horizons: Chronicles of Neo-Tokyo 2099',
    author: 'Kaelen Thorne',
    category: 'Sci-Fi & Cyberpunk',
    categorySlug: 'scifi',
    price: 399,
    originalPrice: 599,
    rating: 4.8,
    reviewCount: 1420,
    badge: 'Trending',
    badgeType: 'badge-primary',
    featured: true,
    formats: ['PDF'],
    pdfUrl: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
    pages: 390,
    fileSize: '8.4 MB',
    isbn: '978-1-542-99021-0',
    releaseYear: 2025,
    language: 'English',
    gradient: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #c026d3 100%)',
    coverIcon: 'zap',
    tagline: 'High Tech. Low Life. Infinite Rain.',
    description: `In the rainy, neon-drenched spires of Neo-Tokyo, neural decker Ren Tanaka uncovers a clandestine corporate consciousness escaping from an orbital quantum core. Filled with relentless pulse-pounding pacing, philosophical depth, and vivid cyberpunk imagery, Neon Horizons is an instant classic of futuristic fiction.`,
    sampleChapter: {
      chapterNum: 'Prologue',
      title: 'Rain Over the Neon Spire',
      text: `The rain tasted of ozone and oxidized copper. Seventy floors above the pavement, the holographic billboard for Shinra Bio-Cybernetics flickered in iridescent magenta, bathing Ren Tanaka's worn leather trenchcoat in artificial hues.

His neural port hummed—a slight, vibrating pinch behind his left ear where the fiber optic weave fused with the biological cranial bone. A ping flashed inside his retinal HUD: "Incoming transmission from Node 009. Encrypted with military lattice." He breathed in slowly. The hunt had officially begun.`
    },
    reviews: [
      { name: 'Marcus K.', rating: 5, date: '3 days ago', comment: 'Blade Runner meets Neuromancer. I read the whole book in a single 8-hour sitting!' },
      { name: 'Aoi Shimizu', rating: 4, date: '2 weeks ago', comment: 'World-building is top notch. The ending left me breathless.' }
    ]
  },


];

// Available Promo Codes
const PROMO_CODES = {
  'WELCOME20': { type: 'percent', value: 20, desc: '20% off entire order' },
  'BOOKWORM': { type: 'fixed', value: 150, desc: '₹150 off entire order' },
  'CYBER30': { type: 'percent', value: 30, desc: '30% off cyber deal' },
  'READMORE': { type: 'percent', value: 15, desc: '15% off discount' }
};

// =============================================================================
// 2. STATE MANAGEMENT & LOCAL STORAGE
// =============================================================================
class StoreState {
  constructor() {
    this.deletedBookIds = this.loadFromStorage('bookverse_deleted_ids', []);
    this.customBooks = this.loadFromStorage('bookverse_custom_books', []);
    this.books = [...this.customBooks, ...EBOOKS_DATA].filter(b => !this.deletedBookIds.includes(b.id));
    this.cart = this.loadFromStorage('bookverse_cart', []);
    this.wishlist = this.loadFromStorage('bookverse_wishlist', []);
    this.theme = this.loadFromStorage('bookverse_theme', 'light');
    this.activeDiscount = null;
    this.appliedPromoCode = '';

    // Active Filters
    this.filters = {
      category: 'all',
      searchQuery: '',
      sortBy: 'featured',
      maxPrice: 1500,
      format: 'all',
      viewMode: 'grid'
    };

    // Track audio player mock state
    this.audioPlaying = false;
  }

  loadFromStorage(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}`, e);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage for ${key}`, e);
    }
  }

  // --- Cart Operations ---
  addToCart(bookId, quantity = 1, format = 'EPUB') {
    const existingIndex = this.cart.findIndex(item => item.bookId === bookId && item.format === format);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({ bookId, quantity, format });
    }
    this.saveToStorage('bookverse_cart', this.cart);
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  updateCartQuantity(bookId, format, delta) {
    const index = this.cart.findIndex(item => item.bookId === bookId && item.format === format);
    if (index > -1) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveToStorage('bookverse_cart', this.cart);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  }

  removeFromCart(bookId, format) {
    this.cart = this.cart.filter(item => !(item.bookId === bookId && item.format === format));
    this.saveToStorage('bookverse_cart', this.cart);
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  clearCart() {
    this.cart = [];
    this.activeDiscount = null;
    this.appliedPromoCode = '';
    this.saveToStorage('bookverse_cart', this.cart);
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  isInCart(bookId) {
    return this.cart.some(item => item.bookId === bookId);
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartCalculations() {
    let subtotal = 0;
    this.cart.forEach(item => {
      const book = this.books.find(b => b.id === item.bookId);
      if (book) {
        subtotal += book.price * item.quantity;
      }
    });

    let discountAmount = 0;
    if (this.activeDiscount) {
      if (this.activeDiscount.type === 'percent') {
        discountAmount = (subtotal * this.activeDiscount.value) / 100;
      } else if (this.activeDiscount.type === 'fixed') {
        discountAmount = Math.min(this.activeDiscount.value, subtotal);
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    // 5% standard digital delivery tax
    const tax = discountedSubtotal > 0 ? discountedSubtotal * 0.05 : 0;
    const total = discountedSubtotal + tax;

    return {
      subtotal: Math.round(subtotal).toLocaleString('en-IN'),
      discountAmount: Math.round(discountAmount).toLocaleString('en-IN'),
      tax: Math.round(tax).toLocaleString('en-IN'),
      total: Math.round(total).toLocaleString('en-IN')
    };
  }

  // --- Wishlist Operations ---
  toggleWishlist(bookId) {
    const index = this.wishlist.indexOf(bookId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(bookId);
      added = true;
    }
    this.saveToStorage('bookverse_wishlist', this.wishlist);
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { bookId, added } }));
    return added;
  }

  isInWishlist(bookId) {
    return this.wishlist.includes(bookId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  // --- Theme ---
  setTheme(theme) {
    this.theme = theme;
    this.saveToStorage('bookverse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- Add New Book to Store ---
  addNewBook(book) {
    this.customBooks.unshift(book);
    this.saveToStorage('bookverse_custom_books', this.customBooks);
    this.books.unshift(book);
    renderEbookCatalog();
  }
}

// Global state instance
const store = new StoreState();

// =============================================================================
// 3. UI RENDERING & COMPONENT CONTROLLERS
// =============================================================================

// Helper: Format price in Indian Rupees (₹)
function formatPrice(num) {
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

// Helper: Render Star Rating SVGs
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let html = '';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      html += `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    } else if (i === fullStars && hasHalf) {
      html += `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4zM22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24z"/></svg>`;
    } else {
      html += `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
  }
  return html;
}

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'info') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// Render the main Ebook Catalog Cards
function renderEbookCatalog() {
  const gridContainer = document.getElementById('ebookCatalog');
  const resultsCountEl = document.getElementById('resultsCount');
  if (!gridContainer) return;

  // 1. Filter Books
  let filtered = store.books.filter(book => {
    // Category filter
    if (store.filters.category !== 'all' && book.categorySlug !== store.filters.category) {
      return false;
    }

    // Max Price filter
    if (book.price > store.filters.maxPrice) {
      return false;
    }

    // Search Query filter
    if (store.filters.searchQuery.trim() !== '') {
      const q = store.filters.searchQuery.toLowerCase().trim();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchCategory = book.category.toLowerCase().includes(q);
      const matchDesc = book.description.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCategory && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort Books
  filtered.sort((a, b) => {
    switch (store.filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.releaseYear - a.releaseYear;
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Update counter
  if (resultsCountEl) {
    resultsCountEl.textContent = `Showing ${filtered.length} of ${store.books.length} books`;
  }

  // Handle Empty State
  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <h3>No books found matching your criteria</h3>
        <p>Try clearing your search query, increasing the maximum price, or selecting another category.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Render Grid or List Cards
  gridContainer.className = `ebook-catalog-grid ${store.filters.viewMode === 'list' ? 'list-view' : ''}`;

  gridContainer.innerHTML = filtered.map(book => {
    const isWishlisted = store.isInWishlist(book.id);
    const inCart = store.isInCart(book.id);
    const discountPercent = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

    return `
      <article class="ebook-card" data-book-id="${book.id}">
        <!-- Cover Visual Container -->
        <div class="card-cover-container" onclick="openProductModal('${book.id}')">
          <!-- Badges (Bestseller, Discount) -->
          <div class="card-badge-top-left">
            ${book.badge ? `<span class="badge ${book.badgeType}">${book.badge}</span>` : ''}
            <span class="badge badge-discount">-${discountPercent}%</span>
          </div>

          <!-- Wishlist Heart Button -->
          <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="event.stopPropagation(); handleWishlistClick('${book.id}')"
                  title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}" 
                  aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <!-- 3D Book Cover -->
          <div class="book-cover-3d" style="background: ${book.gradient};">
            <div class="book-cover-badge">${book.formats[0]} EDITION</div>
            <div class="book-cover-title">${book.title}</div>
            <div class="book-cover-author">By ${book.author}</div>
          </div>

          <!-- Hover Quick View Button -->
          <button class="card-quickview-btn" onclick="event.stopPropagation(); openProductModal('${book.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Quick View
          </button>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div class="card-category-format">
            <span class="card-category">${book.category}</span>
            <span>${book.pages} pgs • ${book.formats.join(', ')}</span>
          </div>

          <h3 class="card-title" onclick="openProductModal('${book.id}')" title="${book.title}">${book.title}</h3>
          <div class="card-author">By <strong>${book.author}</strong></div>

          <div class="card-rating-row">
            <div class="stars-wrap">
              ${renderStars(book.rating)}
            </div>
            <span class="rating-score">${book.rating}</span>
            <span class="rating-count">(${book.reviewCount.toLocaleString()})</span>
          </div>

          <div class="card-footer">
            <div class="card-price-wrap">
              <span class="card-price">${formatPrice(book.price)}</span>
              <span class="card-old-price">${formatPrice(book.originalPrice)}</span>
            </div>

            <div style="display: flex; gap: 0.45rem; align-items: center;">
              <button class="btn btn-secondary btn-sm" style="padding: 0.45rem 0.75rem; font-size: 0.82rem;" onclick="event.stopPropagation(); openPdfReader('${book.id}')" title="Read PDF Book Online">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Read
              </button>

              <button class="card-add-btn ${inCart ? 'in-cart' : ''}" 
                      onclick="handleAddToCartClick('${book.id}', this)"
                      title="${inCart ? 'In Cart' : 'Add to Cart'}">
                ${inCart ? `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>In Cart</span>
                ` : `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span>Add</span>
                `}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Wishlist interaction handler
function handleWishlistClick(bookId) {
  const added = store.toggleWishlist(bookId);
  const book = store.books.find(b => b.id === bookId);
  const title = book ? book.title : 'Book';
  if (added) {
    showToast(`Added "${title.substring(0, 30)}..." to Wishlist`, 'info');
  } else {
    showToast(`Removed from Wishlist`, 'info');
  }
}

// Add to Cart interaction handler
function handleAddToCartClick(bookId, btnEl) {
  store.addToCart(bookId, 1);
  const book = store.books.find(b => b.id === bookId);
  const title = book ? book.title : 'Book';

  showToast(`Added "${title.substring(0, 30)}..." to Cart!`, 'success');

  if (btnEl) {
    btnEl.classList.add('in-cart');
    btnEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>Added!</span>
    `;
    setTimeout(() => {
      btnEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>In Cart</span>
      `;
    }, 1200);
  }
}

// Reset all filters helper
function resetAllFilters() {
  store.filters.category = 'all';
  store.filters.searchQuery = '';
  store.filters.sortBy = 'featured';
  store.filters.maxPrice = 1500;

  // Reset UI elements
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.cat === 'all');
  });

  const searchInput = document.getElementById('headerSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const sortSelect = document.getElementById('sortSelect');
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('priceValueDisplay');

  if (searchInput) searchInput.value = '';
  if (mobileSearchInput) mobileSearchInput.value = '';
  if (clearBtn) clearBtn.classList.remove('active');
  if (sortSelect) sortSelect.value = 'featured';
  if (priceSlider) priceSlider.value = 1500;
  if (priceDisplay) priceDisplay.textContent = '₹1,500';

  renderEbookCatalog();
}

// =============================================================================
// 4. PRODUCT DETAILS & QUICK VIEW MODAL
// =============================================================================
let currentModalBook = null;

function openProductModal(bookId) {
  const book = store.books.find(b => b.id === bookId);
  if (!book) return;
  currentModalBook = book;

  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('productModalBody');
  if (!modal || !modalBody) return;

  const isWishlisted = store.isInWishlist(book.id);
  const inCart = store.isInCart(book.id);
  const discountPercent = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

  modalBody.innerHTML = `
    <div class="product-modal-grid">
      <!-- Left Column: 3D Cover & Actions -->
      <div class="modal-book-col">
        <div class="modal-book-3d" style="background: ${book.gradient};">
          <div class="book-cover-badge">${book.formats[0]} EDITION</div>
          <div>
            <h2 class="book-cover-title" style="font-size: 1.4rem;">${book.title}</h2>
            <div class="book-cover-author">By ${book.author}</div>
          </div>
        </div>

        <div class="modal-book-actions">
          <div style="display: flex; gap: 0.5rem;">
            <select id="modalFormatSelect" class="filter-select" style="flex: 1;">
              ${book.formats.map(fmt => `<option value="${fmt}">${fmt} Format (Instant)</option>`).join('')}
            </select>
            <div class="drawer-qty-control" style="height: 40px; padding: 0 0.5rem;">
              <button class="qty-btn" onclick="adjustModalQty(-1)">-</button>
              <span id="modalQtyNum" class="qty-number">1</span>
              <button class="qty-btn" onclick="adjustModalQty(1)">+</button>
            </div>
          </div>

          <button class="btn btn-primary" style="width: 100%;" onclick="addModalBookToCart()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Shopping Cart
          </button>

          <button class="btn btn-outline" style="width: 100%; font-weight: 700;" onclick="openPdfReader('${book.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Read PDF Online Now
          </button>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="handleWishlistClick('${book.id}'); updateModalWishlistBtn('${book.id}');">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span id="modalWishlistText">${isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="shareBookLink('${book.title}')" title="Share link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Info & Tabs -->
      <div class="modal-info-col">
        <div class="modal-meta-top">
          <span class="badge badge-primary">${book.category}</span>
          ${book.badge ? `<span class="badge ${book.badgeType}">${book.badge}</span>` : ''}
          <span class="badge badge-discount">Save ${discountPercent}%</span>
        </div>

        <h1 class="modal-title">${book.title}</h1>
        <div class="modal-author">Written by <strong>${book.author}</strong> • Released ${book.releaseYear}</div>

        <div class="card-rating-row" style="margin-bottom: 0.75rem;">
          <div class="stars-wrap">
            ${renderStars(book.rating)}
          </div>
          <span class="rating-score">${book.rating}</span>
          <span class="rating-count">(${book.reviewCount.toLocaleString()} verified reader ratings)</span>
        </div>

        <div class="modal-price-row">
          <span class="modal-price">${formatPrice(book.price)}</span>
          <span class="modal-original-price">${formatPrice(book.originalPrice)}</span>
          <span style="font-size: 0.85rem; color: var(--accent-success); font-weight: 700;">Instant Digital Download</span>
        </div>

        

        <!-- Tab Controls -->
        <div class="modal-tabs">
          <button class="modal-tab-btn active" onclick="switchModalTab('overview', this)">Overview</button>
          <button class="modal-tab-btn" onclick="switchModalTab('sample', this)">Read Sample Chapter</button>
          <button class="modal-tab-btn" onclick="switchModalTab('specs', this)">Book Specs</button>
          <button class="modal-tab-btn" onclick="switchModalTab('reviews', this)">Reader Reviews (${book.reviews.length})</button>
        </div>

        <!-- Tab 1: Overview -->
        <div id="tab-overview" class="modal-tab-content active">
          <p style="margin-bottom: 1rem; line-height: 1.7;">${book.description}</p>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-primary);">
            <div style="font-weight: 700; margin-bottom: 0.25rem;">Why Readers Love This:</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary); font-style: italic;">"${book.tagline}"</div>
          </div>
        </div>

        <!-- Tab 2: Sample Chapter Interactive Reader -->
        <div id="tab-sample" class="modal-tab-content">
          <div class="sample-reader-box">
            <div class="reader-toolbar">
              <div style="font-size: 0.85rem; font-weight: 700;">
                ${book.sampleChapter.chapterNum}: ${book.sampleChapter.title}
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="display: flex; gap: 0.25rem;">
                  <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="changeFontSize(-1)">A-</button>
                  <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="changeFontSize(1)">A+</button>
                </div>
                <div class="reader-theme-selector">
                  <button class="reader-theme-btn reader-theme-white" onclick="setReaderTheme('white')" title="White paper"></button>
                  <button class="reader-theme-btn reader-theme-sepia" onclick="setReaderTheme('sepia')" title="Sepia paper"></button>
                  <button class="reader-theme-btn reader-theme-dark"  onclick="setReaderTheme('dark')"  title="Dark paper"></button>
                </div>
              </div>
            </div>
            <div id="readerBodyText" class="reader-body theme-white" style="font-size: 15px;">
              ${book.sampleChapter.text.split('\n\n').map(p => `<p style="margin-bottom: 1rem;">${p}</p>`).join('')}
            </div>
          </div>
          <div style="margin-top: 0.75rem; text-align: center;">
            <button class="btn btn-outline btn-sm" onclick="downloadSamplePreview('${book.title}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Full Sample PDF
            </button>
          </div>
        </div>

        <!-- Tab 3: Specs -->
        <div id="tab-specs" class="modal-tab-content">
          <table class="specs-table">
            <tbody>
              <tr><td>Publisher:</td><td>BookVerse Publications</td></tr>
              <tr><td>Publication Year:</td><td>${book.releaseYear}</td></tr>
              <tr><td>ISBN-13:</td><td>${book.isbn}</td></tr>
              <tr><td>Total Pages:</td><td>${book.pages} pages</td></tr>
              <tr><td>File Download Size:</td><td>${book.fileSize}</td></tr>
              <tr><td>Available Formats:</td><td>${book.formats.join(', ')}</td></tr>
              <tr><td>Language:</td><td>${book.language}</td></tr>
              <tr><td>DRM Protection:</td><td>100% DRM-Free (Read on any device)</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 4: Reviews -->
        <div id="tab-reviews" class="modal-tab-content">
          <div id="modalReviewsList">
            ${book.reviews.map(rev => `
              <div class="review-item">
                <div class="review-item-header">
                  <span class="reviewer-name">${rev.name}</span>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div class="stars-wrap">${renderStars(rev.rating)}</div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${rev.date}</span>
                  </div>
                </div>
                <div class="review-comment">"${rev.comment}"</div>
              </div>
            `).join('')}
          </div>

          <!-- Add Review Form -->
          <form style="margin-top: 1.5rem; background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md);" onsubmit="handleReviewSubmit(event, '${book.id}')">
            <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.75rem;">Leave a Reader Review</div>
            <div class="form-row" style="margin-bottom: 0.75rem;">
              <input type="text" id="reviewAuthorInput" placeholder="Your name" required style="font-size: 0.85rem;">
              <select id="reviewRatingInput" class="filter-select" style="font-size: 0.85rem;">
                <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                <option value="3">★★★☆☆ (3 Stars - Average)</option>
              </select>
            </div>
            <textarea id="reviewCommentInput" rows="2" placeholder="What did you think of the writing and pacing?" required style="width: 100%; margin-bottom: 0.75rem; font-size: 0.85rem;"></textarea>
            <button type="submit" class="btn btn-secondary btn-sm">Submit Review</button>
          </form>
        </div>

      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Modal Qty Adjuster
function adjustModalQty(delta) {
  const qtyEl = document.getElementById('modalQtyNum');
  if (qtyEl) {
    let current = parseInt(qtyEl.textContent) || 1;
    current = Math.max(1, current + delta);
    qtyEl.textContent = current;
  }
}

function addModalBookToCart() {
  if (!currentModalBook) return;
  const qtyEl = document.getElementById('modalQtyNum');
  const formatEl = document.getElementById('modalFormatSelect');
  const qty = qtyEl ? parseInt(qtyEl.textContent) : 1;
  const format = formatEl ? formatEl.value : 'EPUB';

  store.addToCart(currentModalBook.id, qty, format);
  showToast(`Added ${qty} copy of "${currentModalBook.title.substring(0, 25)}..." to Cart!`, 'success');
  closeProductModal();
  openCartDrawer();
}

function updateModalWishlistBtn(bookId) {
  const isWish = store.isInWishlist(bookId);
  const textEl = document.getElementById('modalWishlistText');
  if (textEl) {
    textEl.textContent = isWish ? 'In Wishlist' : 'Add to Wishlist';
  }
}

function shareBookLink(title) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    showToast(`Copied store link for "${title}" to clipboard!`, 'info');
  } else {
    showToast(`Book link ready to share!`, 'info');
  }
}

// Modal Tabs Switcher
function switchModalTab(tabName, btnEl) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));

  if (btnEl) btnEl.classList.add('active');
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.classList.add('active');
}

// Sample Reader Customizations
let currentFontSize = 15;
function changeFontSize(delta) {
  currentFontSize = Math.min(20, Math.max(13, currentFontSize + delta));
  const body = document.getElementById('readerBodyText');
  if (body) {
    body.style.fontSize = `${currentFontSize}px`;
  }
}

function setReaderTheme(theme) {
  const body = document.getElementById('readerBodyText');
  if (body) {
    body.className = `reader-body theme-${theme}`;
  }
}

function downloadSamplePreview(title) {
  showToast(`Starting sample PDF download for "${title}"...`, 'success');
}

// Submit a review
function handleReviewSubmit(e, bookId) {
  e.preventDefault();
  const authorInput = document.getElementById('reviewAuthorInput');
  const ratingInput = document.getElementById('reviewRatingInput');
  const commentInput = document.getElementById('reviewCommentInput');

  if (!authorInput || !ratingInput || !commentInput) return;

  const newReview = {
    name: authorInput.value.trim(),
    rating: parseInt(ratingInput.value),
    date: 'Just now',
    comment: commentInput.value.trim()
  };

  const book = store.books.find(b => b.id === bookId);
  if (book) {
    book.reviews.unshift(newReview);
    showToast(`Thank you for your review, ${newReview.name}!`, 'success');

    // Re-render reviews list
    const reviewsList = document.getElementById('modalReviewsList');
    if (reviewsList) {
      reviewsList.innerHTML = book.reviews.map(rev => `
        <div class="review-item">
          <div class="review-item-header">
            <span class="reviewer-name">${rev.name}</span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div class="stars-wrap">${renderStars(rev.rating)}</div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${rev.date}</span>
            </div>
          </div>
          <div class="review-comment">"${rev.comment}"</div>
        </div>
      `).join('');
    }

    // Clear form
    authorInput.value = '';
    commentInput.value = '';
  }
}

// Audio preview simulator
function toggleAudioPreview() {
  store.audioPlaying = !store.audioPlaying;
  const playIcon = document.getElementById('audioPlayIcon');
  const timeLabel = document.getElementById('audioTimeLabel');

  if (store.audioPlaying) {
    if (playIcon) playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
    if (timeLabel) timeLabel.textContent = `0:24 / 1:45 • Playing sample...`;
    showToast(`Audio sample playing (narration simulation)`, 'info');
  } else {
    if (playIcon) playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    if (timeLabel) timeLabel.textContent = `Paused • Click to resume`;
  }
}

// =============================================================================
// 5. SHOPPING CART DRAWER
// =============================================================================
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const badge = document.getElementById('cartCountBadge');
  const calcSubtotal = document.getElementById('cartCalcSubtotal');
  const calcDiscountRow = document.getElementById('cartCalcDiscountRow');
  const calcDiscount = document.getElementById('cartCalcDiscount');
  const calcTax = document.getElementById('cartCalcTax');
  const calcTotal = document.getElementById('cartCalcTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  // Update badge count
  const count = store.getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (!body) return;

  if (store.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div style="width: 60px; height: 60px; margin: 0 auto 1rem; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h4 style="font-weight: 700; margin-bottom: 0.35rem;">Your Cart is Empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Explore our curated bestselling library and discover your next great read.</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartDrawer(); document.getElementById('ebookCatalog').scrollIntoView({behavior: 'smooth'})">Explore Books</button>
      </div>
    `;

    if (calcSubtotal) calcSubtotal.textContent = '₹0';
    if (calcDiscountRow) calcDiscountRow.style.display = 'none';
    if (calcTax) calcTax.textContent = '₹0';
    if (calcTotal) calcTotal.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  body.innerHTML = store.cart.map(item => {
    const book = store.books.find(b => b.id === item.bookId);
    if (!book) return '';

    return `
      <div class="drawer-item">
        <div class="drawer-item-cover" style="background: ${book.gradient};">
          <div class="drawer-item-title-mini">${book.title}</div>
        </div>

        <div class="drawer-item-info">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h4 class="drawer-item-title">${book.title}</h4>
              <button class="drawer-item-remove" onclick="store.removeFromCart('${book.id}', '${item.format}')" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="drawer-item-author">By ${book.author} • <span class="badge badge-primary" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">${item.format}</span></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <div class="drawer-qty-control">
              <button class="qty-btn" onclick="store.updateCartQuantity('${book.id}', '${item.format}', -1)">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="store.updateCartQuantity('${book.id}', '${item.format}', 1)">+</button>
            </div>
            <div class="drawer-item-price">${formatPrice(book.price * item.quantity)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Update calculations
  const calcs = store.getCartCalculations();
  if (calcSubtotal) calcSubtotal.textContent = `₹${calcs.subtotal}`;
  if (calcTax) calcTax.textContent = `₹${calcs.tax}`;
  if (calcTotal) calcTotal.textContent = `₹${calcs.total}`;

  if (calcDiscountRow && calcDiscount) {
    if (store.activeDiscount) {
      calcDiscountRow.style.display = 'flex';
      calcDiscount.textContent = `-₹${calcs.discountAmount} (${store.appliedPromoCode})`;
    } else {
      calcDiscountRow.style.display = 'none';
    }
  }
}

// Apply Promo Code
function applyPromoCode() {
  const input = document.getElementById('promoCodeInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (PROMO_CODES[code]) {
    store.activeDiscount = PROMO_CODES[code];
    store.appliedPromoCode = code;
    showToast(`Promo Code "${code}" applied: ${PROMO_CODES[code].desc}!`, 'success');
    renderCartDrawer();
  } else {
    showToast(`Invalid promo code. Try "WELCOME20" or "BOOKWORM"!`, 'warning');
  }
}

// =============================================================================
// 6. WISHLIST DRAWER
// =============================================================================
function openWishlistDrawer() {
  renderWishlistDrawer();
  const drawer = document.getElementById('wishlistDrawer');
  if (drawer) {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlistDrawer');
  if (drawer) {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderWishlistDrawer() {
  const body = document.getElementById('wishlistDrawerBody');
  const badge = document.getElementById('wishlistCountBadge');
  const count = store.getWishlistCount();

  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (!body) return;

  if (store.wishlist.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div style="width: 60px; height: 60px; margin: 0 auto 1rem; border-radius: 50%; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h4 style="font-weight: 700; margin-bottom: 0.35rem;">Your Wishlist is Empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Save your favorite upcoming releases and must-read titles for later.</p>
        <button class="btn btn-primary btn-sm" onclick="closeWishlistDrawer(); document.getElementById('ebookCatalog').scrollIntoView({behavior: 'smooth'})">Browse Catalog</button>
      </div>
    `;
    return;
  }

  body.innerHTML = store.wishlist.map(bookId => {
    const book = store.books.find(b => b.id === bookId);
    if (!book) return '';

    return `
      <div class="drawer-item">
        <div class="drawer-item-cover" style="background: ${book.gradient}; cursor: pointer;" onclick="closeWishlistDrawer(); openProductModal('${book.id}')">
          <div class="drawer-item-title-mini">${book.title}</div>
        </div>

        <div class="drawer-item-info">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h4 class="drawer-item-title" style="cursor: pointer;" onclick="closeWishlistDrawer(); openProductModal('${book.id}')">${book.title}</h4>
              <button class="drawer-item-remove" onclick="store.toggleWishlist('${book.id}')" title="Remove from wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="drawer-item-author">By ${book.author}</div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <span class="drawer-item-price">${formatPrice(book.price)}</span>
            <button class="btn btn-primary btn-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="store.addToCart('${book.id}', 1); showToast('Moved to Cart!', 'success');">
              Move to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function moveAllWishlistToCart() {
  if (store.wishlist.length === 0) return;
  store.wishlist.forEach(id => store.addToCart(id, 1));
  showToast(`Moved ${store.wishlist.length} items from Wishlist to Cart!`, 'success');
  closeWishlistDrawer();
  openCartDrawer();
}

// =============================================================================
// 7. CHECKOUT & ORDER CONFIRMATION
// =============================================================================
let currentCheckoutStep = 1;

function openCheckoutModal() {
  if (store.cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }
  closeCartDrawer();
  currentCheckoutStep = 1;

  const modal = document.getElementById('checkoutModal');
  const calcs = store.getCartCalculations();
  const summaryEl = document.getElementById('checkoutTotalSummary');
  if (summaryEl) summaryEl.textContent = `₹${calcs.total}`;

  renderCheckoutStep(1);

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCheckoutStep(step) {
  currentCheckoutStep = step;
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const step3 = document.getElementById('checkoutStep3');

  const nav1 = document.getElementById('checkoutNavStep1');
  const nav2 = document.getElementById('checkoutNavStep2');
  const nav3 = document.getElementById('checkoutNavStep3');

  if (nav1) nav1.classList.toggle('active', step === 1);
  if (nav2) nav2.classList.toggle('active', step === 2);
  if (nav3) nav3.classList.toggle('active', step === 3);

  if (step1) step1.style.display = step === 1 ? 'block' : 'none';
  if (step2) step2.style.display = step === 2 ? 'block' : 'none';
  if (step3) step3.style.display = step === 3 ? 'block' : 'none';
}

function handleStep1Submit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('checkoutEmail');
  if (emailInput && emailInput.value.includes('@')) {
    renderCheckoutStep(2);
  } else {
    showToast('Please enter a valid email address for ebook delivery', 'warning');
  }
}

function selectPaymentMethod(method, cardEl) {
  document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');
}

function handleStep2Submit(e) {
  e.preventDefault();
  const btn = document.getElementById('completePaymentBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      Processing Secure Transaction...
    `;
  }

  // Simulate payment processing delay
  setTimeout(() => {
    // Generate order ID
    const orderId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderNumEl = document.getElementById('confirmedOrderId');
    if (orderNumEl) orderNumEl.textContent = `#${orderId}`;

    // Populate downloads list
    const downloadsContainer = document.getElementById('confirmedDownloadsList');
    if (downloadsContainer) {
      downloadsContainer.innerHTML = store.cart.map(item => {
        const book = store.books.find(b => b.id === item.bookId);
        if (!book) return '';
        return `
          <div class="download-item-card">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">${book.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${item.format} • ${book.fileSize} • Instant DRM-Free</div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="downloadEbook('${book.title}', '${item.format}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Clear cart and show step 3
    store.clearCart();
    renderCheckoutStep(3);
    showToast('Payment successful! Your ebooks are ready for download.', 'success');
  }, 1200);
}

function downloadEbook(title, format) {
  showToast(`Downloading "${title}" in ${format} format...`, 'success');
}

// Card number formatting simulator
function formatCardNumberInput(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  val = val.match(/.{1,4}/g)?.join(' ') || val;
  input.value = val;
}

// =============================================================================
// 8. EVENT LISTENERS & INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme
  store.setTheme(store.theme);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = store.theme === 'dark' ? 'light' : 'dark';
      store.setTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // 2. Render initial Catalog & counters
  renderEbookCatalog();
  renderCartDrawer();
  renderWishlistDrawer();

  // 3. Search Handling (both header and mobile search)
  const headerSearchInput = document.getElementById('headerSearchInput');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  function handleSearch(query) {
    store.filters.searchQuery = query;
    if (headerSearchInput && headerSearchInput.value !== query) headerSearchInput.value = query;
    if (mobileSearchInput && mobileSearchInput.value !== query) mobileSearchInput.value = query;

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('active', query.trim() !== '');
    }
    renderEbookCatalog();
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => handleSearch(''));
  }

  // 4. Category Pills
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      store.filters.category = pill.dataset.cat;
      renderEbookCatalog();
    });
  });

  // 5. Price Slider
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('priceValueDisplay');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      priceDisplay.textContent = `₹${val.toLocaleString('en-IN')}`;
      store.filters.maxPrice = val;
      renderEbookCatalog();
    });
  }

  // 6. Sort Dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.filters.sortBy = e.target.value;
      renderEbookCatalog();
    });
  }

  // 7. Grid vs List View Toggle
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      store.filters.viewMode = 'grid';
      renderEbookCatalog();
    });

    viewListBtn.addEventListener('click', () => {
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      store.filters.viewMode = 'list';
      renderEbookCatalog();
    });
  }

  // 8. Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      if (emailInput && emailInput.value.includes('@')) {
        showToast(`🎉 Subscribed! Use code "WELCOME20" for 20% off your first ebook.`, 'success');
        emailInput.value = '';
      }
    });
  }

  // 9. Synchronize UI on Store Events
  window.addEventListener('cart-updated', () => {
    renderCartDrawer();
    renderEbookCatalog();
  });

  window.addEventListener('wishlist-updated', () => {
    renderWishlistDrawer();
    renderEbookCatalog();
  });

  // 10. Close drawers/modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartDrawer();
      closeWishlistDrawer();
      closeCheckoutModal();
      closeAddBookModal();
      closePdfReaderModal();
    }
  });

  // 11. Copy announcement promo on click
  const announcementCoupon = document.querySelector('.coupon-tag');
  if (announcementCoupon) {
    announcementCoupon.addEventListener('click', () => {
      const promo = announcementCoupon.textContent.trim();
      navigator.clipboard.writeText(promo);
      showToast(`Copied code "${promo}" to clipboard!`, 'info');
    });
  }
});

// =============================================================================
// 9. INDEXEDDB & ADD NEW EBOOK HANDLERS (LOCAL PDF UPLOAD SUPPORT)
// =============================================================================
const DB_NAME = 'BookVerseDB';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_files';

function initPdfDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function saveLocalPdfFile(bookId, fileBlob) {
  const db = await initPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(fileBlob, bookId);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function getLocalPdfFile(bookId) {
  const db = await initPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(bookId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

// Track active ObjectURL to prevent memory leaks
let activePdfBlobUrl = null;

// Handle file selection from user's device folder
function handleLocalPdfSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const dropzone = document.getElementById('fileUploadDropzone');
  const label = document.getElementById('fileUploadLabel');
  const subtext = document.getElementById('fileUploadSubtext');
  const titleInput = document.getElementById('newBookTitle');

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

  if (dropzone) dropzone.classList.add('has-file');
  if (label) label.textContent = `✓ Selected: ${file.name}`;
  if (subtext) subtext.textContent = `File ready (${sizeMb} MB) • Will be stored in your browser library`;

  // Auto-populate title if empty
  if (titleInput && !titleInput.value.trim()) {
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    titleInput.value = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  }

  showToast(`Attached "${file.name}" (${sizeMb} MB) from device!`, 'info');
}

function openAddBookModal() {
  const modal = document.getElementById('addBookModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAddBookModal() {
  const modal = document.getElementById('addBookModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  const dropzone = document.getElementById('fileUploadDropzone');
  const label = document.getElementById('fileUploadLabel');
  const subtext = document.getElementById('fileUploadSubtext');
  const fileInput = document.getElementById('newBookPdfFile');
  if (dropzone) dropzone.classList.remove('has-file');
  if (label) label.textContent = 'Click to select a PDF from your computer folder';
  if (subtext) subtext.textContent = 'Choose any .pdf file from your device to read it directly';
  if (fileInput) fileInput.value = '';
}

async function handleAddNewBook(e) {
  e.preventDefault();
  const title = document.getElementById('newBookTitle').value.trim();
  const author = document.getElementById('newBookAuthor').value.trim();
  const catSlug = document.getElementById('newBookCategory').value;
  const badgeVal = document.getElementById('newBookBadge').value;
  const price = parseFloat(document.getElementById('newBookPrice').value);
  const originalPrice = parseFloat(document.getElementById('newBookOriginalPrice').value) || Math.round(price * 1.3);
  const pages = parseInt(document.getElementById('newBookPages').value) || 320;
  const gradient = document.getElementById('newBookGradient').value;
  const tagline = document.getElementById('newBookTagline').value.trim() || 'A captivating read for modern thinkers.';

  const fileInput = document.getElementById('newBookPdfFile');
  const selectedFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;

  const pdfUrlInput = document.getElementById('newBookPdfUrl');
  let pdfUrl = (pdfUrlInput && pdfUrlInput.value.trim()) ? pdfUrlInput.value.trim() : '';

  if (!selectedFile && !pdfUrl) {
    showToast('Please select a PDF file from your device OR enter a PDF web link!', 'warning');
    return;
  }

  const desc = document.getElementById('newBookDesc').value.trim();
  const sampleText = document.getElementById('newBookSampleText').value.trim() || 'Sample chapter excerpt will be available shortly.';

  const categoryNames = {
    'tech': 'Technology & Code',
    'scifi': 'Sci-Fi & Cyberpunk',
    'selfhelp': 'Self-Help & Mindset',
    'business': 'Business & Leadership',
    'fantasy': 'Fiction & Fantasy',
    'mystery': 'Mystery & Thriller'
  };

  const badgeTypeMap = {
    'Bestseller': 'badge-bestseller',
    'New Release': 'badge-new',
    'Trending': 'badge-primary',
    'Staff Pick': 'badge-primary',
    'Popular': 'badge-bestseller',
    'none': null
  };

  const bookId = `book-${Date.now()}`;
  const fileSize = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(Math.random() * 8 + 3).toFixed(1)} MB`;

  if (selectedFile) {
    try {
      await saveLocalPdfFile(bookId, selectedFile);
    } catch (err) {
      console.warn('Could not store local PDF in IndexedDB:', err);
    }
  }

  const newBook = {
    id: bookId,
    title,
    author,
    category: categoryNames[catSlug] || 'General',
    categorySlug: catSlug,
    price,
    originalPrice,
    rating: 5.0,
    reviewCount: 1,
    badge: badgeVal !== 'none' ? badgeVal : null,
    badgeType: badgeTypeMap[badgeVal] || null,
    featured: true,
    formats: ['PDF'],
    isLocalFile: !!selectedFile,
    pdfUrl: pdfUrl || (selectedFile ? selectedFile.name : 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf'),
    pages,
    fileSize,
    isbn: `978-0-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1 + Math.random() * 9)}`,
    releaseYear: 2026,
    language: 'English',
    gradient,
    coverIcon: 'book',
    tagline,
    description: desc,
    sampleChapter: {
      chapterNum: 'Chapter 1',
      title: 'Introduction',
      text: sampleText
    },
    reviews: [
      { name: 'Reader Community', rating: 5, date: 'Just now', comment: 'Newly published to BookVerse!' }
    ]
  };

  store.addNewBook(newBook);
  showToast(`🎉 "${title}" added with local device PDF!`, 'success');
  closeAddBookModal();

  const form = document.getElementById('addBookForm');
  if (form) form.reset();

  const catalogEl = document.getElementById('storeCatalogSection');
  if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
}

// =============================================================================
// 10. PDF & BOOK READER MODAL HANDLERS
// =============================================================================
async function openPdfReader(bookId) {
  const book = store.books.find(b => b.id === bookId);
  if (!book) return;

  const modal = document.getElementById('pdfReaderModal');
  const titleEl = document.getElementById('pdfReaderBookTitle');
  const authorEl = document.getElementById('pdfReaderAuthor');
  const externalBtn = document.getElementById('pdfReaderExternalBtn');
  const body = document.getElementById('pdfReaderModalBody');

  if (!modal || !body) return;

  if (titleEl) titleEl.textContent = book.title;
  if (authorEl) authorEl.textContent = `By ${book.author}`;

  if (activePdfBlobUrl) {
    URL.revokeObjectURL(activePdfBlobUrl);
    activePdfBlobUrl = null;
  }

  let pdfLink = book.pdfUrl;
  let isLocal = false;

  if (book.isLocalFile) {
    try {
      const blob = await getLocalPdfFile(book.id);
      if (blob) {
        activePdfBlobUrl = URL.createObjectURL(blob);
        pdfLink = activePdfBlobUrl;
        isLocal = true;
      }
    } catch (err) {
      console.warn('Could not read local PDF from IndexedDB:', err);
    }
  }

  if (!pdfLink) {
    pdfLink = 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf';
  }

  if (externalBtn) {
    externalBtn.href = pdfLink;
    if (isLocal) {
      externalBtn.setAttribute('download', `${book.title}.pdf`);
      externalBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/> <line x1="12" y1="3" x2="12" y2="15"/></svg>
        Save / Download PDF
      `;
    } else {
      externalBtn.removeAttribute('download');
      externalBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open in New Window
      `;
    }
    externalBtn.style.display = 'inline-flex';
  }

  body.innerHTML = `
    <div class="pdf-embed-wrapper">
      <div class="pdf-banner-notice">
        <span>📖 Reading: <strong>${book.title}</strong> (${isLocal ? 'Uploaded from Device Folder' : 'PDF Edition'})</span>
        <span>
          <a href="${pdfLink}" target="_blank" ${isLocal ? 'download="' + book.title + '.pdf"' : ''} rel="noopener noreferrer" style="text-decoration: underline; color: inherit; font-weight: 700; margin-left: 0.5rem;">
            ${isLocal ? 'Save PDF Copy ↗' : 'Open Source Link ↗'}
          </a>
        </span>
      </div>
      <iframe src="${pdfLink}" class="pdf-viewer-frame" title="${book.title} PDF Reader"></iframe>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  showToast(`Opening PDF reader for "${book.title.substring(0, 25)}..."`, 'info');
}

function closePdfReaderModal() {
  const modal = document.getElementById('pdfReaderModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const body = document.getElementById('pdfReaderModalBody');
    if (body) body.innerHTML = '';
  }
  if (activePdfBlobUrl) {
    URL.revokeObjectURL(activePdfBlobUrl);
    activePdfBlobUrl = null;
  }
}
