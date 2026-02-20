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

  // --- 4. BPIP Logic (Gating & Countdown Pendaftaran) ---
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const BPIP_OPEN_DATE = new Date('March 02, 2026 00:00:00').getTime();
    const BPIP_CLOSE_DATE = new Date('March 15, 2026 00:00:00').getTime();

    if (heroCtaBtn) {
        const updateBpipStatus = () => {
            const now = new Date().getTime();

            // 1. JIKA BELUM DIBUKA (Sebelum 2 Maret)
            if (now < BPIP_OPEN_DATE) {
                heroCtaBtn.innerText = "Dibuka 02 Maret";
                heroCtaBtn.style.opacity = "0.7";
                heroCtaBtn.style.cursor = "not-allowed";
            } 
            
            // 2. JIKA SEDANG DIBUKA (Antara 2 Maret - 15 Maret)
            else if (now >= BPIP_OPEN_DATE && now < BPIP_CLOSE_DATE) {
                const distance = BPIP_CLOSE_DATE - now;
                
                // Hitung mundur sederhana untuk tombol
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                heroCtaBtn.innerText = `Daftar Sekarang (Sisa ${days}h ${hours}j)`;
                heroCtaBtn.style.opacity = "1";
                heroCtaBtn.style.setProperty('background', '#2ecc71', 'important'); 
                heroCtaBtn.style.setProperty('border', '3px solid white', 'important');
                heroCtaBtn.style.color = "white";
                heroCtaBtn.style.cursor = "pointer";
                heroCtaBtn.style.boxShadow = "0 10px 20px rgba(46, 204, 113, 0.3)";
            } 
            
            // 3. JIKA SUDAH DITUTUP (Setelah 15 Maret)
            else {
                heroCtaBtn.innerText = "Pendaftaran Ditutup";
                heroCtaBtn.style.background = "#666";
                heroCtaBtn.style.opacity = "0.5";
                heroCtaBtn.style.cursor = "not-allowed";
                heroCtaBtn.style.pointerEvents = "none";
            }
        };

        // Jalankan tiap detik supaya countdown di tombol jalan
        setInterval(updateBpipStatus, 1000);
        updateBpipStatus();

        // Logika Klik
        heroCtaBtn.addEventListener('click', (e) => {
            const now = new Date().getTime();
            if (now < BPIP_OPEN_DATE) {
                e.preventDefault(); 
                alert('Sabar! Pendaftaran Resmi BPIP Belum Dibuka.\nSilakan Cek Kembali Pada Tanggal 02 Maret 2026.');
            } else if (now >= BPIP_CLOSE_DATE) {
                e.preventDefault();
                alert('Maaf, Pendaftaran Resmi BPIP sudah ditutup pada 15 Maret 2026.');
            }
        });
    }
    

 //// --- 5. Mobile Menu & Slider Logic (FIXED) ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // --- TAMBAHKAN INI (Auto-Close) ---
    const allLinks = document.querySelectorAll('.nav-links a');
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

    // LOGIKA SLIDER UNIVERSAL (Jalan untuk Roadshow & Produk)
    document.querySelectorAll('.gallery-container').forEach(container => {
        const grid = container.querySelector('.gallery-grid');
        const prev = container.querySelector('.prev-btn');
        const next = container.querySelector('.next-btn');

        if (grid && next && prev) {
            const handleSlide = (direction) => {
                // Menghitung lebar item secara otomatis agar pas di HP (85vw)
                const firstItem = grid.querySelector('.gallery-item');
                const scrollAmount = firstItem ? firstItem.offsetWidth + 15 : 350;
                const maxScroll = grid.scrollWidth - grid.clientWidth;

                if (direction === 'next') {
                    if (grid.scrollLeft >= maxScroll - 20) {
                        grid.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                } else {
                    if (grid.scrollLeft <= 20) {
                        grid.scrollTo({ left: maxScroll, behavior: 'smooth' });
                    } else {
                        grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    }
                }
            };

            next.addEventListener('click', () => handleSlide('next'));
            prev.addEventListener('click', () => handleSlide('prev'));
        }
    });
}); // <--- PENUTUP DOMContentLoaded (JANGAN DIHAPUS)

