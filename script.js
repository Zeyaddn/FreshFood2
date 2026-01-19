// ==========================
// ====== PRODUCTS & CART ======
// ==========================

// Initial product data
const initialProducts = [
  {img: "images/product-2.webp", name: "Strawberry", shop: "Local shop", weight: "500 gm.", price: "17.29", loading: "lazy"},
  {img: "images/product-5.webp", name: "Tomato", shop: "Local shop", weight: "500 gm.", price: "12.29", loading: "lazy"},
  {img: "images/product-3.webp", name: "green peas", shop: "Process food", weight: "500 gm.", price: "14.29", loading: "lazy"},
  {img: "images/product-4.webp", name: "Red Cabbage", shop: "Cut Bone", weight: "500 gm.", price: "16.29", loading: "lazy"},
  {img: "images/product-6.webp", name: "Broccoli", shop: "Sprite", weight: "500 gm.", price: "18.29", loading: "lazy"}
];

// Additional products for "See More"
const moreProducts = [
  {img: "images/product-7.webp", name: "Carrots", shop: "Local shop", weight: "500 gm.", price: "10.29", loading: "lazy"},
  {img: "images/product-8.webp", name: "Fresh juice", shop: "Local shop", weight: "1 kg", price: "8.50", loading: "lazy"},
  {img: "images/product-9.webp", name: "Onions", shop: "Dairy", weight: "200 gm", price: "5.75", loading: "lazy"},
  {img: "images/product-10.webp", name: "Apple", shop: "Fresh Meat", weight: "1 kg", price: "20.99", loading: "lazy"},
  {img: "images/product-12.webp", name: "Red Chili Peppers", shop: "Beverage", weight: "500 ml", price: "6.29", loading: "lazy"}
];

// DOM Elements
const grid = document.getElementById('productsGrid');
const seeMoreBtn = document.getElementById('seeMoreBtn');
const showLessBtn = document.getElementById('showLessBtn');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const closeCart = document.getElementById('closeCart');
const searchInput = document.getElementById('productSearch');
const autocompleteList = document.getElementById('autocompleteList');

// Merge all products for easy search
let allProducts = initialProducts.concat(moreProducts);

// Empty cart initially
let cart = [];

