// --- 0. Konfigurasi Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyCtQh5SpZCk2TDUk9iMOjQX5uc6gRIJyp8",
    authDomain: "paskab-c3eb4.firebaseapp.com",
    databaseURL: "https://paskab-c3eb4-default-rtdb.firebaseio.com",
    projectId: "paskab-c3eb4",
    storageBucket: "paskab-c3eb4.firebasestorage.app",
    messagingSenderId: "630872087747",
    appId: "1:630872087747:web:dbe8eee722f2d0f6759676"
};

// Inisialisasi Firebase Global
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Live Views Logic (Nambah Terus Tiap Refresh) ---
if (typeof firebase !== 'undefined') {
    const db = firebase.database();
    const visitRef = db.ref('visitor_stats/total_calls');
    const counterElement = document.getElementById('main-visit-count');

    if (counterElement) {
        // PAKSA NAMBAH: Tidak pakai pengecekan localStorage/sessionStorage
        // Setiap kali script ini jalan (refresh/buka tab), Firebase +1
        visitRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        });

        // Sinkronisasi Realtime antar Device
        visitRef.on('value', (snapshot) => {
            const count = snapshot.val();
            if (count !== null) {
                // Update teks angka
                counterElement.innerText = count.toLocaleString('id-ID');

                // Efek visual biar kelihatan kalau ada yang baru masuk
                counterElement.style.color = "#e74c3c";
                counterElement.style.transform = "scale(1.2)";
                
                setTimeout(() => { 
                    counterElement.style.color = ""; 
                    counterElement.style.transform = "scale(1)";
                }, 500);
            }
        });
    }
}

    // --- 2. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        revealElements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 3. Countdown Logic (Pendaftaran Bukber) ---
    const targetDate = new Date('February 25, 2026 23:59:00').getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');
        const countdownBtn = document.getElementById('countdown-btn');
        const countdownSection = document.getElementById('daftar');

        if (distance < 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
            
            if (countdownBtn) {
                countdownBtn.innerText = "Pendaftaran Ditutup";
                countdownBtn.style.background = "#666"; 
                countdownBtn.style.color = "#aaa";
                countdownBtn.style.cursor = "not-allowed";
                countdownBtn.style.pointerEvents = "none";
                countdownBtn.setAttribute("href", "#");
            }
            if (countdownSection) {
                countdownSection.style.filter = "grayscale(0.8)";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days < 10 ? `0${days}` : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
        if (minsEl) minsEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
        if (secsEl) secsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
    };

    setInterval(updateTimer, 1000);
    updateTimer();

    // --- 4. BPIP Logic (Gating Tanggal 02 Maret) ---
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const BPIP_OPEN_DATE = new Date('March 02, 2026 00:00:00').getTime();

    if (heroCtaBtn) {
        const checkCtaStatus = () => {
            const now = new Date().getTime();
            if (now < BPIP_OPEN_DATE) {
                heroCtaBtn.style.opacity = "0.7";
                heroCtaBtn.style.cursor = "default";
                heroCtaBtn.title = "Akan dibuka pada 02 Maret 2026";
            } else {
                heroCtaBtn.style.opacity = "1";
                heroCtaBtn.style.setProperty('background', '#2ecc71', 'important'); 
                heroCtaBtn.style.setProperty('border', '3px solid white', 'important');
                heroCtaBtn.style.color = "white";
                heroCtaBtn.style.cursor = "pointer";
                heroCtaBtn.style.boxShadow = "0 10px 20px rgba(46, 204, 113, 0.3)";
            }
        };
        checkCtaStatus();

        heroCtaBtn.addEventListener('click', (e) => {
            const now = new Date().getTime();
            if (now < BPIP_OPEN_DATE) {
                e.preventDefault(); 
                alert('Sabar bjier! Pendaftaran Resmi BPIP Belum Dibuka.\nSilakan Cek Kembali Pada Tanggal 02 Maret 2026.');
            }
        });
    }

    // --- 5. Mobile Menu & Slider Logic (INFINITE LOOP) ---
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-links a');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

allNavLinks.forEach(link => {
    link.addEventListener('click', () => { navLinks.classList.remove('active'); });
});

// LOGIKA SLIDER NGELOOP
const galleryGrid = document.querySelector('.gallery-grid');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (galleryGrid && nextBtn && prevBtn) {
    const handleSlide = (direction) => {
        const scrollAmount = 350;
        const maxScroll = galleryGrid.scrollWidth - galleryGrid.clientWidth;
        
        if (direction === 'next') {
            // Jika sudah di ujung, balik ke 0
            if (galleryGrid.scrollLeft >= maxScroll - 10) {
                galleryGrid.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                galleryGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        } else {
            // Jika di awal, balik ke ujung
            if (galleryGrid.scrollLeft <= 10) {
                galleryGrid.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                galleryGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
    };

    nextBtn.addEventListener('click', () => handleSlide('next'));
    prevBtn.addEventListener('click', () => handleSlide('prev'));
}
});
