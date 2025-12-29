// =========================================
// 1. DATA CONFIG
// =========================================
const adminNumber = "6281249554812"; 
const backendUrl = "https://backend-web-nu.vercel.app/create-transaction";

// DATA PRODUK (Update: Menggunakan Gambar Stok Gaming HD dari Unsplash)
const productsData = [
    // === RANK (Gambar: Trofi & Medali) ===
    { 
        id: 1, 
        name: "Joki GM - Epic", 
        price: 50000, 
        category: "rank", 
        img: "img/grandmaster.jpg" // Gambar Ranking/Chart
    },
    { 
        id: 2, 
        name: "Joki Epic - Legend", 
        price: 80000, 
        category: "rank", 
        img: "img/epic.jpg" // Gambar Mahkota/Raja
    },
    { 
        id: 3, 
        name: "Joki Legend - Mythic", 
        price: 130000, 
        category: "rank", 
        img: "img/legend.jpg" // Gambar Emas Premium
    },
    { 
        id: 4, 
        name: "Joki Mythic Grading", 
        price: 150000, 
        category: "rank", 
        img: "img/mawi.jpg" // Gambar Power/Energy
    },
    { 
        id: 5, 
        name: "Paket Glory (50 ★)", 
        price: 800000, 
        category: "rank", 
        img: "img/glory.jpg" // Gambar Kristal/Berlian
    },
    
    // === CLASSIC / WR (Gambar: Aksi & Setup Gaming) ===
    { 
        id: 6, 
        name: "Classic WR (1 Match)", 
        price: 5000, 
        category: "classic", 
        img: "img/alucard.jpg" // Gambar Layar Game
    },
    { 
        id: 7, 
        name: "Paket WR 100% (10x)", 
        price: 60000, 
        category: "classic", 
        img: "img/push mmr.jpg" // Gambar Visual Menang
    },
    { 
        id: 8, 
        name: "Push MMR Hero", 
        price: 40000, 
        category: "classic", 
        img: "img/yss.jpg" // Gambar Keyboard Gaming
    },

    // === JASA LAIN (Gambar: Controller & Tech) ===
    { 
        id: 9, 
        name: "Joki Gendong (Jam)", 
        price: 35000, 
        category: "jasa", 
        img: "img/mpl.jfif" // Gambar Stick Controller
    },
    { 
        id: 10, 
        name: "Joki MCL Mingguan", 
        price: 100000, 
        category: "jasa", 
        img: "img/mcl.jpg" // Gambar Turnamen/Setup
    },
    { 
        id: 11, 
        name: "Unbind Paksa Akun", 
        price: 50000, 
        category: "jasa", 
        img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=500&auto=format&fit=crop" // Gambar Gembok/Security
    },
    { 
        id: 12, 
        name: "Akun Smurf Lvl 30", 
        price: 30000, 
        category: "jasa", 
        img: "img/akun.jpg" // Gambar User/Profile
    }
];

let cart = [];

// =========================================
// 2. DOM ELEMENTS
// =========================================
const productList = document.getElementById('product-list');
const searchBox = document.getElementById('search-box');
const cartBtn = document.getElementById('shopping-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const shoppingCart = document.querySelector('.shopping-cart');
const cartItemsContainer = document.querySelector('.cart-items-container');
const totalPriceEl = document.querySelector('.total-price');
const cartCountBadge = document.getElementById('cart-count');

// =========================================
// 3. RENDER SYSTEM
// =========================================
function renderProducts(filter = 'all') {
    productList.innerHTML = '';
    productsData.forEach(product => {
        if (filter === 'all' || product.category === filter) {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.setAttribute('data-name', product.name.toLowerCase());
            
            // Gambar default jika error
            const imgSrc = product.img || 'https://via.placeholder.com/300?text=Joki+Game'; 
            
            card.innerHTML = `
                <img src="${imgSrc}" alt="${product.name}" class="card-img">
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <div class="card-price">Rp ${product.price.toLocaleString()}</div>
                    <button class="btn-add" onclick="addToCart('${product.name}', ${product.price}, '${imgSrc}')">
                        + Keranjang
                    </button>
                </div>`;
            productList.appendChild(card);
        }
    });
}
renderProducts();

// =========================================
// 4. FILTER & SEARCH
// =========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.category);
    };
});
searchBox.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        card.style.display = name.includes(term) ? 'flex' : 'none';
    });
});

// =========================================
// 5. KERANJANG
// =========================================
function toggleCart(show) {
    if(show) { shoppingCart.classList.add('active'); cartOverlay.classList.add('active'); } 
    else { shoppingCart.classList.remove('active'); cartOverlay.classList.remove('active'); }
}
cartBtn.onclick = (e) => { e.preventDefault(); toggleCart(true); };
closeCartBtn.onclick = () => toggleCart(false);
cartOverlay.onclick = () => toggleCart(false);

