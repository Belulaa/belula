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
    new Product({ id: "p2", name: "Monitor gamer Samsung Odyssey", description: "Monitor gamer 144hz samsung", price: 507999, imageUrl: "assets/img/samsung144.webp" }),
    new Product({ id: "p3", name: "Teclado mecánico Hyperx Origins", description: "Teclado gamer mecánico rgb", price: 129000, imageUrl: "assets/img/teclado.webp" }),
    new Product({ id: "p4", name: "Microprocesador Amd Ryzen 7 5700x", description: "3.0ghz Socket Am4", price: 480000.00, imageUrl: "assets/img/procesador.webp" }),
    new Product({ id: "p5", name: "Memoria RAM Trident Z 32GB (2x16)", description: "Memoria ram rgb marca gskill", price: 155333, imageUrl: "assets/img/ram.webp" }),
    new Product({ id: "p6", name: "Mouse Logitech G703 Wireless", description: "Lightspeed 12000dpi", price: 86333, imageUrl: "assets/img/mouse.webp" })
];

let cart = [];
let exchangeRates = {};
const API_URL = "https://api.exchangerate-api.com/v4/latest/ARS";

async function fetchExchangeRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        exchangeRates = data.rates;
    } catch (error) {
        showNotification("Error al obtener tasas de cambio.", "error");
    }
}

function convertPrice(priceInARS, currency) {
    if (!exchangeRates[currency]) {
        showNotification("Moneda no válida.", "error");
        return priceInARS;
    }
    return priceInARS * exchangeRates[currency];
}

function formatPrice(price, currency) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(price);
}

function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart) || [];
        } catch (error) {
            showNotification("Error al cargar el carrito.", "error");
        }
    }
}

function createCard({ id, name, description, price, imageUrl }) {
    const card = document.createElement("div");
    card.className = "card shadow p-3 mb-5 bg-body rounded";
    card.innerHTML = `
        <img src="${imageUrl}" alt="${name}" class="card-image">
        <h4>${name}</h4>
        <p>${description}</p>
        <div class="card-footer d-flex justify-content-between align-items-center">
            <span>${formatPrice(price, "ARS")}</span>
            <button class="btn btn-primary" onclick="addToCart('${id}')">Añadir</button>
        </div>
    `;
    return card;
}

function renderItemsWithCurrency(currency) {
    const productosGrid = document.getElementById("productos-grid");
    productosGrid.innerHTML = "";
    products.forEach(product => {
        const convertedPrice = convertPrice(product.price, currency);
        const card = createCard({ ...product, price: convertedPrice });
        productosGrid.appendChild(card);
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll("main > section");
    sections.forEach(section => section.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove("hidden");
    }
}

function showNotification(message, type = "info") {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    setTimeout(() => {
        notification.className = "notification hidden";
    }, 3000);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCartToLocalStorage();

    const cardElement = document.querySelector(`button[onclick="addToCart('${id}')"]`).closest(".card");
    if (cardElement) {
        cardElement.classList.add("added-to-cart");
        setTimeout(() => cardElement.classList.remove("added-to-cart"), 500);
    }

    showNotification(`Producto añadido: ${product.name}`);
}

function updateCartUI() {
    const cartCount = document.getElementById("carrito-count");
    const cartItems = document.getElementById("carrito-items");
    const cartTotal = document.getElementById("carrito-total");

    cartCount.textContent = cart.reduce((total, { quantity }) => total + quantity, 0);
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(({ id, name, price, quantity }) => {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p>${name} - ${formatPrice(price, "ARS")} x </p>
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

    cartTotal.textContent = formatPrice(total, "ARS");
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
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(id);
        }
        updateCartUI();
        saveCartToLocalStorage();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCartToLocalStorage();
}

function toggleTheme() {
    const body = document.body;
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    body.classList.toggle("bg-dark");
    body.classList.toggle("text-light");

    header.classList.toggle("bg-dark");
    header.classList.toggle("text-light");
    header.classList.toggle("bg-light", !header.classList.contains("bg-dark"));

    footer.classList.toggle("bg-dark");
    footer.classList.toggle("text-light");
    footer.classList.toggle("bg-light", !footer.classList.contains("bg-dark"));

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.textContent = body.classList.contains("bg-dark") ? "☀️" : "🌙";
}

document.addEventListener("DOMContentLoaded", async () => {
    loadCartFromLocalStorage();
    updateCartUI();
    await fetchExchangeRates();
    renderItemsWithCurrency("ARS");

    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute("href").substring(1);
            showSection(sectionId);
        });
    });

    document.getElementById("currency-selector").addEventListener("change", (e) => {
        const selectedCurrency = e.target.value;
        renderItemsWithCurrency(selectedCurrency);
    });

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        cart = [];
        updateCartUI();
        saveCartToLocalStorage();
    });

    showSection("home");
});