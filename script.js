/**
 * ========================================================
 * MOMMY.EXE - BEST FRIEND DAY 2026 CORE LOGIC
 * Architecture: Modular Vanilla JS
 * ========================================================
 */

// --- STATE & DATA ---
const STATE = {
    achievements: new Set(),
    musicPlaying: false,
    secretClicks: 0, // <--- Ensure this exists
    roastCount: 0,
    isCinematicPlaying: false
};

const ROASTS = [
    "You say 'brb' and return after three business days.",
    "You could talk to a wall and become friends with it.",
    "You create chaos and then ask who caused it.",
    "You claim you're innocent. Nice joke.",
    "You have enough energy to power a small city.",
    "Your brain operates on 100 tabs open, and music playing in 3 of them.",
    "You're the reason the phrase 'chaotic good' was invented.",
    "You complain about being tired but refuse to sleep.",
    "You take 3 business days to reply, then reply with 10 messages in 10 seconds.",
    "Your dog secretly judges your yapping.",
    "\"I'm not dramatic\" - you, being dramatic.",
    "You have a PhD in Yapping.",
    "You somehow trip over flat surfaces.",
    "You survive purely on vibes and chaos.",
    "Your search history is probably just questions a 5-year-old would ask.",
    "You are 90% caffeine and 10% dog memes.",
    "\"I'll be ready in 5 minutes\" is your biggest lie.",
    "You threaten to fight people but are actually a marshmallow.",
    "You probably apologize to inanimate objects when you bump into them.",
    "Your playlist is as confused as you are.",
    "You laugh at your own jokes before finishing them.",
    "You're physically incapable of telling a short story.",
    "You whisper-shout when you're excited.",
    "You leave a trail of chaos wherever you go.",
    "You can't decide what to eat, ever.",
    "You send memes instead of dealing with your problems.",
    "You're a professional at overthinking simple things.",
    "You probably have a staring contest with your cat and lose.",
    "You are undeniably, unapologetically, delightfully a menace.",
    "You're officially my favorite chaos demon."
];

const APPRECIATIONS = [
    "You're genuinely important.",
    "Thank you for being here.",
    "You make ordinary conversations memorable.",
    "Some people become comfort. You're one of them.",
    "I appreciate you more than you realize.",
    "You have a really good heart behind all that chaos."
];

const COMPLIMENTS = [
    "You make people smile easily.",
    "You have elite dog taste.",
    "You are surprisingly cool.",
    "You make conversations better.",
    "Certified awesome.",
    "Your laugh is contagious.",
    "You give off main character energy.",
    "You handle everything with style.",
    "Your vibe is unmatched.",
    "You're practically a professional mood booster."
];

const GIFTS = ["Virtual Hug 🤗", "Dog Sticker 🐶", "Cat Sticker 🐱", "Friendship Badge 🎖️", "Premium Sparkles ✨"];

const PHOTO_REACTIONS = [
    "Okay this photo is actually amazing.",
    "Main Character Energy.",
    "Camera Understood The Assignment.",
    "This one's unfairly good.",
    "Photogenic detected.",
    "Iconic."
];

// --- CORE SYSTEMS ---

// 1. Loading & Intro
function initLoader() {
    const loaderText = document.getElementById('loader-text');
    const fill = document.querySelector('.progress-fill');
    const msgs = [
        "Checking Dog Obsession...",
        "Scanning For Chaos...",
        "Preparing Best Friend Experience...",
        "Warning: Extreme Levels Of Yapping Detected",
        "Ready ❤️"
    ];
    let step = 0;
    
    const interval = setInterval(() => {
        step++;
        fill.style.width = `${(step / msgs.length) * 100}%`;
        if (step < msgs.length) {
            loaderText.innerText = msgs[step];
        } else {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
                document.getElementById('intro-screen').classList.remove('hidden');
            }, 500);
        }
    }, 800);
}

