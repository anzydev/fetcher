/* ═══════════════════════════════════════════════════════════
   PUBLIC API PLAYGROUND — ART DECO EDITION
   Features: Particle System, 3D Tilt, Scroll Reveals,
             Dog Finder, Joke Generator, Random User, Post Viewer
   ═══════════════════════════════════════════════════════════ */

// ── DOM REFERENCES ─────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  canvas:     $('#particles'),
  heroContent: $('#hero-content'),
  heroTitle:  $('.hero__title'),
  btnDog:     $('#btn-dog'),
  btnJoke:    $('#btn-joke'),
  btnUser:    $('#btn-user'),
  btnPost:    $('#btn-post'),
  resultDog:  $('#result-dog'),
  resultJoke: $('#result-joke'),
  resultUser: $('#result-user'),
  resultPost: $('#result-post'),
  year:       $('#year'),
};

// ── API ENDPOINTS ──────────────────────────────────────────
const API = {
  dog:  'https://dog.ceo/api/breeds/image/random',
  joke: 'https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart',
  user: 'https://randomuser.me/api/',
  post: 'https://jsonplaceholder.typicode.com/posts/',
};

let currentPostId = 0;

/* ══════════════════════════════════════════════════════════
   P A R T I C L E   S Y S T E M
   Gold particles drifting upward like champagne bubbles
   with gentle mouse repulsion
   ══════════════════════════════════════════════════════════ */