// Render products in grid
function renderProducts(productsArray) {
  grid.innerHTML = ""; // Clear current products

  productsArray.forEach((product, index) => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.img}" loading="${product.loading}">
      <h6>${product.name}</h6>
      <small>(${product.shop})</small>
      <small>${product.weight}</small>
      <div class="price">
        ${product.price.split('.')[0]}<span class="decimal">.${product.price.split('.')[1]}</span><span class="currency">$</span>
      </div>
      <button class="cool-btn" data-index="${index}">Add to cart</button>
    `;
    grid.appendChild(card);
  });

  // Add event listener for "Add to cart"
  document.querySelectorAll('.cool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const product = productsArray[idx];

      // Add to cart or increase quantity if already exists
      const existing = cart.find(p => p.name === product.name);
      if (existing) existing.quantity += 1;
      else cart.push({...product, quantity: 1});

      updateCartCount();
      animateFlyingImage(btn); // optional flying image effect
    });
  });
}

// Update cart counter
function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Animate flying image to cart
function animateFlyingImage(btn) {
  const img = btn.parentElement.querySelector('img');
  const flyingImg = img.cloneNode(true);
  const rect = img.getBoundingClientRect();
  flyingImg.classList.add('flying-img');
  flyingImg.style.top = rect.top + 'px';
  flyingImg.style.left = rect.left + 'px';
  document.body.appendChild(flyingImg);

  const cartRect = cartBtn.getBoundingClientRect();
  const dx = cartRect.left - rect.left;
  const dy = cartRect.top - rect.top;

  requestAnimationFrame(() => {
    flyingImg.style.transform = `translate(${dx}px, ${dy}px) scale(2.2)`;
    flyingImg.style.opacity = '0.3';
  });

  flyingImg.addEventListener('transitionend', () => flyingImg.remove());
}

// Initial render
renderProducts(initialProducts);

// Show More / Show Less functionality
seeMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  renderProducts(allProducts);
  seeMoreBtn.style.display = 'none';
  showLessBtn.style.display = 'inline-block';
});

showLessBtn.addEventListener('click', e => {
  e.preventDefault();
  renderProducts(initialProducts);
  seeMoreBtn.style.display = 'inline-block';
  showLessBtn.style.display = 'none';
  document.getElementById('seemore').scrollIntoView({behavior:"smooth"});
});

// ==========================
// ====== SEARCH AUTOCOMPLETE ======
// ==========================

searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  autocompleteList.innerHTML = '';

  if (filter === '') {
    autocompleteList.style.display = 'none';
    renderProducts(allProducts);
    return;
  }

  const matches = allProducts.filter(p => p.name.toLowerCase().includes(filter));

  matches.forEach(prod => {
    const item = document.createElement('div');
    item.textContent = prod.name;
    item.style.padding = '8px 12px';
    item.style.cursor = 'pointer';
    item.style.borderBottom = '1px solid #eee';

    item.addEventListener('click', () => {
      // Show only the selected product
      renderProducts([prod]);
      autocompleteList.style.display = 'none';
      searchInput.value = prod.name;
    });

    autocompleteList.appendChild(item);
  });

  autocompleteList.style.display = matches.length > 0 ? 'block' : 'none';
});

// Hide autocomplete if clicking outside
document.addEventListener('click', function(e) {
  if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
    autocompleteList.style.display = 'none';
  }
});

// ==========================
// ====== CART MODAL ======
// ==========================

cartBtn.addEventListener('click', () => {
  renderCartItems();
  cartModal.style.display = 'flex';
  setTimeout(() => cartModal.classList.add('show'), 10);
});

closeCart.addEventListener('click', () => {
  cartModal.classList.remove('show');
  setTimeout(() => cartModal.style.display = 'none', 300);
});

// Render cart items inside modal
function renderCartItems() {
  cartItems.innerHTML = "";

  if(cart.length === 0) {
    cartItems.innerHTML = "<p style='text-align:center; font-size:16px; color:#555;'>Your cart is empty</p>";
    return;
  }

  const header = document.createElement('div');
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.padding = "8px 0";
  header.style.fontWeight = "700";
  header.style.borderBottom = "2px solid #ddd";
  header.innerHTML = `
    <span style="flex:2;">Product</span>
    <span style="flex:1; text-align:center;">Amount</span>
    <span style="flex:1; text-align:right;">Remove</span>
  `;
  cartItems.appendChild(header);

  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.padding = "12px 0";
    row.style.borderBottom = "1px solid #eee";

    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; flex:2;">
        <img src="${item.img}" style="width:50px; height:50px; object-fit:contain; border-radius:6px;">
        <div>
          <div style="font-weight:600;">${item.name}</div>
          <div style="font-size:12px; color:#555;">(${item.weight})</div>
        </div>
      </div>
      <div style="flex:1; text-align:center; font-weight:600;">${item.quantity}</div>
      <div style="flex:1; text-align:right;">
        <button data-index="${index}" style="background:#ff4d4d; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px;">Remove</button>
      </div>
    `;
    cartItems.appendChild(row);

    row.querySelector('button').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCartCount();
      renderCartItems();
    });
  });
}

// change image
 function changeImage(src) {
    const mainImage = document.getElementById("mainView");
    mainImage.style.opacity = "0";

    setTimeout(() => {
      mainImage.src = src;
      mainImage.style.opacity = "1";
    }, 200);
  }

// ==========================
// ====== CHECKOUT & PROMO ======
// ==========================

let currentQty = 1;
let unitPrice = 29.12;
let discountPercent = 0;

// Toggle checkout overlay
function toggleCheckout(show) {
  const overlay = document.getElementById('checkoutOverlay');
  overlay.style.display = show ? 'flex' : 'none';
  document.body.style.overflow = show ? 'hidden' : 'auto';
}

// Prevent overlay click
window.onclick = function(event) {
  const overlay = document.getElementById('checkoutOverlay');
  if (event.target === overlay) toggleCheckout(false);
}

// Quantity change
function changeQty(val) {
  currentQty = Math.max(1, currentQty + val);
  document.getElementById('productQty').innerText = currentQty;
  calculateTotal();
}

// Calculate totals
function calculateTotal() {
  const subtotal = currentQty * unitPrice;
  const discount = subtotal * discountPercent;
  const isCash = document.querySelector('input[name="pay"]:checked').value === 'cash';
  const delivery = 16.00;
  const codFee = isCash ? 9.00 : 0;

  document.getElementById('codFeeRow').style.display = isCash ? 'flex' : 'none';
  document.getElementById('subtotalVal').innerText = subtotal.toFixed(2);
  document.getElementById('discountVal').innerText = discount.toFixed(2);

  const total = (subtotal + delivery + codFee) - discount;
  document.getElementById('totalFinalVal').innerText = total.toFixed(2);
}