document.getElementById('btn-enter').addEventListener('click', () => {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('floating-ui').classList.remove('hidden');
    
    // Attempt BGM start
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.5;
    bgm.play().then(() => {
        STATE.musicPlaying = true;
        document.getElementById('music-toggle').innerText = "🎵 Pause";
    }).catch(e => console.log("Autoplay blocked"));
    
    initWeather();
    initMemoryGame();
});

// 2. Custom Cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    if (Math.random() < 0.1) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.innerHTML = Math.random() > 0.5 ? '✨' : '❤️';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
});
document.querySelectorAll('button, a, .gallery-img, .flip-card, .sticky-note').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// 3. Live Clock
setInterval(() => {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString('en-US', {hour12:true}) + " | " + now.toLocaleDateString();
}, 1000);

// 4. Music Controls
document.getElementById('music-toggle').addEventListener('click', (e) => {
    const bgm = document.getElementById('bgm');
    if(STATE.musicPlaying) {
        bgm.pause();
        e.target.innerText = "🎵 Play";
    } else {
        bgm.play();
        e.target.innerText = "🎵 Pause";
    }
    STATE.musicPlaying = !STATE.musicPlaying;
});
document.getElementById('volume').addEventListener('input', (e) => {
    document.getElementById('bgm').volume = e.target.value;
});

// 5. Statistics Counter
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const el = entry.target;
            if(!el.classList.contains('counted')) {
                const target = +el.getAttribute('data-target');
                let count = 0;
                const updateCount = setInterval(() => {
                    count += Math.ceil(target / 50);
                    if(count >= target) {
                        el.innerText = target;
                        clearInterval(updateCount);
                    } else {
                        el.innerText = count;
                    }
                }, 30);
                el.classList.add('counted');
            }
        }
    });
});
document.querySelectorAll('.stat-number[data-target]').forEach(el => observer.observe(el));

// 6. Photo Gallery Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');
document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCap.innerText = PHOTO_REACTIONS[Math.floor(Math.random() * PHOTO_REACTIONS.length)];
        lightbox.classList.remove('hidden');
        unlockAchievement('Photo Explorer', 'You checked out the gallery!');
    });
});
document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.add('hidden'));

// 7. Roast Generator
document.getElementById('btn-roast').addEventListener('click', () => {
    const textEl = document.getElementById('roast-text');
    textEl.innerText = `"${ROASTS[Math.floor(Math.random() * ROASTS.length)]}"`;
    STATE.roastCount++;
    
    if(STATE.roastCount % 4 === 0) {
        document.getElementById('appreciation-box').classList.remove('hidden');
        document.getElementById('appreciation-text').innerText = APPRECIATIONS[Math.floor(Math.random() * APPRECIATIONS.length)];
        setTimeout(() => document.getElementById('appreciation-box').classList.add('hidden'), 5000);
    }
});

// 8. Dog vs Mommy Poll
const pollRes = document.getElementById('poll-result');
['poll-dog', 'poll-mommy'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        pollRes.innerText = "Correct Answer: Both ❤️";
        pollRes.classList.remove('hidden');
    });
});

// 9. Secret Button (Do Not Click)
const secretBtn = document.getElementById('btn-secret-main');
const secretMsg = document.getElementById('secret-message');

if (secretBtn) {
    secretBtn.addEventListener('click', () => {
        STATE.secretClicks++;
        
        // Debugging: uncomment the line below to see clicks in the browser console (F12)
        // console.log("Secret Clicks:", STATE.secretClicks);

        if (STATE.secretClicks === 1) {
            secretMsg.innerText = "I told you not to click.";
        } else if (STATE.secretClicks === 2) {
            secretMsg.innerText = "Seriously?";
        } else if (STATE.secretClicks === 3) {
            secretMsg.innerText = "You're impossible.";
        } else if (STATE.secretClicks >= 4) {
            secretMsg.innerText = "Fine. You are appreciated more than you know ❤️";
            secretMsg.style.color = "var(--pink)";
            secretBtn.style.display = 'none'; // Hide button after reveal
            unlockAchievement('Secret Finder', 'You broke the rules and clicked it.');
        }
    });
} else {
    console.error("Button 'btn-secret-main' not found in HTML!");
}

