// --- GESTOR AUTOMÁTICO DE IMÁGENES ---
const seishoImages = {
    heroBanner: "img/banner-inicio.jpg",
    historiaImg: "img/historia.jpg",
    menuBanner: "img/banner-menu.jpg",
    conocenosBg: "img/conocenos-bg.jpg",
    chefImg: "img/chef.jpg",
    Omakase: "img/plato-omakase.jpg",
    mapaUbicacion: "img/mapa-ubicacion.jpg"
};

// Función que inyecta automáticamente las imágenes de forma óptima
function loadDynamicImages() {
    // 1. Banner Principal Inicio
    const hero = document.querySelector('.hero-banner');
    if (hero) {
        hero.style.backgroundImage = `linear-gradient(rgba(44, 42, 41, 0.35), rgba(44, 42, 41, 0.35)), url('${seishoImages.heroBanner}')`;
    }

    // 2. Imagen de Nuestra Historia
    const historia = document.querySelector('.split-img');
    if (historia) {
        historia.style.backgroundImage = `url('${seishoImages.historiaImg}')`;
    }

    // 3. Banner Detrás del Sabor
    const menuBg = document.querySelector('.menu-banner-bg');
    if (menuBg) {
        menuBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('${seishoImages.menuBanner}')`;
    }

    // 4. Fondos de Conócenos
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero) {
        aboutHero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${seishoImages.conocenosBg}')`;
    }

    const chefImg = document.querySelector('.vertical-img-placeholder');
    if (chefImg) {
        chefImg.style.backgroundImage = `url('${seishoImages.chefImg}')`;
    }
}

// Navegación fluida y gestión de eventos
function switchSection(targetId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active-section'));

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === targetId) {
            link.classList.add('active');
        }
    });

    const mainNav = document.querySelector('.main-nav');
    if (mainNav) mainNav.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar imágenes automáticamente al iniciar
    loadDynamicImages();
    
    // Configurar enlaces del menú
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            switchSection(target);
        });
    });

    // Menú hamburguesa móvil
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }

    // Alerta simulada para reservas
    const resForm = document.getElementById('resForm');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Reserva registrada con éxito en Seisho Sushi! Te esperamos.');
            resForm.reset();
        });
    }

    // Alerta simulada para contactos
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            alert('¡Gracias por tus comentarios! Hemos recibido tu mensaje.');
            contactForm.reset();
        });
    }

    // Valoración con estrellas
    const stars = document.querySelectorAll('#ratingStars span');
    const ratingInput = document.getElementById('selectedRating');

    if (stars.length > 0) {
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                if (ratingInput) ratingInput.value = value;

                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.style.color = 'var(--rose-dark)';
                    } else {
                        s.style.color = '#ccc';
                    }
                });
            });
        });
    }
});

// --- LÓGICA DEL CARRITO DE COMPRAS FLOTANTE ---
let carrito = [];

// Abre o cierra el carrito flotante
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) {
        console.error("No se encontró el elemento #cartModal en el HTML");
        return;
    }

    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderizarCarrito();
    }
}

// Cierra el carrito al hacer clic fuera del recuadro (celulares/tablets/PC)
function cerrarConClickAfuera(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Cierra el carrito al presionar la tecla ESC en el teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('cartModal');
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }
});

// Agrega productos al carrito
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.name === nombre);
    if (productoExistente) {
        productoExistente.quantity += 1;
    } else {
        carrito.push({ name: nombre, price: precio, quantity: 1 });
    }
    renderizarCarrito();
    toggleCart(); // Abre automáticamente el carrito al agregar
}

// Aumenta o disminuye la cantidad (+ / -)
function cambiarCantidad(index, cambio) {
    carrito[index].quantity += cambio;
    if (carrito[index].quantity <= 0) {
        carrito.splice(index, 1);
    }
    renderizarCarrito();
}

// Elimina un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

// Dibuja los productos dentro del modal
function renderizarCarrito() {
    const contenedor = document.getElementById('cartItemsContainer');
    const totalSpan = document.getElementById('cartTotalPrice');

    if (!contenedor || !totalSpan) return;
    
    contenedor.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 2rem 0;">Tu carrito está vacío.</p>';
        totalSpan.textContent = '$0';
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        const fila = document.createElement('div');
        fila.className = 'cart-item-row';
        fila.style.cssText = "display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 12px; border-radius: 4px; margin-bottom: 10px; border: 1px solid var(--border-color);";
        fila.innerHTML = `
            <div class="cart-item-info" style="flex: 1;">
                <h5 style="margin: 0; font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main);">${item.name}</h5>
                <p style="margin: 2px 0 0 0; font-size: 0.85rem; color: var(--text-muted);">$${item.price.toLocaleString('es-CL')} c/u</p>
            </div>

            <!-- Controles de Cantidad (+ y -) -->
            <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" onclick="cambiarCantidad(${index}, -1)" style="background: var(--white); border: 1px solid var(--border-color); width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                <span style="font-size: 0.95rem; font-weight: 500; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button type="button" onclick="cambiarCantidad(${index}, 1)" style="background: var(--white); border: 1px solid var(--border-color); width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
            </div>
        `;
        contenedor.appendChild(fila);
    });

    totalSpan.textContent = `$${total.toLocaleString('es-CL')}`;
}

// Simular la finalización de compra
function finalizarCompra(event) {
    event.preventDefault();
    if (carrito.length === 0) {
        alert('Agrega al menos un producto al carrito antes de realizar el pedido.');
        return;
    }
    alert('¡Pedido realizado con éxito! Te contactaremos pronto.');
    carrito = [];
    renderizarCarrito();
    toggleCart();
}

// --- FUNCIONES PARA EL VISOR DE CARTAS 9:16 ---

function abrirCartaModal(rutaImagen) {
    const modal = document.getElementById('cartaModal');
    const imgContainer = document.getElementById('imgCartaAmpliada');
    
    if (modal && imgContainer) {
        imgContainer.src = rutaImagen;
        modal.style.display = 'flex';
    }
}

function cerrarCartaModal(event) {
    const modal = document.getElementById('cartaModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function cerrarCartaModalDirecto() {
    const modal = document.getElementById('cartaModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Permitir cerrar el visor de cartas con la tecla ESC también
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modalCarta = document.getElementById('cartaModal');
        if (modalCarta && modalCarta.style.display === 'flex') {
            modalCarta.style.display = 'none';
        }
    }
});
