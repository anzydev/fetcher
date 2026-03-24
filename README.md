<div align="center">
  <br />

  <h1>✏️ PUBLIC API PLAYGROUND ✏️</h1>
  <h3><i>The "Sketchbook" Edition — Explore Real APIs on Paper</i></h3>
  
  <p>
    An interactive playground to explore real public APIs — fetch random dogs, jokes, user profiles, and posts in a <b>playful, hand-drawn sketchbook interface</b>.
  </p>

  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-Sketched-ff4d4d?style=for-the-badge&logoColor=2d2d2d&color=ff4d4d" alt="Features"></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tech_Stack-Vanilla_JS-fdfbf7?style=for-the-badge&logoColor=2d2d2d&color=fdfbf7" alt="Tech Stack"></a>
    <a href="#-apis-used"><img src="https://img.shields.io/badge/APIs-4_Available-2d5da1?style=for-the-badge&logoColor=fdfbf7&color=2d5da1" alt="APIs"></a>
  </p>
</div>

---

## ⚡ Features

### 1. Playful Interactions 🪄
Sections feature **scroll-triggered reveals** and a **jiggle hover effect** — cards and icons rotate slightly on hover for a spontaneous, sketchy feel. Buttons "press flat" on click by losing their shadow.

### 2. Four Unique API Explorers 🔍

<details open>
<summary><b>🐶 Dog Finder</b></summary>
<br/>
Fetches a random image of a dog breed from the <a href="https://dog.ceo/dog-api/">Dog API</a>.
<ul>
  <li>Images presented in wobbly, hand-drawn frames with rotation.</li>
  <li>Custom URL parsing to extract and format the exact breed name.</li>
  <li>Built-in "Copy URL" with sticky-note toast notifications.</li>
</ul>
</details>

<details open>
<summary><b>😂 Joke Generator</b></summary>
<br/>
Delivers random jokes using the <a href="https://icanhazdadjoke.com/">icanhazdadjoke API</a>.
<ul>
  <li>Punchlines highlighted in red marker accent color.</li>
</ul>
</details>

<details open>
<summary><b>👤 Random User</b></summary>
<br/>
Generates fictional identities from around the world using the <a href="https://randomuser.me/">Random User Generator</a>.
<ul>
  <li>Avatars displayed in organic, blob-shaped frames.</li>
  <li>Full data: name, email, location, age, and phone number.</li>
</ul>
</details>

<details open>
<summary><b>📝 Post Viewer</b></summary>
<br/>
Fetches sample mock-data posts from <a href="https://jsonplaceholder.typicode.com/">JSONPlaceholder</a>.
<ul>
  <li>Cycles sequentially through 100 mock posts.</li>
  <li>Drop-cap first letter and post-it style ID tags.</li>
</ul>
</details>

---

## 🛠️ Tech Stack

Built with **Zero Frameworks** — purely the foundational web triad:

| Core Technology | Usage Overview |
| :--- | :--- |
| **HTML5** | Semantic structure, accessibility (`aria-hidden`), inline SVG decorations. |
| **CSS3** | Custom properties, irregular `border-radius` for wobbly shapes, `radial-gradient` dot-grid texture, hard offset shadows, handwritten font pairing. |
| **Vanilla JS** | Modern `async/await` fetch, `IntersectionObserver` for scroll reveals, random-rotation jiggle hover effects. |

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anzydev/fetcher.git
   cd fetcher
   ```
2. **Serve the files locally:**
   ```bash
   python3 -m http.server 8080
   ```
3. **Open the application:**
   Navigate to `http://localhost:8080`

---

<p align="center">
  <br/>
  ✏️ ~ ✏️ ~ ✏️
  <br/>
  <i>Sketched with pencils & public APIs.</i>
</p>
