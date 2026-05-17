document.addEventListener('DOMContentLoaded', () => {

    const unlockBtn = document.getElementById('unlockBtn');
    const verificationDate = document.getElementById('verificationDate');
    const errorMsg = document.getElementById('errorMsg');
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const celebration = document.getElementById('celebration');
    
    const nextToProposal = document.getElementById('nextToProposal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    // Config
    const CORRECT_DATE = "2026-05-08"; // Change this to your actual date
    let noTouchCount = 0;
    let yesScale = 1;
    let noScale = 1;

    // --- STEP 1: WELCOME ---
    unlockBtn.addEventListener('click', () => {


        if (verificationDate.value === CORRECT_DATE) {
            transitionTo(step1, step2);
            initTimeline();
        } else {
            errorMsg.classList.remove('hidden');
            verificationDate.style.borderColor = "#ff4d4d";
            setTimeout(() => {
                verificationDate.style.borderColor = "";
            }, 1000);
        }
    });

    // --- STEP 2: TIMELINE ---
    function initTimeline() {
        const cards = document.querySelectorAll('.timeline-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    startTypewriter(entry.target.querySelector('.typewriter'));
                }
            });
        }, { threshold: 0.5 });

        cards.forEach(card => observer.observe(card));
    }

    function startTypewriter(element) {
        if (element.getAttribute('data-started')) return;
        element.setAttribute('data-started', 'true');
        
        const text = element.getAttribute('data-text');
        let i = 0;
        element.innerHTML = "";
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }
        type();
    }

    nextToProposal.addEventListener('click', () => {
        transitionTo(step2, step3);
    });

    // --- STEP 3: THE PROPOSAL ---
    
    // "No" button escape logic for mobile
    const moveNoButton = (e) => {
        if (e) e.preventDefault();
        
        noTouchCount++;
        
        // Randomly move the button
        const maxX = window.innerWidth - noBtn.offsetWidth - 40;
        const maxY = window.innerHeight - noBtn.offsetHeight - 40;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        
        // Make "Yes" grow and "No" shrink
        yesScale += 0.2;
        noScale -= 0.1;
        
        if (noScale < 0.5) noScale = 0.5; // Don't let it disappear completely
        
        yesBtn.style.transform = `scale(${yesScale})`;
        noBtn.style.transform = `scale(${noScale})`;
        
        // If "Yes" is huge, it covers more area
        if (yesScale > 3) {
            yesBtn.style.width = "100%";
            yesBtn.style.height = "100%";
            yesBtn.style.position = "fixed";
            yesBtn.style.top = "0";
            yesBtn.style.left = "0";
            yesBtn.style.zIndex = "1000";
        }
    };

    noBtn.addEventListener('touchstart', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        // Fallback for desktop testing
        if (window.innerWidth > 768) {
            moveNoButton(e);
        }
    });

    yesBtn.addEventListener('click', () => {
        transitionTo(step3, celebration);
        startCelebration();
    });

    // --- UTILS ---
    function transitionTo(from, to) {
        from.classList.add('hidden');
        from.classList.remove('active');
        
        setTimeout(() => {
            to.classList.remove('hidden');
            setTimeout(() => {
                to.classList.add('active');
            }, 50);
        }, 500);
    }

    function startCelebration() {
        // Confetti effect
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // hearts and colors
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FF69B4', '#FFB6C1', '#FF1493']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FF69B4', '#FFB6C1', '#FF1493']
            });
        }, 250);

        // Continuous hearts
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF69B4', '#FF1493', '#FFFFFF']
        });
    }
});
