document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initModal();
    loadDynamicContent();
    initScrollAnimations();
});

// --- Scroll Reveal Animation ---
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
}

// --- Navigation ---
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            // Animate icons if needed
        });
    }
}

// --- Modal (Same logic, cleaner transition) ---
function initModal() {
    const openBtns = document.querySelectorAll('.open-booking-modal');
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('close-modal');
    
    if (!modal) return;

    const toggleModal = () => {
        const isHidden = modal.classList.contains('pointer-events-none');
        if (isHidden) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            modal.classList.add('opacity-0', 'pointer-events-none');
        }
    };

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal();
    }));

    if (closeBtn) closeBtn.addEventListener('click', toggleModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal();
    });
}

// --- Data Loading (Same Logic) ---
async function loadDynamicContent() {
    const path = window.location.pathname;
    
    if (path.includes('events.html')) loadJSON('data/events.json', renderEvents);
    if (path.includes('blogs.html')) loadJSON('data/blogs.json', renderBlogs);
    if (path.includes('locations.html')) loadJSON('data/locations.json', renderLocations);
    if (path.includes('gallery.html')) loadJSON('data/gallery.json', renderGallery);
    if (path.includes('faqs.html')) loadJSON('data/faqs.json', renderFAQs);
}

async function loadJSON(url, callback) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        callback(data);
    } catch (e) { console.error(e); }
}

// --- Renderers (Updated classes for new UI) ---

function renderEvents(data) {
    const container = document.getElementById('events-container');
    if (container) {
        container.innerHTML = data.map(event => `
            <div class="wf-card reveal">
                <div class="text-terra font-bold mb-2 uppercase tracking-wide text-sm">${event.date}</div>
                <h3 class="text-2xl mb-4 leading-tight">${event.title}</h3>
                <p class="mb-6 text-sm text-gray-600">${event.description}</p>
                <button class="border-b border-ink pb-1 hover:text-terra hover:border-terra transition-colors open-booking-modal">RSVP</button>
            </div>
        `).join('');
        initModal();
    }
}

function renderLocations(data) {
    const container = document.getElementById('locations-container');
    if (container) {
        container.innerHTML = data.map(loc => `
            <div class="flex flex-col md:flex-row border border-ink bg-white mb-8 reveal">
                <div class="w-full md:w-1/2 h-64 md:h-auto bg-gray-200 relative border-b md:border-b-0 md:border-r border-ink">
                    <img src="assets/images/placeholder-map.jpg" class="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500">
                </div>
                <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 class="text-3xl mb-2">${loc.name}</h2>
                    <p class="text-sm font-mono mb-4 text-gray-500">${loc.address}</p>
                    <p class="mb-6">${loc.description}</p>
                    <button class="btn-outline text-center open-booking-modal">Book Tour</button>
                </div>
            </div>
        `).join('');
        initModal();
    }
}

// ... (Other renderers follow same "wf-card" and border pattern)