// Apply promo code
function applyPromoCode() {
  const code = document.getElementById('promoInput').value.trim();
  const msg = document.getElementById('discountMessage');
  
  if(code.toLowerCase() === "zeyad10") {
    discountPercent = 0.10;
    calculateTotal();
    msg.textContent = `🎉 Success! 10% Discount Applied!`;
    msg.style.background = "#bdfd7e";
    msg.style.color = "#082d32";
  } else {
    discountPercent = 0;
    calculateTotal();
    msg.textContent = `❌ Invalid Promo Code`;
    msg.style.background = "#f8d7da";
    msg.style.color = "#842029";
  }

  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

// Confirm order processing
function processOrder() {
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const successView = document.getElementById('successView');

  btnText.style.display = 'none';
  btnLoader.style.display = 'block';

  setTimeout(() => {
    successView.style.display = 'flex';
    console.log("Order Successful");
  }, 2000);
}

// ==========================
// ====== MAP HANDLING ======
// ==========================

let mapInstance, markerInstance;

function openZeyadMap() {
  document.getElementById('mapContainer').style.display = 'flex';

  if(!mapInstance) {
    mapInstance = L.map('zeyadLeafletMap').setView([30.0444, 31.2357], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    markerInstance = L.marker([30.0444, 31.2357], {draggable: true}).addTo(mapInstance);

    markerInstance.on('dragend', () => {
      let pos = markerInstance.getLatLng();
      updateTempAddr(pos.lat, pos.lng);
    });

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        const loc = [p.coords.latitude, p.coords.longitude];
        mapInstance.setView(loc, 16);
        markerInstance.setLatLng(loc);
        updateTempAddr(loc[0], loc[1]);
      });
    }
  } else {
    setTimeout(() => mapInstance.invalidateSize(), 200);
  }
}

async function updateTempAddr(lat, lng) {
  try {
    let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    let data = await res.json();
    document.getElementById('tempAddress').innerText = data.display_name;
  } catch {
    document.getElementById('tempAddress').innerText = "Location Pinpointed";
  }
}

function closeZeyadMap() {
  document.getElementById('mapContainer').style.display = 'none';
}

function confirmLocation() {
  const newAddr = document.getElementById('tempAddress').innerText;
  document.getElementById('displayLocation').innerText = newAddr;
  document.getElementById('displayAddress').innerText = "Address Pinpointed via Map";
  closeZeyadMap();
}

// ==========================
// ====== TIMER ======
// ==========================

let totalSeconds = 270*24*60*60 + 13*60*60 + 10*60 + 32;

function updateTimer() {
  const days = Math.floor(totalSeconds / (24*60*60));
  const hours = Math.floor((totalSeconds % (24*60*60)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById('countdown').textContent = 
    `${days.toString().padStart(3,'0')} : ${hours.toString().padStart(2,'0')} : ${minutes.toString().padStart(2,'0')} : ${seconds.toString().padStart(2,'0')}`;

  if(totalSeconds > 0) totalSeconds--;
}

updateTimer();
setInterval(updateTimer, 1000);

// ===================================end========================

// start other store
const storesData = [
    { name: "M&M Food Market", price: "20.42$", time: "12",loading:"lazy", img: "images/product-9.webp", highlighted: true, badge: false },
    { name: "T&T Food Market", price: "19.50$", time: "13", loading:"lazy", img: "images/product-8.webp", highlighted: false, badge: false },
    { name: "T&T Food Market", price: "19.50$", time: "13",loading:"lazy", img: "images/product-7.webp", highlighted: false, badge: false },
    { name: "T&T Food Market", price: "19.50$", time: "13", img: "images/product-5.webp", highlighted: false, badge: true },
    { name: "Loblaws", price: "23.00$", time: "15",loading:"lazy", img: "images/product-4.webp", highlighted: false, badge: false },
    { name: "Loblaws", price: "23.00$", time: "15",loading:"lazy", img: "images/product-7.webp", highlighted: false, badge: false }
];

const container = document.getElementById('stores-container');

container.innerHTML = storesData.map(store => `
    <div class="col-md-6">
        <div class="store-card blurry-banner ${store.highlighted ? 'highlighted' : ''} d-flex justify-content-between align-items-center">
            ${store.badge ? '<span class="lower-price-badge">Lower price</span>' : ''}
            <div class="d-flex align-items-center">
                <div class="store-logo me-3">
                    <img src="${store.img}" alt="logo" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                    <p class="store-name">${store.name}</p>
                    <span class="delivery-info">⚡ Delivery in ${store.time} minute</span>
                </div>
            </div>
            <div class="price-text ${store.highlighted ? 'active-price' : ''}">${store.price}</div>
        </div>
    </div>
`).join('');