function addToCart(name, price, img) {
    const existing = cart.find(i => i.name === name);
    if(existing) existing.quantity++; else cart.push({ name, price, img, quantity: 1 });
    updateCartUI(); toggleCart(true);
}
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0, count = 0;
    if(cart.length === 0) cartItemsContainer.innerHTML = `<div class="empty-state"><i data-feather="shopping-bag" style="width:40px;height:40px;margin-bottom:10px;"></i><p>Keranjang kosong</p></div>`;
    cart.forEach((item, index) => {
        total += item.price * item.quantity; count += item.quantity;
        const el = document.createElement('div');
        el.classList.add('cart-item');
        el.innerHTML = `
            <img src="${item.img}" alt="img">
            <div class="cart-item-info"><h4>${item.name}</h4><p>Rp ${item.price.toLocaleString()} x ${item.quantity}</p></div>
            <i data-feather="trash-2" class="remove-item" onclick="removeItem(${index})"></i>`;
        cartItemsContainer.appendChild(el);
    });
    totalPriceEl.textContent = `Rp ${total.toLocaleString()}`;
    cartCountBadge.textContent = count;
    feather.replace();
}
function removeItem(idx) { cart.splice(idx, 1); updateCartUI(); }

// =========================================
// 6. CHECKOUT
// =========================================
window.checkoutWhatsApp = async () => {
    if (cart.length === 0) return alert('Keranjang kosong!');
    const btn = document.querySelector('.btn-checkout');
    btn.innerText = 'Memproses...'; btn.disabled = true;
    let total = 0; cart.forEach(i => total += i.price * i.quantity);
    try {
        const res = await fetch(backendUrl, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ items: cart, total: total, customerName: "User" })
        });
        const data = await res.json();
        window.snap.pay(data.token, {
            onSuccess: (res) => { resetBtn(); kirimWA(res.order_id, 'Lunas', res.payment_type); },
            onPending: (res) => { resetBtn(); kirimWA(res.order_id, 'Pending', '-'); },
            onError: () => { resetBtn(); alert('Gagal!'); },
            onClose: () => resetBtn()
        });
    } catch(e) { resetBtn(); alert('Gagal connect backend!'); }
};
function resetBtn() { const btn = document.querySelector('.btn-checkout'); btn.innerText = 'Checkout WhatsApp'; btn.disabled = false; }
function kirimWA(id, status, method) {
    let msg = `Halo Admin!\nOrder ID: ${id}\nStatus: ${status}\n\nItem:\n`;
    cart.forEach(i => msg += `- ${i.name} (${i.quantity}x)\n`);
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`);
    cart = []; updateCartUI(); toggleCart(false);
}

// =========================================
// 7. FEATURES: SLIDER, COUNTDOWN, NOTIF
// =========================================
// SLIDER
let slideIndex = 0;
function showSlides() {
    const slides = document.querySelectorAll('.slide');
    if(slides.length === 0) return; // Prevent error
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideIndex].classList.add('active');
}
function moveSlide(n) { slideIndex += n; showSlides(); }
setInterval(() => { slideIndex++; showSlides(); }, 5000); 

// COUNTDOWN
function updateTimer() {
    const timerEl = document.getElementById('timer');
    if(!timerEl) return;
    const now = new Date();
    const end = new Date(); end.setHours(23, 59, 59); 
    const diff = end - now;
    if(diff > 0) {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        timerEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
}
setInterval(updateTimer, 1000);

// LIVE NOTIFICATION (Menggunakan Gambar Unsplash yang Sama)
const buyers = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Rizky', 'Fajar', 'Gilang'];
const locs = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Bali', 'Makassar'];

const notifProducts = [
    { name: 'Joki Rank Epic', img: 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?q=80&w=100&auto=format&fit=crop' },
    { name: 'Paket Glory', img: 'https://images.unsplash.com/photo-1561883088-039e53143d73?q=80&w=100&auto=format&fit=crop' },
    { name: 'Joki Gendong', img: 'https://images.unsplash.com/photo-1592840496011-b58a2adcee97?q=80&w=100&auto=format&fit=crop' },
    { name: 'Classic WR', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=100&auto=format&fit=crop' }
];

function showNotif() {
    const notif = document.getElementById('live-notification');
    if(!notif) return;
    const name = buyers[Math.floor(Math.random()*buyers.length)];
    const loc = locs[Math.floor(Math.random()*locs.length)];
    const prod = notifProducts[Math.floor(Math.random()*notifProducts.length)]; 
    
    notif.innerHTML = `
        <img src="${prod.img}" class="notif-img">
        <div class="notif-text">
            <h4>${name} (${loc})</h4>
            <p>Beli ${prod.name}</p>
            <div class="notif-time">Baru saja</div>
        </div>`;
        
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 4000);
}
setTimeout(() => { showNotif(); setInterval(showNotif, 15000); }, 3000);

// TOOLS
window.hitungWR = () => {
    const tM = parseFloat(document.getElementById('tMatch').value);
    const tWr = parseFloat(document.getElementById('tWr').value);
    const target = parseFloat(document.getElementById('targetWr').value);
    const res = document.getElementById('hasil-wr');
    if(!tM || !tWr || !target) return;
    const sisa = (target * tM - 100 * (tM * (tWr/100))) / (100 - target);
    res.style.display = 'block';
    res.innerHTML = sisa > 0 ? `Butuh <b>${Math.ceil(sisa)} Win</b> (Tanpa Lose)` : 'Mustahil/Sudah Tercapai';
};
window.cekResi = () => {
    const id = document.getElementById('orderIdInput').value;
    const res = document.getElementById('hasil-lacak');
    if(!id) return;
    res.style.display = 'block'; res.innerHTML = `Status Order <b>${id}</b>: <span style="color:yellow">Sedang Diproses</span>`;
};