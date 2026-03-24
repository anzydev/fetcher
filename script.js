/* ═══════════════════════════════════════════════════════════
   PUBLIC API PLAYGROUND — HAND-DRAWN SKETCHBOOK EDITION
   Features: Scroll Reveals, Jiggle Hover, Playful Animations,
             Dog Finder, Joke Generator, Random User, Post Viewer
   ═══════════════════════════════════════════════════════════ */

// ── DOM REFERENCES ─────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
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
  joke: 'https://icanhazdadjoke.com/',
  user: 'https://randomuser.me/api/',
  post: 'https://jsonplaceholder.typicode.com/posts/',
};

let currentPostId = 0;

/* ══════════════════════════════════════════════════════════
   J I G G L E   H O V E R   E F F E C T
   Cards and icons rotate slightly on hover for playful feel
   ══════════════════════════════════════════════════════════ */
const JiggleHover = (() => {
  function init() {
    // Apply jiggle to result cards
    $$('.section__result').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const angle = (Math.random() - 0.5) * 3; // -1.5 to 1.5 degrees
        card.style.transform = `rotate(${angle}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotate(0deg)';
      });
    });

    // Apply jiggle to section icons
    $$('.section__icon').forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        const angle = (Math.random() - 0.5) * 6; // -3 to 3 degrees
        icon.style.transform = `rotate(${angle}deg)`;
      });

      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'rotate(0deg)';
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

/** Show hand-drawn themed loading state */
function showLoading(container) {
  container.innerHTML = `
    <div class="loader">
      <div class="loader__spinner"></div>
      <span>Scribbling...</span>
    </div>`;
}

/** Show error message */
function showError(container, message = 'Something went wrong. Try again!') {
  container.innerHTML = `<p class="result__error">✏️ ${message}</p>`;
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
    showToast('📋 URL copied!');
  } catch {
    showToast('Copy failed — try manually');
  }
}

/** Sticky-note styled toast */
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
          <img class="dog-result__img" src="${imageUrl}" alt="A ${breed} dog" />
        </div>
        <p class="dog-result__breed">${breed}</p>
        <div class="dog-result__actions">
          <button class="btn btn--sm" id="btn-copy-url" type="button">📋 Copy URL</button>
          <button class="btn btn--sm" id="btn-dog-next" type="button">✏️ Next Dog</button>
        </div>
      </div>`;

    $('#btn-copy-url').addEventListener('click', () => copyToClipboard(imageUrl));
    $('#btn-dog-next').addEventListener('click', fetchDog);
  } catch (err) {
    showError(container, 'Could not fetch a dog image. Try again!');
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
    const res = await fetch(API.joke, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    container.innerHTML = `
      <div class="joke-result">
        <p class="joke-result__punchline">${data.joke}</p>
        <div class="joke-result__actions">
          <button class="btn btn--sm" id="btn-joke-next" type="button">✏️ Next Joke</button>
        </div>
      </div>`;

    $('#btn-joke-next').addEventListener('click', fetchJoke);
  } catch (err) {
    showError(container, 'The internet has no humor right now. Try again!');
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
        <button class="btn btn--sm" id="btn-user-next" type="button">✏️ Next User</button>
      </div>`;

    $('#btn-user-next').addEventListener('click', fetchUser);
  } catch (err) {
    showError(container, 'Could not generate a user. Try again!');
    console.error('[Random User]', err);
  }
}

/* ══════════════════════════════════════════════════════════
   📝  P O S T   V I E W E R
   ══════════════════════════════════════════════════════════ */
async function fetchPost() {
  const container = dom.resultPost;
  showLoading(container);
  currentPostId = (currentPostId % 100) + 1;

  try {
    const data = await apiFetch(`${API.post}${currentPostId}`);

    container.innerHTML = `
      <div class="post-result">
        <span class="post-result__id">Post #${data.id}</span>
        <h3 class="post-result__title">${data.title}</h3>
        <p class="post-result__body">${data.body}</p>
        <button class="btn btn--sm" id="btn-post-next" type="button">✏️ Next Post</button>
      </div>`;

    $('#btn-post-next').addEventListener('click', fetchPost);
  } catch (err) {
    showError(container, 'Failed to fetch the post. Try again!');
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
  JiggleHover.init();
  ScrollReveal.init();

  // Bind primary API buttons
  dom.btnDog.addEventListener('click', fetchDog);
  dom.btnJoke.addEventListener('click', fetchJoke);
  dom.btnUser.addEventListener('click', fetchUser);
  dom.btnPost.addEventListener('click', fetchPost);
}

init();
