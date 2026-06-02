// ==========================================================================
// 0. CONFIGURASI UTAMA FIREBASE
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyCtQh5SpZCk2TDUk9iMOjQX5uc6gRIJyp8",
    authDomain: "paskab-c3eb4.firebaseapp.com",
    databaseURL: "https://paskab-c3eb4-default-rtdb.firebaseio.com",
    projectId: "paskab-c3eb4",
    storageBucket: "paskab-c3eb4.firebasestorage.app",
    messagingSenderId: "630872087747",
    appId: "1:630872087747:web:dbe8eee722f2d0f6759676"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const PATH_USERS = "pendaftaran_vote"; 
const PATH_LEADERBOARD = "penilaian_vote/leaderboard";
const PATH_SETTINGS = "penilaian_vote/settings";

// Generator 4 Karakter Acak
function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Kompres Gambar Otomatis ke Rasio Pasfoto 3:4 (300x400px)
function compressAndResizePhoto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const targetWidth = 300;
                const targetHeight = 400;
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                
                let srcX = 0, srcY = 0, srcWidth = img.width, srcHeight = img.height;
                const imgRatio = img.width / img.height;
                const targetRatio = targetWidth / targetHeight;
                
                if (imgRatio > targetRatio) {
                    srcWidth = img.height * targetRatio;
                    srcX = (img.width - srcWidth) / 2;
                } else if (imgRatio < targetRatio) {
                    srcHeight = img.width / targetRatio;
                    srcY = (img.height - srcHeight) / 2;
                }
                
                ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, targetWidth, targetHeight);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = err => reject(err);
        };
        reader.onerror = err => reject(err);
    });
}

