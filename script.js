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
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1505477058711650444/ET2MxA3hhSpROdKB2G_LyVgComwfW1kV7h2BRTPotjJXrhlc9jZLgRHOWioji3j7i6qq"; // PASTE YOUR DISCORD WEBHOOK URL HERE
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
        element.innerHTML = "";
        
        const segmenter = window.Intl && Intl.Segmenter ? new Intl.Segmenter('my', { granularity: 'grapheme' }) : null;
        const segments = segmenter ? Array.from(segmenter.segment(text)).map(s => s.segment) : text.split('');
        
        let i = 0;
        function type() {
            if (i < segments.length) {
                const currentText = segments.slice(0, i + 1).join('');
                element.innerHTML = currentText + '<span class="romantic-cursor"></span>';
                i++;
                
                // Variable speed for a more natural, smooth typing feel
                const speed = Math.random() * 30 + 40; 
                setTimeout(type, speed);
            } else {
                element.innerHTML = text; // Remove cursor when done
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
        sendDiscordNotification();
    });

    // --- UTILS ---
    function sendDiscordNotification() {
        if (!DISCORD_WEBHOOK_URL) return; // Do nothing if URL is not set

        const payload = {
            content: `🎉 **SHE SAID YES!** 💖\n\nShe tried to click "No" **${noTouchCount}** times before giving up and clicking Yes!`
        };

        // Discord blocks direct fetch requests from browsers due to CORS security.
        // We use a safe, popular webhook proxy to bypass this block.
        const proxyUrl = DISCORD_WEBHOOK_URL.replace("discord.com", "webhook.lewisakura.moe");

        fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error("Discord webhook failed", err));
    }

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