// 10. Compliment Generator
document.getElementById('btn-compliment').addEventListener('click', () => {
    document.getElementById('compliment-text').innerText = `"${COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]}"`;
});

// 11. Gift Box
document.getElementById('gift-box').addEventListener('click', (e) => {
    const box = e.target;
    box.classList.add('gift-shake');
    setTimeout(() => box.classList.remove('gift-shake'), 500);
    const gift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
    const res = document.getElementById('gift-result');
    res.querySelector('span').innerText = gift;
    res.classList.remove('hidden');
});

// 12. Achievement System
function unlockAchievement(title, desc) {
    if(STATE.achievements.has(title)) return;
    STATE.achievements.add(title);
    
    const toast = document.getElementById('achievement-toast');
    toast.querySelector('h4').innerText = title;
    document.getElementById('ach-desc').innerText = desc;
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// 13. Weather / Particle System (Canvas)
const wCanvas = document.getElementById('weather-canvas');
const ctx = wCanvas.getContext('2d');
wCanvas.width = window.innerWidth;
wCanvas.height = window.innerHeight;

let particles = [];
let weatherMode = 'happy'; // happy (sparkles), chill (rain/stars), energetic (fast hearts)

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * wCanvas.height;
    }
    reset() {
        this.x = Math.random() * wCanvas.width;
        this.y = -20;
        this.size = Math.random() * 5 + 2;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.type = Math.random() > 0.5 ? 'heart' : 'sparkle';
    }
    update() {
        if(weatherMode === 'energetic') { this.speed = 5; this.y += this.speed; }
        else if (weatherMode === 'chill') { this.speed = 1; this.y += this.speed; this.type = 'star'; }
        else { this.speed = 2; this.y += this.speed; }
        
        if (this.y > wCanvas.height) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size * 3}px Arial`;
        if(this.type === 'heart') ctx.fillText('❤️', this.x, this.y);
        else if(this.type === 'sparkle') ctx.fillText('✨', this.x, this.y);
        else ctx.fillText('⭐', this.x, this.y);
        ctx.globalAlpha = 1;
    }
}
function initWeather() {
    for(let i=0; i<50; i++) particles.push(new Particle());
    function animateWeather() {
        ctx.clearRect(0,0,wCanvas.width, wCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateWeather);
    }
    animateWeather();
}
document.getElementById('mood-select').addEventListener('change', (e) => {
    weatherMode = e.target.value;
});

// 14. Mommy's Meme Match Game
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const movesEl = document.getElementById('moves-count');
    const winScreen = document.getElementById('game-win-screen');
    const restartBtn = document.getElementById('btn-restart-game');
    
    // HOW TO ADD YOUR OWN PHOTOS/MEMES:
    // Change type to 'image' and put your file name in 'content'.
    // Example: { id: 1, type: 'image', content: 'funny_dog.jpg' }
    // I left emojis as fallbacks so the game works immediately!
const cardData = [
    { id: 1, type: 'image', content: 'meme1.jpg' },
    { id: 2, type: 'image', content: 'meme2.jpg' },
    { id: 3, type: 'image', content: 'meme3.jpg' },
    { id: 4, type: 'image', content: 'meme4.jpg' },
    { id: 5, type: 'image', content: 'meme5.jpg' },
    { id: 6, type: 'image', content: 'meme6.jpg' }
];
    
    let cards = [...cardData, ...cardData]; // Duplicate the array to create pairs
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    
    function createBoard() {
        board.innerHTML = '';
        winScreen.classList.add('hidden');
        cards.sort(() => Math.random() - 0.5); // Shuffle
        moves = 0;
        matchedPairs = 0;
        movesEl.innerText = `Moves: ${moves}`;
        flippedCards = [];
        canFlip = true;
        
        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('memory-card');
            cardEl.dataset.id = card.id;
            
            // Check if it's an image or text/emoji
            const frontContent = card.type === 'image' 
                ? `<img src="${card.content}" alt="meme">` 
                : card.content;
                
            cardEl.innerHTML = `
                <div class="memory-back">❓</div>
                <div class="memory-front">${frontContent}</div>
            `;
            
            cardEl.addEventListener('click', flipCard);
            board.appendChild(cardEl);
        });
    }
    
    function flipCard() {
        if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesEl.innerText = `Moves: ${moves}`;
            checkMatch();
        }
    }
    
    function checkMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.id === card2.dataset.id;
        
        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            
            if (matchedPairs === cardData.length) {
                setTimeout(triggerWin, 600);
            }
        } else {
            // No match, flip them back after a short delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
    
    function triggerWin() {
        winScreen.classList.remove('hidden');
        board.style.display = 'none'; // Hide the board to show the surprise cleanly
        
        // Trigger achievement toast
        unlockAchievement('Meme Master', 'You matched all the chaos!');
        
        // Use the existing canvas to trigger a massive confetti explosion
        weatherMode = 'energetic';
        for(let i=0; i<80; i++) {
            particles.push(new Particle());
        }
    }

    restartBtn.addEventListener('click', () => {
        board.style.display = 'grid'; // Bring board back
        createBoard();
    });
    
    createBoard();
}

// Ensure you replace the old `initGame();` call inside the `document.getElementById('btn-enter').addEventListener('click', ...)` 
// with `initMemoryGame();`

// 15. Easter Eggs & Key Codes
let titleClicks = 0;
document.getElementById('main-title').addEventListener('click', () => {
    titleClicks++;
    if(titleClicks === 5) unlockAchievement('Professional Snooper', 'You clicked the title 5 times!');
});

let keysPressed = '';
document.addEventListener('keydown', (e) => {
    keysPressed += e.key.toLowerCase();
    if(keysPressed.length > 10) keysPressed = keysPressed.slice(-10);
    
    if(keysPressed.includes('dog')) {
        unlockAchievement('DOG Mode', 'Summoned the dogs!');
        keysPressed = '';
        // Drop dog emojis
        for(let i=0; i<30; i++) {
            let p = new Particle();
            p.type = 'dog';
            p.draw = function() { ctx.fillText('🐶', this.x, this.y); };
            particles.push(p);
        }
    }
    if(keysPressed.includes('bbu')) {
        alert("Hidden Message: Good Boi loves Mommy's chaos.");
        keysPressed = '';
    }
});

// 16. Cinematic Ending
const endObserver = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting && !STATE.isCinematicPlaying) {
        STATE.isCinematicPlaying = true;
        const cinematic = document.getElementById('cinematic-ending');
        cinematic.classList.remove('hidden');
        
        const c1 = document.getElementById('ce-1');
        const c2 = document.getElementById('ce-2');
        const c3 = document.getElementById('ce-3');
        
        setTimeout(() => c1.classList.add('visible'), 500);
        setTimeout(() => { c1.classList.remove('visible'); c1.classList.add('hidden'); c2.classList.remove('hidden'); setTimeout(()=>c2.classList.add('visible'), 50); }, 3000);
        setTimeout(() => { c2.classList.remove('visible'); c2.classList.add('hidden'); c3.classList.remove('hidden'); setTimeout(()=>c3.classList.add('visible'), 50); }, 6000);
        
        // Big Confetti effect via canvas modification
        setTimeout(() => {
            weatherMode = 'energetic';
            for(let i=0; i<100; i++) particles.push(new Particle());
            setTimeout(()=> {
                cinematic.classList.add('hidden');
            }, 4000);
        }, 9000);
    }
}, { threshold: 1.0 });
endObserver.observe(document.getElementById('ending-trigger'));

// Init
window.onload = initLoader;