// Auto Download Bukti JPG Resmi
function downloadBuktiFile(nama, kode, dataObj) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 780;
    
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('BUKTI PENDAFTARAN RESMI', canvas.width / 2, 60);
    
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('KAMPANYE & KOMPETISI VOTE', canvas.width / 2, 90);
    
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('------------------------------------------------', canvas.width / 2, 130);
    
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    
    const startX = 60;
    ctx.fillText(`Nama Lengkap   :  ${nama}`, startX, 180);
    ctx.fillText(`Gender                 :  ${dataObj.gender === 'COWO' ? 'PUTRA (COWO)' : 'PUTRI (CEWE)'}`, startX, 230);
    ctx.fillText(`Asal Sekolah     :  ${dataObj.sekolah}`, startX, 280);
    ctx.fillText(`Nomor HP/WA    :  ${dataObj.no_hp}`, startX, 330);
    ctx.fillText(`Email                   :  ${dataObj.email}`, startX, 380);
    ctx.fillText(`Instagram          :  @${dataObj.username_ig}`, startX, 430);
    
    const ShortVideoLink = dataObj.link_video.length > 35 ? dataObj.link_video.substring(0, 35) + '...' : dataObj.link_video;
    ctx.fillText(`Link Video         :  ${ShortVideoLink}`, startX, 480);
    
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('------------------------------------------------', canvas.width / 2, 520);
    
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(80, 550, canvas.width - 160, 110);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 550, canvas.width - 160, 110);
    
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.fillText('KODE AKSES UNTUK EDIT DATA (RAHASIA)', canvas.width / 2, 580);
    
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 42px monospace';
    ctx.fillText(kode, canvas.width / 2, 635);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('*Simpan gambar ini di galeri hp kamu sebagai bukti sah.', canvas.width / 2, 700);
    ctx.fillText('Jangan membagikan kode akses kepada siapa pun.', canvas.width / 2, 725);
    
    const dataURL = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `BUKTI_${nama.replace(/\s+/g, '_')}_${kode}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Efek ledakan partikel perayaan megah
function popCelebrationBalloon() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#eab308', '#ef4444', '#3b82f6', '#10b981', '#f472b6', '#ffffff'];
    for (let i = 0; i < 75; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = -20 + 'px';
        const size = Math.random() * 9 + 6;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 1.5 + 1.0) + 's';
        p.style.animationDelay = (Math.random() * 0.4) + 's';
        container.appendChild(p);
        setTimeout(() => p.remove(), 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. SISI REGISTER (register.html)
    // ==========================================================================
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('reg-foto');
            const genderInput = document.getElementById('reg-gender'); 
            
            if (!fileInput || fileInput.files.length === 0) return alert("Pilih file foto terlebih dahulu!");
            if (!genderInput || !genderInput.value) return alert("Silakan tentukan Kategori Gender!");
            
            const file = fileInput.files[0];
            if (!file.type.match('image.*')) return alert("File wajib berupa gambar!");

            try {
                const compressedBase64 = await compressAndResizePhoto(file);
                const kodeAcak = generateRandomCode();
                
                const dataPayload = {
                    nama: document.getElementById('reg-nama').value,
                    gender: genderInput.value, 
                    sekolah: document.getElementById('reg-sekolah').value,
                    no_hp: document.getElementById('reg-nohp').value,
                    email: document.getElementById('reg-email').value,
                    username_ig: document.getElementById('reg-ig').value.replace('@', ''),
                    link_video: document.getElementById('reg-video').value,
                    foto: compressedBase64,
                    kode_akses: kodeAcak
                };

                const newUserRef = db.ref(PATH_USERS).push();
                dataPayload.uid = newUserRef.key;

                newUserRef.set(dataPayload).then(() => {
                    downloadBuktiFile(dataPayload.nama, kodeAcak, dataPayload);
                    alert(`Pendaftaran Sukses!\n\nKODE AKSES KAMU: ${kodeAcak}`);
                    registerForm.reset();
                });
            } catch (error) {
                alert("Gagal memproses pendaftaran: " + error.message);
            }
        });
    }

    // ==========================================================================
    // 2. SISI EDIT DATA MANDIRI (edit.html)
    // ==========================================================================
    const authForm = document.getElementById('edit-auth-form');
    const authSection = document.getElementById('auth-section');
    const formSection = document.getElementById('form-section');
    const editDataForm = document.getElementById('edit-data-form');
    let currentBase64Foto = ""; 

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const kodeInput = document.getElementById('auth-code').value.toUpperCase().trim();

            db.ref(PATH_USERS).orderByChild('kode_akses').equalTo(kodeInput).once('value', (snapshot) => {
                const userData = snapshot.val();
                
                if (userData) {
                    const key = Object.keys(userData)[0];
                    const user = userData[key];

                    document.getElementById('edit-uid').value = user.uid;
                    document.getElementById('edit-nama').value = user.nama;
                    if(document.getElementById('edit-gender')) document.getElementById('edit-gender').value = user.gender || "COWO";
                    document.getElementById('edit-sekolah').value = user.sekolah;
                    document.getElementById('edit-nohp').value = user.no_hp;
                    document.getElementById('edit-email').value = user.email;
                    document.getElementById('edit-ig').value = user.username_ig;
                    document.getElementById('edit-video').value = user.link_video;
                    document.getElementById('edit-kode-baru').value = user.kode_akses;
                    
                    currentBase64Foto = user.foto;

                    authSection.classList.add('hidden');
                    formSection.classList.remove('hidden');
                } else {
                    alert("KODE AKSES TIDAK VALID!");
                }
            });
        });
    }

    if (editDataForm) {
        editDataForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const uid = document.getElementById('edit-uid').value;
            const kodeBaru = document.getElementById('edit-kode-baru').value.toUpperCase().trim();
            const fileInput = document.getElementById('edit-foto');

            if(kodeBaru.length !== 4) return alert("Kode wajib berukuran 4 digit!");

            let fotoFinal = currentBase64Foto;
            if (fileInput.files.length > 0) {
                fotoFinal = await compressAndResizePhoto(fileInput.files[0]);
            }

            const updatedPayload = {
                uid: uid,
                nama: document.getElementById('edit-nama').value,
                gender: document.getElementById('edit-gender') ? document.getElementById('edit-gender').value : "COWO",
                sekolah: document.getElementById('edit-sekolah').value,
                no_hp: document.getElementById('edit-nohp').value,
                email: document.getElementById('edit-email').value,
                username_ig: document.getElementById('edit-ig').value.replace('@', ''),
                link_video: document.getElementById('edit-video').value,
                foto: fotoFinal,
                kode_akses: kodeBaru
            };

            db.ref(`${PATH_USERS}/${uid}`).update(updatedPayload).then(() => {
                downloadBuktiFile(updatedPayload.nama, kodeBaru, updatedPayload);
                alert(`Data Berhasil Diperbarui!`);
                window.location.reload();
            });
        });
    }

// ==========================================================================
    // 3. SISI DASHBOARD ADMIN (admin.html) - INTEGRATED SEARCH & CRUD REMOVE PROTECTED
    // ==========================================================================
    const adminDropdownUser = document.getElementById('admin-user-pilihan');
    const fullUserTable = document.getElementById('full-user-table');
    const adminFormSkor = document.getElementById('admin-form-skor');
    const adminLiveMonitor = document.getElementById('admin-live-monitor');
    const adminCariAnggota = document.getElementById('admin-cari-anggota'); // Input Pencarian

    let localCachedUsers = {}; // Menyimpan data user untuk keperluan pencarian offline/lokal

    if (adminDropdownUser || fullUserTable || adminLiveMonitor) {
        // Ambil data secara real-time dari Firebase
        db.ref(PATH_USERS).on('value', (snapshot) => {
            const users = snapshot.val() || {};
            localCachedUsers = users; // Simpan ke cache lokal
            
            // Render Dropdown Utama Peserta
            if (adminDropdownUser) {
                adminDropdownUser.innerHTML = '<option value="">-- Cari & Pilih Peserta --</option>';
                Object.keys(users).forEach(key => {
                    const genderBadge = users[key].gender === 'COWO' ? '♂ PUTRA' : '♀ PUTRI';
                    adminDropdownUser.innerHTML += `<option value="${users[key].uid}">[${genderBadge}] ${users[key].nama}</option>`;
                });
            }

            // Render Tabel Utama dengan Callback bawaan data awal
            renderUserTable(users);

            // Render komponen pemenang live monitor
            if (adminLiveMonitor) {
                renderAdminLiveMonitor(users);
            }
        });
    }

    // Fungsi Render Baris Tabel Anggota (Mendukung Fitur Live Search & CRUD Action)
    function renderUserTable(usersData) {
        if (!fullUserTable) return;
        fullUserTable.innerHTML = '';
        
        let index = 1;
        const keys = Object.keys(usersData);
        
        if (keys.length === 0) {
            fullUserTable.innerHTML = `<tr><td colspan="10" class="px-4 py-8 text-center text-gray-500 italic text-xs">Tidak ada data anggota ditemukan.</td></tr>`;
            return;
        }

        keys.forEach(key => {
            const u = usersData[key];
            const genderLabel = u.gender === 'COWO' ? '<span class="text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded text-xs font-bold">PUTRA</span>' : '<span class="text-pink-400 bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded text-xs font-bold">PUTRI</span>';
            
            fullUserTable.innerHTML += `
                <tr class="border-b border-gray-700 hover:bg-gray-700/30 transition">
                    <td class="px-4 py-3 font-semibold text-gray-500 text-center">${index++}</td>
                    <td class="px-4 py-3 flex justify-center"><img src="${u.foto}" class="w-12 h-16 object-cover rounded-lg border border-gray-600 bg-gray-900 shadow-md"></td>
                    <td class="px-4 py-3 font-bold text-white">${u.nama}</td>
                    <td class="px-4 py-3 text-center">${genderLabel}</td>
                    <td class="px-4 py-3 text-gray-400">${u.sekolah}</td>
                    <td class="px-4 py-3 text-sm text-green-400 font-mono">${u.no_hp}</td>
                    <td class="px-4 py-3 font-medium text-red-400">@${u.username_ig}</td>
                    <td class="px-4 py-3 font-mono text-yellow-400 font-bold text-center">${u.kode_akses}</td>
                    <td class="px-4 py-3 text-center"><a href="${u.link_video}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs font-bold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20 transition">Buka</a></td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="hapusAnggotaTerproteksi('${u.uid}', '${u.nama.replace(/'/g, "\\'")}')" class="bg-red-600/20 border border-red-500/40 hover:bg-red-600 hover:text-white text-red-400 text-xs py-1 px-2.5 rounded-md font-bold transition cursor-pointer">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // LISTENER INPUT KEYUP: Real-time Live Search Engine
    if (adminCariAnggota) {
        adminCariAnggota.addEventListener('input', function() {
            const keyword = this.value.toLowerCase().trim();
            const filteredUsers = {};

            Object.keys(localCachedUsers).forEach(key => {
                const user = localCachedUsers[key];
                const namaCocok = user.nama && user.nama.toLowerCase().includes(keyword);
                const sekolahCocok = user.sekolah && user.sekolah.toLowerCase().includes(keyword);
                
                if (namaCocok || sekolahCocok) {
                    filteredUsers[key] = user;
                }
            });

            renderUserTable(filteredUsers);
        });
    }

    // LOGIKA CRUD DELETE: Verifikasi Keamanan 2 Tingkat Nama Developer
    window.hapusAnggotaTerproteksi = function(uid, namaUser) {
        const DEVELOPER_NAME = "Aditya Putra";
        
        // Verifikasi Tingkat 1: Konfirmasi Awal Umum
        if (!confirm(`Peringatan Krisis!\nApakah Anda benar-benar ingin MENGHAPUS permanen anggota bernama "${namaUser}"?`)) {
            return;
        }

        // Verifikasi Tingkat 2: Input Manual Nama Lengkap Developer
        const verifikasiNamaDev = prompt(`PROSES AMANKAN DATABASES:\nUntuk melanjutkan penghapusan, masukkan NAMA LENGKAP DEVELOPER sistem ini sebagai otorisasi khusus:`);
        
        if (verifikasiNamaDev === DEVELOPER_NAME) {
            // Eksekusi hapus target uid dari node database users pendaftar
            db.ref(`${PATH_USERS}/${uid}`).remove()
                .then(() => {
                    alert(`Sukses CRUD! Data pendaftar "${namaUser}" berhasil dibersihkan dari server.`);
                })
                .catch((error) => {
                    alert(`Gagal menghapus data: ${error.message}`);
                });
        } else {
            alert(`Otorisasi Ditolak! Nama developer yang Anda masukkan salah atau tidak terdaftar. Data "${namaUser}" tetap aman.`);
        }
    };

    // Fungsi Pembaca Real-time Skor Teratas Khusus Sisi Admin
    function renderAdminLiveMonitor(users) {
        const daftarKategori = [
            'top_view_cowo', 'top_view_cewe', 
            'top_like_cowo', 'top_like_cewe',
            'top_komen_cowo', 'top_komen_cewe',
            'top_share_cowo', 'top_share_cewe',
            'top_repost_cowo', 'top_repost_cewe'
        ];

        db.ref(PATH_LEADERBOARD).on('value', (snapshot) => {
            const leaderboardData = snapshot.val() || {};
            if (adminLiveMonitor) adminLiveMonitor.innerHTML = ''; 

            daftarKategori.forEach(kat => {
                const dataSkor = leaderboardData[kat];
                let namaPemenang = "Belum Ada Data";
                let skorPemenang = 0;
                let fotoPemenang = "";

                if (dataSkor && dataSkor.user_id && users[dataSkor.user_id]) {
                    namaPemenang = users[dataSkor.user_id].nama;
                    skorPemenang = dataSkor.jumlah;
                    fotoPemenang = users[dataSkor.user_id].foto;
                }

                const cleanLabel = kat.replace('_cowo',' COWO').replace('_cewe',' CEWE').replace('top_','TOP ').toUpperCase();
                const isCowo = kat.includes('_cowo');
                const borderColor = isCowo ? 'border-blue-500/30 bg-blue-500/5' : 'border-pink-500/30 bg-pink-500/5';

                if (adminLiveMonitor) {
                    adminLiveMonitor.innerHTML += `
                        <div class="p-3 rounded-xl border ${borderColor} text-center flex flex-col items-center bg-gray-800/30">
                            <span class="text-[9px] font-black tracking-wider block text-gray-400 mb-2 uppercase">${cleanLabel}</span>
                            ${fotoPemenang ? `<img src="${fotoPemenang}" class="w-10 h-14 object-cover rounded border border-gray-600 mb-1.5 shadow-md">` : `<div class="w-10 h-14 bg-gray-900 rounded border border-gray-700 flex items-center justify-center mb-1.5"><i class="fas fa-user-slash text-gray-600 text-xs"></i></div>`}
                            <h4 class="text-[11px] font-bold text-white truncate w-full max-w-[120px]">${namaPemenang}</h4>
                            <span class="text-xs font-mono font-black text-yellow-400">${skorPemenang.toLocaleString('id-ID')}</span>
                        </div>
                    `;
                }
            });
        });
    }

    // LOGIKA SELEKTOR UTAMA BUTTON: Kunci Semua & Buka Semua Kategori
    const btnLockAll = document.getElementById('btn-lock-all');
    const btnUnlockAll = document.getElementById('btn-unlock-all');

    if (btnLockAll && btnUnlockAll) {
        const listKunciGembok = [
            'is_locked_view_cowo', 'is_locked_view_cewe', 'is_locked_like_cowo', 'is_locked_like_cewe',
            'is_locked_komen_cowo', 'is_locked_komen_cewe', 'is_locked_share_cowo', 'is_locked_share_cewe',
            'is_locked_repost_cowo', 'is_locked_repost_cewe'
        ];

        btnLockAll.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin MENGUNCI ALL KATEGORI secara massal?")) {
                let paketUpdate = {};
                listKunciGembok.forEach(gembok => { paketUpdate[gembok] = true; });
                db.ref(PATH_SETTINGS).update(paketUpdate).then(() => alert("Berhasil! Semua kategori sekarang dalam status TERKUNCI."));
            }
        });

        btnUnlockAll.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin MEMBUKA ALL KATEGORI secara massal?")) {
                let paketUpdate = {};
                listKunciGembok.forEach(gembok => { paketUpdate[gembok] = false; });
                db.ref(PATH_SETTINGS).update(paketUpdate).then(() => alert("Berhasil! Semua kategori sekarang dalam status TERBUKA."));
            }
        });
    }

    // Handler Form Update Nilai Skor Juara
    if (adminFormSkor) {
        adminFormSkor.addEventListener('submit', (e) => {
            e.preventDefault();
            const kategori = document.getElementById('admin-kategori').value; 
            const uid = document.getElementById('admin-user-pilihan').value;
            const skor = document.getElementById('admin-jumlah-skor').value;

            if (!kategori || !uid) return alert('Lengkapi pilihan kategori dan peserta!');

            db.ref(`${PATH_LEADERBOARD}/${kategori}`).set({
                user_id: uid,
                jumlah: parseInt(skor)
            }).then(() => { alert(`Sukses menyimpan pemenang ${kategori.toUpperCase()}!`); adminFormSkor.reset(); });
        });
    }

    // Handler Tunggal Interaksi Klik Manual Checkbox Gembok Admin
    document.querySelectorAll('.admin-lock-btn').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const namaGembokKategori = this.dataset.kategori;
            const statusCentang = this.checked;
            if (namaGembokKategori) {
                db.ref(PATH_SETTINGS).update({ [namaGembokKategori]: statusCentang });
            }
        });
    });

    // ==========================================================================
    // 4. PUBLIC VIEW ENGINE (view.html) - AKURAT UNTUK TOTAL 12 KATEGORI
    // ==========================================================================
    const viewDropdown = document.getElementById('view-dropdown-kategori');
    const displayArea = document.getElementById('leaderboard-display');
    const countdownSection = document.getElementById('countdown-section');

    if (viewDropdown && displayArea) {
        let globalLocks = {};
        let isFinalStage = false;
        
        const targetDate = new Date('August 15, 2026 00:00:00').getTime();

        const runTimer = () => {
            const now = new Date().getTime();
            const gap = targetDate - now;

            if (gap <= 0) {
                if (!isFinalStage) {
                    isFinalStage = true;
                    if (countdownSection) countdownSection.style.display = 'none';
                    renderPublicView();
                }
                return true;
            }

            isFinalStage = false;
            if (countdownSection) countdownSection.style.display = 'block';

            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            const textDay = Math.floor(gap / day);
            const textHour = Math.floor((gap % day) / hour);
            const textMinute = Math.floor((gap % hour) / minute);
            const textSecond = Math.floor((gap % minute) / second);

            const elDays = document.getElementById('days');
            const elHours = document.getElementById('hours');
            const elMinutes = document.getElementById('minutes');
            const elSeconds = document.getElementById('seconds');

            if (elDays) elDays.innerText = textDay < 10 ? '0' + textDay : textDay;
            if (elHours) elHours.innerText = textHour < 10 ? '0' + textHour : textHour;
            if (elMinutes) elMinutes.innerText = textMinute < 10 ? '0' + textMinute : textMinute;
            if (elSeconds) elSeconds.innerText = textSecond < 10 ? '0' + textSecond : textSecond;

            return false;
        };

        const timerInterval = setInterval(() => {
            const isExpired = runTimer();
            if (isExpired) {
                clearInterval(timerInterval);
            }
        }, 1000);
        runTimer();

        db.ref(PATH_SETTINGS).on('value', (snapshot) => {
            const settings = snapshot.val();
            if (settings) {
                globalLocks = settings;
                
                // Sinkronisasi status checkbox gembok di layar admin agar otomatis tercentang mengikuti database
                document.querySelectorAll('.admin-lock-btn').forEach(checkbox => {
                    const namaGembok = checkbox.dataset.kategori;
                    if(namaGembok && settings[namaGembok] !== undefined) {
                        checkbox.checked = settings[namaGembok];
                    }
                });

                renderPublicView();
            }
        });

        viewDropdown.addEventListener('change', renderPublicView);

        function renderPublicView() {
            const dropdownContainer = document.getElementById('dropdown-container');
            const selectedKategori = viewDropdown.value; 

            if (isFinalStage) {
                if (dropdownContainer) dropdownContainer.style.display = 'none';
                
                const winCowoUid = globalLocks.the_winner_cowo_uid;
                const winCeweUid = globalLocks.the_winner_cewe_uid;

                displayArea.innerHTML = `
                    <div class="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-4xl px-4" id="grand-winners-podium"></div>
                `;
                const podium = document.getElementById('grand-winners-podium');

                if (winCowoUid) {
                    db.ref(`${PATH_USERS}/${winCowoUid}`).once('value', (s) => {
                        const u = s.val();
                        if (u && podium && !document.getElementById('win-card-cowo')) {
                            podium.innerHTML += createWinnerCardHtml(u, "THE WINNER PUTRA", "from-blue-600/20 via-gray-800/90 to-gray-900/90", "border-blue-500 shadow-blue-500/20", "win-card-cowo");
                            if (typeof popCelebrationBalloon === "function") popCelebrationBalloon();
                        }
                    });
                }
                if (winCeweUid) {
                    db.ref(`${PATH_USERS}/${winCeweUid}`).once('value', (s) => {
                        const u = s.val();
                        if (u && podium && !document.getElementById('win-card-cewe')) {
                            podium.innerHTML += createWinnerCardHtml(u, "THE WINNER PUTRI", "from-pink-600/20 via-gray-800/90 to-gray-900/90", "border-pink-500 shadow-pink-500/20", "win-card-cewe");
                            if (typeof popCelebrationBalloon === "function") popCelebrationBalloon();
                        }
                    });
                }
                return;
            }

            if (dropdownContainer) dropdownContainer.style.display = 'block';

            if (!selectedKategori) {
                displayArea.innerHTML = `
                    <div class="space-y-3 max-w-xs text-center animate-pulse mx-auto">
                        <div class="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto border border-gray-700">
                            <i class="fas fa-trophy text-red-500 text-xl"></i>
                        </div>
                        <p class="text-gray-500 text-[10px] font-black tracking-widest uppercase">Silakan Pilih Kategori Juara & Gender</p>
                    </div>`;
                return;
            }

            // PERBAIKAN AKURAT: Pemetaan key gembok menggunakan string matching yang fleksibel & tepat
            let lockKey = "";
            if (selectedKategori.includes("view")) lockKey = selectedKategori.includes("_cowo") ? "is_locked_view_cowo" : "is_locked_view_cewe";
            else if (selectedKategori.includes("like")) lockKey = selectedKategori.includes("_cowo") ? "is_locked_like_cowo" : "is_locked_like_cewe";
            else if (selectedKategori.includes("komen")) lockKey = selectedKategori.includes("_cowo") ? "is_locked_komen_cowo" : "is_locked_komen_cewe";
            else if (selectedKategori.includes("share")) lockKey = selectedKategori.includes("_cowo") ? "is_locked_share_cowo" : "is_locked_share_cewe";
            else if (selectedKategori.includes("repost")) lockKey = selectedKategori.includes("_cowo") ? "is_locked_repost_cowo" : "is_locked_repost_cewe";

            if (lockKey && globalLocks[lockKey] === true) {
                displayArea.innerHTML = `
                    <div class="space-y-4 max-w-xs text-center mx-auto py-12 bg-gray-900/40 p-8 rounded-2xl border border-red-500/30 shadow-2xl backdrop-blur-md">
                        <div class="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto border border-red-500/40 shadow-lg shadow-red-500/10 animate-pulse">
                            <i class="fas fa-lock text-red-500 text-xl"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-sm font-black text-red-400 tracking-wider uppercase">KATEGORI DIKUNCI</h4>
                            <p class="text-gray-400 text-[11px] font-medium leading-relaxed">Skor akhir kategori ini sedang disegel oleh Admin untuk rekapitulasi data.</p>
                        </div>
                    </div>`;
                return;
            }

            db.ref(`${PATH_LEADERBOARD}/${selectedKategori}`).once('value', (scoreSnap) => {
                const dataSkor = scoreSnap.val();
                if (dataSkor && dataSkor.user_id) {
                    db.ref(`${PATH_USERS}/${dataSkor.user_id}`).once('value', (userSnap) => {
                        const user = userSnap.val();
                        if (user) {
                            const cleanLabel = selectedKategori.replace('_cowo','').replace('_cewe','').replace('top_','').toUpperCase();
                            const isCowo = selectedKategori.includes('_cowo');
                            const genderLabel = isCowo ? "PUTRA" : "PUTRI";
                            const temaBorder = isCowo ? "border-blue-500/40 shadow-blue-500/10" : "border-pink-500/40 shadow-pink-500/10";

                            displayArea.innerHTML = `
                                <div class="celeb-popup text-center bg-gray-800/80 border border-gray-700/80 p-6 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col items-center backdrop-blur-md mx-auto">
                                    <div class="w-32 h-44 rounded-2xl border-2 ${temaBorder} shadow-xl overflow-hidden bg-gray-950 mb-4">
                                        <img src="${user.foto}" class="w-full h-full object-cover">
                                    </div>
                                    <h3 class="text-lg font-black text-white tracking-wide">@${user.username_ig}</h3>
                                    <p class="text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">${user.nama} <span class="text-red-500">•</span> ${user.sekolah}</p>
                                    
                                    <div class="bg-gradient-to-r from-gray-900/50 via-red-950/20 to-gray-900/50 border border-gray-700 px-6 py-2.5 rounded-2xl mb-4 w-full text-center">
                                        <span class="text-[9px] uppercase font-black text-yellow-400 tracking-widest block mb-0.5">JUARA TOP ${cleanLabel} (${genderLabel})</span>
                                        <strong class="text-2xl text-white font-black font-mono">${dataSkor.jumlah.toLocaleString('id-ID')}</strong>
                                    </div>
                                    <a href="${user.link_video}" target="_blank" class="block w-full bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-xl text-xs transition-all tracking-widest uppercase shadow-md"><i class="fab fa-instagram mr-1.5"></i> Lihat Video</a>
                                </div>
                            `;
                            if (typeof popCelebrationBalloon === "function") popCelebrationBalloon();
                        }
                    });
                } else {
                    displayArea.innerHTML = "<p class='text-gray-500 text-xs font-semibold uppercase py-12 text-center'>Belum ada data pemenang di kategori ini.</p>";
                }
            });
        }

        function createWinnerCardHtml(user, title, gradient, borderStyle, elementId) {
            return `
                <div id="${elementId}" class="celeb-popup text-center bg-gradient-to-b ${gradient} p-6 rounded-2xl border-2 ${borderStyle} w-full max-w-xs shadow-2xl flex flex-col items-center transition-transform duration-300 hover:scale-105">
                    <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-3 animate-bounce">
                        <i class="fas fa-crown text-white text-lg"></i>
                    </div>
                    <h1 class="text-sm font-black text-yellow-400 uppercase tracking-widest mb-3">${title}</h1>
                    <div class="w-32 h-44 rounded-xl border border-gray-700 shadow-xl overflow-hidden bg-gray-900 mb-3">
                        <img src="${user.foto}" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-base font-bold text-white">@${user.username_ig}</h3>
                    <p class="text-xs text-gray-300 mt-0.5 font-medium">${user.nama}</p>
                    <p class="text-[10px] text-gray-500 mb-4">${user.sekolah}</p>
                    <a href="${user.link_video}" target="_blank" class="block w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-black py-2 rounded-xl text-xs transition uppercase tracking-wider"><i class="fas fa-play mr-1"></i> Tonton Video</a>
                </div>`;
        }
    }
});
const btnKembali = document.getElementById('back-to-vercel-btn');
if (btnKembali) {
    btnKembali.addEventListener('click', () => {
        window.location.href = "https://ppikabupatenprobolinggo.vercel.app/";
    });
}