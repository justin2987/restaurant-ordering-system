import { product } from './products.js';

const foodDisplay = document.querySelector('.food-display');
const allCard = document.getElementById('all');
const mainCoursesCard = document.getElementById('main-courses');
const fastFoodCard = document.getElementById('fast-food');
const dessertsCard = document.getElementById('desserts');

const addOrderDetailSection = document.querySelector('.add-order-detail');
const noteTextArea = document.getElementById('message');
const addDetailBtn = document.querySelector('.add-detail-btn');
const closeDetailBtn = document.querySelector('.close-detail-btn');

let currentCategory = 'all';
let activeNoteProductId = null;

function updateCategoryCounts() {
  const mainCourseList = product.filter((item) => item.category === 'Main Courses');
  const fastFoodList = product.filter((item) => item.category === 'Fast Food');
  const dessertList = product.filter((item) => item.category === 'Desserts');

  const totalCoursesEl = document.querySelector('.total-courses');
  if (totalCoursesEl) totalCoursesEl.innerText = `${product.length} items`;

  const totalMainCoursesEl = document.querySelector('.total-main-courses');
  if (totalMainCoursesEl) totalMainCoursesEl.innerText = `${mainCourseList.length} items`;

  const totalFastFoodEl = document.querySelector('.total-fast-food');
  if (totalFastFoodEl) totalFastFoodEl.innerText = `${fastFoodList.length} items`;

  const totalDessertEl = document.querySelector('.total-dessert');
  if (totalDessertEl) totalDessertEl.innerText = `${dessertList.length} items`;
}

function updateRealTime() {
  const now = new Date();

  const dateOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  const formattedDate = now.toLocaleDateString('en-US', dateOptions);

  const timeOptions = { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

  const activeTimeEl = document.querySelector('.active-time p');
  if (activeTimeEl) {
    activeTimeEl.innerText = `${formattedDate} • ${formattedTime}`;
  }
}

function displayProducts() {
  foodDisplay.innerHTML = '';

  const filteredProducts = product.filter((item) => {
    if (currentCategory === 'all') return true;
    return item.category === currentCategory;
  });

  filteredProducts.forEach((item) => {
    foodDisplay.innerHTML += `
      <div class="meal-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="meal-icon">
        <h2>${item.name}</h2>
        <p class="meal-detail">${item.detail}</p>
        <div class="meal-card-actions">
          <p class="price">$${item.price.toFixed(2)}</p>

          <div class="quantity-controls">
            <button class="remove-from-cart">-</button>
            <p class="quantity">${item.quantity}</p>
            <button class="add-to-cart">+</button>
          </div>
        </div>        
      </div>
    `;
  });
}

allCard.addEventListener('click', () => {
  currentCategory = 'all';
  displayProducts();
});

mainCoursesCard.addEventListener('click', () => {
  currentCategory = 'Main Courses';
  displayProducts();
});

fastFoodCard.addEventListener('click', () => {
  currentCategory = 'Fast Food';
  displayProducts();
});

dessertsCard.addEventListener('click', () => {
  currentCategory = 'Desserts';
  displayProducts();
});

foodDisplay.addEventListener('click', (e) => {
  const card = e.target.closest('.meal-card');
  if (!card) return;

  const productId = Number(card.dataset.id);
  const targetItem = product.find((item) => item.id === productId);

  if (e.target.classList.contains('add-to-cart')) {
    targetItem.quantity++;
    displayProducts();
  }

  if (e.target.classList.contains('remove-from-cart')) {
    if (targetItem.quantity > 0) {
      targetItem.quantity--;
      displayProducts();
    }
  }

  displayOrders();
});

function displayOrders() {
  const buyProduct = product.filter((item) => item.quantity > 0);
  const orderCardContainer = document.querySelector('.order-card-container');
  
  if (!orderCardContainer) return;

  let orderHTML = '';

  buyProduct.forEach((item) => {
    orderHTML += `
      <div class="order-cards" data-id="${item.id}">
        <div class="item-info">
          <div class="item-name-desc">
            <h2>${item.name}</h2>
            <p class="item-note">${item.note ? item.note : "No special instructions"}</p>
          </div>
          <div>
            <p class="item-quantity">x${item.quantity}</p>
          </div>        
        </div>
        <div class="item-price">
          <button class="notes" data-id="${item.id}">📝 Notes</button>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  orderCardContainer.innerHTML = orderHTML;

  const subtotal = buyProduct.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantityCount = buyProduct.reduce((total, item) => total + item.quantity, 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const totalItemsEl = document.querySelector('.total-items');
  if (totalItemsEl) {
    totalItemsEl.innerHTML = `
      <h3>Items (${totalQuantityCount})</h3>
      <p>$${subtotal.toFixed(2)}</p>
    `;
  }

  const taxEl = document.querySelector('.total-tax p');
  if (taxEl) {
    taxEl.innerText = `$${tax.toFixed(2)}`;
  }

  const checkoutTotalEl = document.querySelector('.total-amount');
  if (checkoutTotalEl) {
    checkoutTotalEl.innerText = `$${grandTotal.toFixed(2)}`;
  }
}

const orderSection = document.querySelector('.order-detail');
if (orderSection) {
  orderSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('notes')) {
      activeNoteProductId = Number(e.target.dataset.id);
      const targetItem = product.find((item) => item.id === activeNoteProductId);

      if (targetItem && addOrderDetailSection) {
      
        noteTextArea.value = targetItem.note || '';
        addOrderDetailSection.style.display = 'flex';
        noteTextArea.focus();
      }
    }
  });
}

if (addDetailBtn) {
  addDetailBtn.addEventListener('click', () => {
    if (activeNoteProductId !== null) {
      const targetItem = product.find((item) => item.id === activeNoteProductId);
      if (targetItem) {
        targetItem.note = noteTextArea.value.trim();
        displayOrders();
      }
    }
    addOrderDetailSection.style.display = 'none';
    noteTextArea.value = '';
    activeNoteProductId = null;
  });
}

if (closeDetailBtn) {
  closeDetailBtn.addEventListener('click', () => {
    addOrderDetailSection.style.display = 'none';
    noteTextArea.value = '';
    activeNoteProductId = null;
  });
}

updateCategoryCounts();
displayProducts();
displayOrders();
updateRealTime();
setInterval(updateRealTime, 60000);