// --- 6. FUNGSI PRODUK (Wajib di luar agar bisa dipanggil HTML) ---
// Fungsi Pesan Langsung (dari tombol melayang)
function directOrder(name, price) {
    const waNumber = "6282228368042"; 
    const message = `Hai kak, saya mau pesen: *${name}* seharga Rp ${price}. Apakah stoknya masih tersedia?`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Fungsi Modal (Tetap aktif jika user klik bagian tengah gambar/overlay)
function showProduct(name, desc, price, img) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('modalPrice').innerText = "Rp " + price;
    document.getElementById('modalImg').src = img;
    
    const waNumber = "6282228368042";
    const message = `Hai kak, saya mau pesen: *${name}* (Rp ${price}). Mohon info detailnya.`;
    document.getElementById('waBtn').href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    modal.style.display = "flex";
}
// --- 7. Real-time Penilaian Display (REVISED FOR MOBILE) ---
if (typeof firebase !== 'undefined') {
    const db = firebase.database();
    const reviewContainer = document.getElementById('review-list');

    if (reviewContainer) {
        db.ref('penilaian').limitToLast(10).on('value', (snapshot) => {
            reviewContainer.innerHTML = ""; 
            
            const data = snapshot.val();
            if (data) {
                const keys = Object.keys(data);
                
                if (keys.length > 4) {
                    reviewContainer.style.maxHeight = "400px"; 
                    reviewContainer.style.overflowY = "auto";
                    reviewContainer.style.paddingRight = "10px";
                    reviewContainer.style.scrollbarWidth = "thin";
                }

                keys.reverse().forEach(key => {
                    const item = data[key];
                    
                    const card = document.createElement('div');
                    // Tambahkan transisi halus dan perbaikan padding
                    card.style.cssText = "background: rgba(255,255,255,0.05); padding: 18px; border-radius: 12px; border-left: 4px solid #e74c3c; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px;";
                    
                    let stars = "";
                    for(let i=0; i<5; i++) {
                        stars += `<i class="fas fa-star" style="color: ${i < item.rating ? '#f1c40f' : '#444'}; font-size: 0.85em; margin-right: 2px;"></i>`;
                    }

                    // STRUKTUR BARU: Memisahkan baris agar tidak tabrakan di HP
                    card.innerHTML = `
                        <div class="review-header" style="display: flex; flex-direction: column; gap: 2px;">
                            <strong style="color: #fff; font-size: 1em; line-height: 1.2;">
                                ${item.nama}
                            </strong>
                            <span style="color: #888; font-size: 0.8em; font-weight: normal;">
                                (${item.kategori === 'ppi' ? 'Akt ' + item.angkatan : 'Umum'})
                            </span>
                        </div>
                        <div style="margin: 2px 0;">${stars}</div>
                        <p style="color: #ddd; font-size: 0.9em; font-style: italic; margin: 5px 0; line-height: 1.4;">
                            "${item.pesan}"
                        </p>
                        <small style="color: #555; font-size: 0.75em; display: block; margin-top: 5px;">
                            ${item.waktu}
                        </small>
                    `;
                    reviewContainer.appendChild(card);
                });
            } else {
                reviewContainer.innerHTML = "<p style='color: #666; text-align: center;'>Belum ada penilaian.</p>";
            }
        });
    }
}

    // --- 8. Live Clock Logic ---
    const clockElement = document.getElementById('clock-data');
    if (clockElement) {
        const updateClock = () => {
            const now = new Date();
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const dayName = days[now.getDay()];
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            clockElement.innerText = `${dayName}, ${dateStr} | ${timeStr}`;
        };
        setInterval(updateClock, 1000);
        updateClock();
    }

    // --- 9. Kalkulasi Otomatis Rating & Total (Sinkron ke HTML) ---
if (typeof firebase !== 'undefined') {
    const db = firebase.database();
    const avgRatingEl = document.getElementById('avg-rating');
    const totalReviewsEl = document.getElementById('total-reviews');
    const avgStarsContainer = document.getElementById('avg-stars');

    // Set tampilan awal ke 0 sebelum data datang
    if (avgRatingEl) avgRatingEl.innerText = "0.0";
    if (totalReviewsEl) totalReviewsEl.innerText = "0";
    if (avgStarsContainer) avgStarsContainer.innerHTML = '<i class="far fa-star"></i>'.repeat(5);

    db.ref('penilaian').on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Jika data ada (tidak kosong)
        if (data) {
            const keys = Object.keys(data);
            const totalReviews = keys.length;
            let totalScore = 0;

            keys.forEach(key => {
                // Pastikan rating dikonversi ke angka
                totalScore += parseFloat(data[key].rating || 0);
            });

            const average = (totalScore / totalReviews).toFixed(1);

            // Update Angka
            if (avgRatingEl) avgRatingEl.innerText = average;
            if (totalReviewsEl) totalReviewsEl.innerText = totalReviews;

            // Update Bintang Visual
            if (avgStarsContainer) {
                let starHtml = "";
                const avgNum = parseFloat(average);
                
                for (let i = 1; i <= 5; i++) {
                    if (i <= Math.floor(avgNum)) {
                        starHtml += '<i class="fas fa-star"></i>'; // Bintang penuh
                    } else if (i === Math.ceil(avgNum) && avgNum % 1 >= 0.3) {
                        starHtml += '<i class="fas fa-star-half-alt"></i>'; // Bintang setengah
                    } else {
                        starHtml += '<i class="far fa-star"></i>'; // Bintang kosong
                    }
                }
                avgStarsContainer.innerHTML = starHtml;
            }
        } else {
            // Jika data benar-benar kosong di Firebase
            if (avgRatingEl) avgRatingEl.innerText = "0.0";
            if (totalReviewsEl) totalReviewsEl.innerText = "0";
            if (avgStarsContainer) avgStarsContainer.innerHTML = '<i class="far fa-star"></i>'.repeat(5);
        }
    });
}
