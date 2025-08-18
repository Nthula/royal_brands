document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     Highlight Active Nav Link on Scroll
  ------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80; // Adjust for navbar height
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  /* -------------------------
     Category Toggle (Clothing ↔ Flyers)
  ------------------------- */
  const buttons = document.querySelectorAll(".category-btn");
  const clothingSection = document.getElementById("clothing");
  const flyersSection = document.getElementById("flyers");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active")); // reset
      button.classList.add("active");

      const category = button.getAttribute("data-category");

      if (category === "clothing") {
        clothingSection.style.display = "grid";
        flyersSection.style.display = "none";
      } else {
        clothingSection.style.display = "none";
        flyersSection.style.display = "grid";
      }
    });
  });

  /* -------------------------
     Lightbox for Product Images
  ------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");

  // Open Lightbox on double click
  document.querySelectorAll(".viewable").forEach(img => {
    img.addEventListener("dblclick", () => {
      lightbox.style.display = "block";
      lightboxImg.src = img.src;
    });
  });

  // Close Lightbox on 'X'
  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // Close Lightbox on click outside image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  /* -------------------------
     Mobile Dropdown Menu Toggle
  ------------------------- */
  const toggle  = document.getElementById('menu-toggle');
  const menu    = document.getElementById('mobile-menu');

  if (!toggle || !menu) {
    console.warn('Toggle or menu element not found.');
  } else {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
    });

    /* optional: close when a link inside is clicked */
    menu.addEventListener('click', e => {
      if (e.target.tagName === 'A') menu.classList.remove('show');
    });
  }


  window.cart = [];   // {id, name, img, qty}

/* ====== helpers ====== */
const $badge = document.querySelector('.cart-count');
const $panel = document.querySelector('.mini-cart');
const $list  = document.querySelector('.mini-cart-list');
const $empty = document.querySelector('.mini-cart-empty');

function saveCart()   { localStorage.setItem('rb-cart', JSON.stringify(window.cart)); }
function loadCart() {
  window.cart = [];                 // force 0 items on every visit
  localStorage.removeItem('rb-cart'); // (optional) wipe saved cart too
}

function renderBadge() {
  $badge.textContent = window.cart.reduce((t, i) => t + i.qty, 0);
}

function renderPanel() {
  const hasItems = window.cart.length > 0;
  document.querySelector('.mini-cart-empty').style.display = hasItems ? 'none' : 'block';
  const $list = document.querySelector('.mini-cart-list');
  $list.style.display = hasItems ? 'block' : 'none';

  $list.innerHTML = window.cart.map(item => `
    <li class="mini-cart-item">
      <img src="${item.img}" alt="">
      <span class="mini-cart-name">${item.name}</span>
      <button class="mini-cart-remove" data-id="${item.id}">×</button>
    </li>
  `).join('');
}

function syncButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id  = card.dataset.id;
    const btn = card.querySelector('.add-to-cart');
    if (window.cart.some(item => item.id === id)) {
      btn.textContent = 'Remove';
    } else {
      btn.textContent = 'Add to Cart';
    }
  });
}

/* ====== add / remove logic ====== */
document.addEventListener('click', e => {
  /* ---- add to cart ---- */
  if (e.target.classList.contains('add-to-cart')) {
    const card = e.target.closest('.product-card');
    const id   = card.dataset.id;
    if (window.cart.find(i => i.id === id)) return; // already added

    window.cart.push({
      id,
      name: card.querySelector('h3').textContent.trim(),
      img : card.querySelector('img').src,
      qty : 1
    });
    e.target.textContent = 'Remove';
    saveCart(); renderBadge(); renderPanel();
  }

  /* ---- remove from cart ---- */
  if (e.target.classList.contains('mini-cart-remove')) {
    const id = e.target.dataset.id;
    window.cart = window.cart.filter(i => i.id !== id);
    saveCart(); renderBadge(); renderPanel();

    // flip button back to “Add to Cart” if the card is on screen
    const btn = document.querySelector(`.product-card[data-id="${id}"] .add-to-cart`);
    if (btn) btn.textContent = 'Add to Cart';
  }

  /* ---- open / close mini-cart ---- */
  if (e.target.closest('.cart') && !e.target.closest('.mini-cart')) {
    $panel.classList.toggle('show');
  }
});

/* close panel when clicking outside */
document.addEventListener('click', e => {
  if (!e.target.closest('.cart')) $panel.classList.remove('show');
});

/* ===== ORDER-BUTTON LOGIC ===== */
const WHATSAPP_NUMBER = '26774225728';      // your WhatsApp
const EMAIL_ADDRESS   = 'disekokatso@gmail.com';  // your e-mail

function buildMessage() {
  if (!window.cart.length) return '';
  let text = 'Hi, I would like to order:%0A%0A';
  window.cart.forEach((it, idx) => {
    text += `${idx + 1}. ${it.name}%0A`;
  });
  text += '%0AThank you!';
  return text;
}

function toggleOrderBtn() {
  const btn = document.getElementById('order-btn');
  if (!btn) return;
  btn.style.display = window.cart.length ? 'block' : 'none';
}

/* extend existing renderPanel so the button shows/hides automatically */
const oldRenderPanel = renderPanel;
renderPanel = function () {
  oldRenderPanel();
  toggleOrderBtn();
};

/* click handler */
document.addEventListener('click', e => {
  if (!e.target.matches('#order-btn')) return;
  const msg = buildMessage();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  window.location.href =
    `mailto:${EMAIL_ADDRESS}?subject=New Order&body=${msg.replace(/%0A/g, '\n')}`;
});

document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    // Close others first
    document.querySelectorAll('.product-card').forEach(c => {
      if (c !== card) c.classList.remove('active');
    });
    // Toggle current
    card.classList.toggle('active');
  });
});

/* initial */
loadCart();
renderBadge();
renderPanel();
syncButtons();
toggleOrderBtn();

});
