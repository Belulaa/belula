class Product {
    constructor(id, name, description, price, imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}

const products = [
    new Product("p1", "Joystick inalámbrico Xbox Negro", "Joystick xbox", 438232, "assets/img/Joystick.webp"),
    new Product ( "p2", "Monitor gamer Samsung Odyssey", "Monitor gamer 144hz samsung", 507999.99, "assets/img/samsung144.webp"),
    new Product ( "p3", "Teclado mecánico Hyperx Origins", "Teclado gamer mecánanico rgb", 129.99, "assets/img/teclado.webp"),
    new Product ( "p4", "Microprocesador Amd Ryzen 7 5700x", "3.0ghz Socket Am4", 480000.00, "assets/img/procesador.webp"),
    new Product( "p5", "Memoria RAM Trident Z 32GB (2x16)", "Memoria ram rgb marca gskill", 155333.99, "assets/img/ram.webp"),
    new Product( "p6", "Mouse Logitech G703 Wireless", "Lightspeed 12000dpi", 86333.99, "assets/img/mouse.webp"),
];

let cart = [];

function createCard(item, isProduct) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="card-image">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="card-footer">
            <span>$${item.price.toFixed(2)}</span>
            <button onclick="addToCart('${item.id}', ${isProduct})">
                ${isProduct ? 'Añadir al carrito' : 'Contratar servicio'}
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

function addToCart(id, isProduct) {
    const items = isProduct ? products : [];
    const item = items.find(i => i.id === id);
    if (item) {
        const existingItem = cart.find(i => i.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
            console.log(`Añadido al carrito: ${item.name}`);
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('carrito-count');
    const cartItems = document.getElementById('carrito-items');
    const cartTotal = document.getElementById('carrito-total');

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Eliminar</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

function vaciarCarrito() {
    cart = [];
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