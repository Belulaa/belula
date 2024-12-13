class Product {
    constructor({ id, name, description, price, imageUrl }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}

const products = [
    new Product({ id: "p1", name: "Joystick inalámbrico Xbox Negro", description: "Joystick xbox", price: 438232, imageUrl: "assets/img/Joystick.webp" }),
    new Product({ id: "p2", name: "Monitor gamer Samsung Odyssey", description: "Monitor gamer 144hz samsung", price: 507999.99, imageUrl: "assets/img/samsung144.webp" }),
    new Product({ id: "p3", name: "Teclado mecánico Hyperx Origins", description: "Teclado gamer mecánanico rgb", price: 129.99, imageUrl: "assets/img/teclado.webp" }),
    new Product({ id: "p4", name: "Microprocesador Amd Ryzen 7 5700x", description: "3.0ghz Socket Am4", price: 480000.00, imageUrl: "assets/img/procesador.webp" }),
    new Product({ id: "p5", name: "Memoria RAM Trident Z 32GB (2x16)", description: "Memoria ram rgb marca gskill", price: 155333.99, imageUrl: "assets/img/ram.webp" }),
    new Product({ id: "p6", name: "Mouse Logitech G703 Wireless", description: "Lightspeed 12000dpi", price: 86333.99, imageUrl: "assets/img/mouse.webp" })
];

let cart = [];

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function createCard({ id, name, description, price, imageUrl }, isProduct) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}" class="card-image">
        <h4>${name}</h4>
        <p>${description}</p>
        <div class="card-footer">
            <span>$${price.toFixed(2)}</span>
            <button onclick="addToCart('${id}', ${isProduct})">
                Añadir al carrito
            </button>
        </div>
    `;
    return card;
}

function renderItems() {
    const productosGrid = document.getElementById('productos-grid');
    products.forEach(product => {
        productosGrid.appendChild(createCard(product, true));
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 3000);
}

function addToCart(id, isProduct) {
    const items = isProduct ? products : [];
    const item = items.find(i => i.id === id);

    if (item) {
        const { name } = item;
        const existingItem = cart.find(i => i.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
            console.log(`Añadido al carrito: ${name}`);
        }
        updateCartUI();
        saveCartToLocalStorage();
        showNotification(`Producto añadido: ${name}`);

        const cardElement = document.querySelector(`button[onclick="addToCart('${id}', ${isProduct})"]`).closest('.card');
        cardElement.classList.add('added-to-cart');
        setTimeout(() => cardElement.classList.remove('added-to-cart'), 1000);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('carrito-count');
    const cartItems = document.getElementById('carrito-items');
    const cartTotal = document.getElementById('carrito-total');

    cartCount.textContent = cart.reduce((total, { quantity }) => total + quantity, 0);

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(({ id, name, price, quantity }) => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p>${name} - $${price.toFixed(2)} x </p>
                <div>
                    <button onclick="decreaseQuantity('${id}')">-</button>
                    <span>${quantity}</span>
                    <button onclick="increaseQuantity('${id}')">+</button>
                </div>
                <button onclick="removeFromCart('${id}')">Eliminar</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        total += price * quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function increaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
        updateCartUI();
        saveCartToLocalStorage();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
    saveCartToLocalStorage();
}

function removeFromCart(id) {
    if (confirm("¿Estás seguro de eliminar este producto del carrito?")) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        saveCartToLocalStorage();
    }
}

function vaciarCarrito() {
    cart = [];
    saveCartToLocalStorage();
    console.log("Vaciaste el carrito");
    updateCartUI();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const storedCart = localStorage.getItem('cart');
    try {
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
                updateCartUI();
            } else {
                console.warn("Formato de carrito inválido en localStorage.");
            }
        }
    } catch (e) {
        console.error("Error al parsear el carrito de localStorage:", e);
    }

    renderItems();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    showSection('home');
});