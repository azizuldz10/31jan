let currentSection = 0;
const sections = document.querySelectorAll('.section');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

// Fungsi untuk memainkan musik
function playMusic() {
    if (!isPlaying) {
        bgMusic.play().catch(err => console.log('Audio play failed:', err));
        isPlaying = true;
        // Hide the click hint after music starts
        const clickHint = document.querySelector('.click-hint');
        if (clickHint) {
            clickHint.classList.add('hide');
        }
    }
}

// Event listener untuk click di mana saja untuk memulai musik
document.addEventListener('click', playMusic);

// Tambahkan fungsi untuk animasi mengetik
function startTypingAnimation() {
    const messages = document.querySelectorAll('.message-animate');
    const signature = document.querySelector('.signature');
    let delay = 0;
    
    messages.forEach((message, index) => {
        const text = message.textContent;
        message.textContent = '';
        message.classList.add('typing');
        
        setTimeout(() => {
            let charIndex = 0;
            
            // Animasi mengetik per karakter
            const typing = setInterval(() => {
                if (charIndex < text.length) {
                    message.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typing);
                    // Jika ini pesan terakhir, tampilkan signature
                    if (index === messages.length - 1) {
                        setTimeout(() => {
                            signature.classList.add('show');
                        }, 500);
                    }
                }
            }, 50); // Kecepatan mengetik (ms)
            
        }, delay);
        
        delay += text.length * 50 + 1000; // Delay berdasarkan panjang teks + jeda
    });
}

// Update fungsi nextSection untuk menginisialisasi slideshow di section galeri
function nextSection() {
    if (currentSection < sections.length - 1) {
        sections[currentSection].classList.remove('active');
        sections[currentSection].style.transform = 'translateX(-100%)';
        currentSection++;
        sections[currentSection].classList.remove('back');
        sections[currentSection].classList.add('active');
        
        // Mulai animasi mengetik jika di section motivasi
        if (sections[currentSection].id === 'motivation') {
            startTypingAnimation();
        }
        
        createConfetti();
    }
}

// Update fungsi prevSection untuk membersihkan animasi
function prevSection() {
    if (currentSection > 0) {
        sections[currentSection].classList.remove('active');
        sections[currentSection].style.transform = 'translateX(100%)';
        currentSection--;
        sections[currentSection].style.transform = 'translateX(0)';
        sections[currentSection].classList.add('active');
        
        // Reset animasi jika meninggalkan section motivasi
        if (sections[currentSection + 1].id === 'motivation') {
            const messages = document.querySelectorAll('.message-animate');
            const signature = document.querySelector('.signature');
            messages.forEach(message => {
                message.classList.remove('typing');
                message.textContent = message.getAttribute('data-text');
            });
            signature.classList.remove('show');
        }
        
        createConfetti();
    }
}

// Fungsi untuk membuat konfeti
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}deg, 100%, 50%)`;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Tambahkan keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSection();
    } else if (e.key === 'ArrowLeft') {
        prevSection();
    }
});

// Animasi text saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    sections[0].classList.add('active');
});

// Simpan posisi musik setiap 1 detik
setInterval(() => {
    if (isPlaying) {
        localStorage.setItem('musicTime', bgMusic.currentTime.toString());
    }
}, 1000);

// Jika musik sebelumnya sedang playing, langsung mainkan
if (isPlaying) {
    const savedTime = localStorage.getItem('musicTime');
    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }
    bgMusic.play().catch(err => console.log('Audio autoplay failed:', err));
}

// Fungsi untuk toggle wishes
function toggleWishes() {
    const wishes = document.getElementById('birthdayWishes');
    const wishBtn = document.getElementById('wishBtn');
    
    wishes.classList.toggle('wishes-show');
    
    if (wishes.classList.contains('wishes-show')) {
        wishBtn.textContent = 'Tutup Ucapan';
        createConfetti();
    } else {
        wishBtn.textContent = 'Buka Ucapan';
    }
}

// Cleanup saat user meninggalkan halaman
window.addEventListener('beforeunload', () => {
    if (isPlaying) {
        localStorage.setItem('musicTime', bgMusic.currentTime.toString());
    }
}); 