const ParticleSystem = (() => {
  const canvas = dom.canvas;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animId;

  // Responsive particle count
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
  const REPULSION_RADIUS = 120;
  const REPULSION_FORCE = 2;

  /** Resize canvas to match viewport */
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /** Create a single particle with randomised properties */
  function createParticle(startFromBottom = false) {
    return {
      x: Math.random() * canvas.width,
      y: startFromBottom
        ? canvas.height + Math.random() * 100
        : Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.15),   // drifts upward
      speedX: (Math.random() - 0.5) * 0.2,      // slight horizontal sway
      opacity: Math.random() * 0.5 + 0.15,
      // Gold colour with slight hue variation
      hue: 43 + (Math.random() - 0.5) * 10,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
    };
  }

  /** Initialise particle pool */
  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle());
    window.addEventListener('resize', resize);

    // Track mouse for repulsion
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    loop();
  }

  /** Animation loop */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = performance.now() * 0.001;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Subtle pulsing opacity
      const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15 + 0.85;
      const alpha = p.opacity * pulse;

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPULSION_RADIUS && dist > 0) {
        const force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around when particle drifts off-screen
      if (p.y < -10) {
        particles[i] = createParticle(true);
        continue;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      // Draw particle (small gold circle + subtle glow)
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 70%, 55%)`;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = p.size * 4;
      ctx.fill();
      ctx.restore();
    }

    animId = requestAnimationFrame(loop);
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════
   3 D   H E R O   T I L T
   Mouse-driven perspective rotation on the hero title
   ══════════════════════════════════════════════════════════ */
const HeroTilt = (() => {
  const MAX_TILT = 12; // degrees

  function init() {
    const hero = $('#hero');
    if (!hero || !dom.heroTitle) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalise to -1..1
      const nx = (e.clientX - centerX) / (rect.width / 2);
      const ny = (e.clientY - centerY) / (rect.height / 2);

      // Invert Y for natural tilt feel
      const rotateY = nx * MAX_TILT;
      const rotateX = -ny * MAX_TILT;

      dom.heroTitle.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      dom.heroTitle.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════
   3 D   C A R D   H O V E R   T I L T
   Result cards rotate slightly toward mouse on hover
   ══════════════════════════════════════════════════════════ */
const CardTilt = (() => {
  const MAX_TILT = 6;

  function init() {
    $$('.card-3d').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (e.clientY - cy) / (rect.height / 2);

        card.style.transform =
          `perspective(800px) rotateX(${-ny * MAX_TILT}deg) rotateY(${nx * MAX_TILT}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════
   S C R O L L   R E V E A L
   IntersectionObserver to reveal sections on scroll
   ══════════════════════════════════════════════════════════ */
const ScrollReveal = (() => {
  function init() {
    const sections = $$('.reveal-section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // reveal only once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════
   U T I L I T Y   H E L P E R S
   ══════════════════════════════════════════════════════════ */

/** Show Art Deco themed loading state */
function showLoading(container) {
  container.innerHTML = `
    <div class="loader">
      <div class="loader__spinner"></div>
      <span>Loading</span>
    </div>`;
}

/** Show error message */
function showError(container, message = 'Something went wrong. Please try again.') {
  container.innerHTML = `<p class="result__error">⚠ ${message}</p>`;
}

/** Generic fetch wrapper */
async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Extract breed name from dog.ceo URL */
function extractBreedName(url) {
  const parts = url.split('/');
  const breedSlug = parts[parts.indexOf('breeds') + 1] || 'Unknown';
  return breedSlug.split('-').reverse().join(' ');
}

/** Copy to clipboard with toast */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Image URL copied');
  } catch {
    showToast('Copy failed — try manually');
  }
}

/** Art Deco styled toast */
function showToast(message) {
  let toast = $('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('copy-toast--visible');
  setTimeout(() => toast.classList.remove('copy-toast--visible'), 2000);
}

/* ══════════════════════════════════════════════════════════
   🐶  D O G   F I N D E R
   ══════════════════════════════════════════════════════════ */
async function fetchDog() {
  const container = dom.resultDog;
  showLoading(container);

  try {
    const data = await apiFetch(API.dog);
    const imageUrl = data.message;
    const breed = extractBreedName(imageUrl);

    container.innerHTML = `
      <div class="dog-result">
        <div class="dog-result__frame">
          <div class="dog-result__frame-inner">
            <img class="dog-result__img" src="${imageUrl}" alt="A ${breed} dog" />
          </div>
        </div>
        <p class="dog-result__breed">${breed}</p>
        <div class="dog-result__actions">
          <button class="btn btn--sm" id="btn-copy-url" type="button">◆ COPY URL</button>
          <button class="btn btn--sm" id="btn-dog-next" type="button">◆ NEXT DOG</button>
        </div>
      </div>`;

    $('#btn-copy-url').addEventListener('click', () => copyToClipboard(imageUrl));
    $('#btn-dog-next').addEventListener('click', fetchDog);
  } catch (err) {
    showError(container, 'Could not fetch a dog image. Try again.');
    console.error('[Dog Finder]', err);
  }
}

/* ══════════════════════════════════════════════════════════
   😂  J O K E   G E N E R A T O R
   ══════════════════════════════════════════════════════════ */
async function fetchJoke() {
  const container = dom.resultJoke;
  showLoading(container);

  try {
    const data = await apiFetch(API.joke);

    container.innerHTML = `
      <div class="joke-result">
        <p class="joke-result__setup">${data.setup}</p>
        <p class="joke-result__punchline">— ${data.delivery}</p>
        <div class="joke-result__actions">
          <button class="btn btn--sm" id="btn-joke-next" type="button">◆ NEXT JOKE</button>
        </div>
      </div>`;

    $('#btn-joke-next').addEventListener('click', fetchJoke);
  } catch (err) {
    showError(container, 'The internet has no humor right now. Try again.');
    console.error('[Joke Generator]', err);
  }
}

/* ══════════════════════════════════════════════════════════
   👤  R A N D O M   U S E R
   ══════════════════════════════════════════════════════════ */
async function fetchUser() {
  const container = dom.resultUser;
  showLoading(container);

  try {
    const data = await apiFetch(API.user);
    const user = data.results[0];
    const fullName = `${user.name.first} ${user.name.last}`;
    const age = user.dob.age;

    container.innerHTML = `
      <div class="user-result">
        <div class="user-result__avatar-frame">
          <img class="user-result__avatar" src="${user.picture.large}" alt="Photo of ${fullName}" />
        </div>
        <div class="user-result__info">
          <p class="user-result__name">${fullName}</p>
          <p class="user-result__detail">Email: <span>${user.email}</span></p>
          <p class="user-result__detail">Country: <span>${user.location.country}</span></p>
          <p class="user-result__detail">Age: <span>${age}</span></p>
          <p class="user-result__detail">Phone: <span>${user.phone}</span></p>
        </div>
        <button class="btn btn--sm" id="btn-user-next" type="button">◆ NEXT USER</button>
      </div>`;

    $('#btn-user-next').addEventListener('click', fetchUser);
  } catch (err) {
    showError(container, 'Could not generate a user. Try again.');
    console.error('[Random User]', err);
  }
}

/* ══════════════════════════════════════════════════════════
   📄  P O S T   V I E W E R
   ══════════════════════════════════════════════════════════ */
async function fetchPost() {
  const container = dom.resultPost;
  showLoading(container);
  currentPostId = (currentPostId % 100) + 1;

  try {
    const data = await apiFetch(`${API.post}${currentPostId}`);

    container.innerHTML = `
      <div class="post-result">
        <span class="post-result__id">Post No. ${data.id}</span>
        <h3 class="post-result__title">${data.title}</h3>
        <p class="post-result__body">${data.body}</p>
        <button class="btn btn--sm" id="btn-post-next" type="button">◆ NEXT POST</button>
      </div>`;

    $('#btn-post-next').addEventListener('click', fetchPost);
  } catch (err) {
    showError(container, 'Failed to fetch the post. Try again.');
    console.error('[Post Viewer]', err);
  }
}

/* ══════════════════════════════════════════════════════════
   I N I T I A L I Z A T I O N
   ══════════════════════════════════════════════════════════ */
function init() {
  // Footer year
  dom.year.textContent = new Date().getFullYear();

  // Initialise systems
  ParticleSystem.init();
  HeroTilt.init();
  CardTilt.init();
  ScrollReveal.init();

  // Bind primary API buttons
  dom.btnDog.addEventListener('click', fetchDog);
  dom.btnJoke.addEventListener('click', fetchJoke);
  dom.btnUser.addEventListener('click', fetchUser);
  dom.btnPost.addEventListener('click', fetchPost);
}

init();
