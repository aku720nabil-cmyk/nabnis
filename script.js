const KOLEKSI = [
  {
    type: "photo",
    src: "assets/foto/1.jpg",
    title: "Apaaa Nich Kok Ada Foto Kamu Digaleriku",
    caption: "Waktu itu aku belum tahu, akan sepenting apa kamu nantinya.",
    date: "29 Agustus 2025"
  },
  {
    type: "photo",
    src: "assets/foto/2.jpg",
    title: "Buat Siapa Tuchhh",
    caption: "masa masa bingung Nab Nab wkwkwkw.",
    date: "5 September 2025"
  },
  {
    type: "video",
    src: "assets/video/1.mp4",
    title: "Cantikk Nyoo",
    caption: "ada senyum yang cuma bisa direkam, nggak bisa diulang persis sama.",
    date: "love you sayangg"
  },
  {
    type: "photo",
    src: "assets/foto/3.jpg",
    title: "Mw Foto Ngga",
    caption: "Wkwkwkwk masih gapercaya kamu ngajak aku fotbar.",
    date: "7 September 2025"
  },
  {
    type: "photo",
    src: "assets/foto/4.jpg",
    title: "First Date Nich",
    caption: "maniss bangettt.",
    date: "12 September 2025"
  },
  {
    type: "video",
    src: "assets/video/2.mp4",
    title: "Udah Photobook Aja",
    caption: "cantik bangetttt.",
    date: "btw makasih dikasih fotonyaa"
  },
  {
    type: "photo",
    src: "assets/foto/5.jpg",
    title: "Udah Lama Kita Yaa",
    caption: "pertahanin kayak gini terus yukk.",
    date: "12 Mei 2026"
  },
  {
    type: "video",
    src: "assets/video/3.mp4",
    title: "Semua Aku Dirayakan",
    caption: "makasih udah rayain ulang tahun aku sayangg.",
    date: "21 Juli 2026"
  },
  {
    type: "photo",
    src: "assets/foto/6.jpg",
    title: "Udah mau Ldr yah :(",
    caption: "ngga kerasa kamu udah nemenin aku hampir 1 tahun.",
    date: "Sampai Kapan Pun"
  }
];

const cover        = document.getElementById("cover");
const gallery      = document.getElementById("gallery");
const enterBtn     = document.getElementById("enterBtn");
const exhibitsEl   = document.getElementById("exhibits");
const dotsEl       = document.getElementById("dots");
const navCurrent   = document.getElementById("navCurrent");
const navTotal     = document.getElementById("navTotal");
const muteBtn      = document.getElementById("muteBtn");
const bgm          = document.getElementById("bgm");
const particlesEl  = document.getElementById("particles");
const scrollBarFill= document.getElementById("scrollBarFill");
const scrollCue    = document.querySelector(".scroll-cue");

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------- partikel melayang (kunang-kunang emas) --------- */
function spawnParticles(count = 26){
  if (REDUCE_MOTION) return;
  for (let i = 0; i < count; i++){
    const p = document.createElement("div");
    p.className = "particle";
    const size = 3 + Math.random() * 5;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = -Math.random() * duration;
    const drift = (Math.random() * 80 - 40).toFixed(0) + "px";
    const opacity = (0.35 + Math.random() * 0.5).toFixed(2);

    p.style.left = left + "vw";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";
    p.style.setProperty("--p-drift", drift);
    p.style.setProperty("--p-op", opacity);

    particlesEl.appendChild(p);
  }
}

/* --------- render exhibit dari data KOLEKSI --------- */
function pad(n){ return String(n).padStart(2, "0"); }

function buildExhibits(){
  navTotal.textContent = pad(KOLEKSI.length);

  KOLEKSI.forEach((item, i) => {
    const num = i + 1;

    const section = document.createElement("section");
    section.className = "exhibit";
    section.dataset.index = num;

    const spotlight = document.createElement("div");
    spotlight.className = "spotlight";
    section.appendChild(spotlight);

    const frame = document.createElement("div");
    frame.className = `frame ${item.type}`;

    let mediaEl;
    if (item.type === "video"){
      mediaEl = document.createElement("video");
      mediaEl.src = item.src;
      mediaEl.muted = true;
      mediaEl.loop = true;
      mediaEl.playsInline = true;
      mediaEl.preload = "metadata";
    } else {
      mediaEl = document.createElement("img");
      mediaEl.src = item.src;
      mediaEl.alt = item.title;
      mediaEl.loading = "lazy";
    }

    /* fallback rapi kalau file belum ditaruh user */
    const fallback = document.createElement("div");
    fallback.className = "media-fallback";
    fallback.hidden = true;


    mediaEl.addEventListener("error", () => {
      mediaEl.style.display = "none";
      fallback.hidden = false;
    });

    frame.appendChild(mediaEl);
    frame.appendChild(fallback);

    /* stroke berkilau yang berjalan menyusuri tepi bingkai */
    const svgNS = "http://www.w3.org/2000/svg";
    const strokeSvg = document.createElementNS(svgNS, "svg");
    strokeSvg.classList.add("frame-stroke");
    strokeSvg.setAttribute("preserveAspectRatio", "none");
    // viewBox disamakan rasionya dengan bingkai (4:5 untuk foto, 16:9 untuk video)
    // supaya stroke bergerak rata di semua sisi, tidak melar/berputar.
    strokeSvg.setAttribute("viewBox", item.type === "video" ? "0 0 320 180" : "0 0 320 400");
    const vbW = item.type === "video" ? 320 : 320;
    const vbH = item.type === "video" ? 180 : 400;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", "2");
    rect.setAttribute("y", "2");
    rect.setAttribute("width", vbW - 4);
    rect.setAttribute("height", vbH - 4);
    rect.setAttribute("pathLength", "100");
    strokeSvg.appendChild(rect);
    frame.appendChild(strokeSvg);

    const tag = document.createElement("span");
    tag.className = "medium-tag";
    tag.textContent = item.type === "video" ? "Video" : "Foto";
    frame.appendChild(tag);

    section.appendChild(frame);

    const plaque = document.createElement("div");
    plaque.className = "plaque";
    plaque.innerHTML = `
      <p class="plaque-title">${item.title}</p>
      <p class="plaque-caption">&ldquo;${item.caption}&rdquo;</p>
      <p class="plaque-meta">${item.date}</p>
    `;
    section.appendChild(plaque);

    exhibitsEl.appendChild(section);

    /* titik navigasi di sisi kanan */
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.dataset.index = num;
    dot.title = item.title;
    dot.addEventListener("click", () => {
      section.scrollIntoView({ behavior: "smooth" });
    });
    dotsEl.appendChild(dot);
  });

  /* section penutup */
  const closing = document.createElement("section");
  closing.className = "exhibit closing";
  closing.innerHTML = `
    <h2 class="closing-title">TERIMAKASIH SAYANG UDAH NEMENIN AKU SELAMA INI</h2>
    <p class="closing-text">Koleksi kecil ini akan terus bertambah, selama kita terus menulis cerita bersama.</p>
    <button class="restart" id="restartBtn">Lihat dari Awal</button>
  `;
  exhibitsEl.appendChild(closing);

  document.getElementById("restartBtn").addEventListener("click", () => {
    exhibitsEl.querySelector(".exhibit").scrollIntoView({ behavior: "smooth" });
  });
}

/* --------- buka galeri dari sampul --------- */
function openGallery(){
  cover.classList.add("hide");
  gallery.hidden = false;

  bgm.volume = 0.55;
  bgm.play().catch(() => { /* browser tetap boleh menolak, ada tombol mute manual */ });
  muteBtn.classList.remove("muted");

  setTimeout(() => {
    document.body.style.overflow = "auto";
    observeExhibits();
  }, 300);
}

enterBtn.addEventListener("click", openGallery, { once: true });

/* --------- reveal + autoplay video saat masuk viewport --------- */
function observeExhibits(){
  const allExhibits = document.querySelectorAll(".exhibit");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const video = section.querySelector("video");
      const idx = section.dataset.index;

      if (entry.isIntersecting){
        section.classList.add("in-view");
        if (video) video.play().catch(() => {});
        if (idx){
          navCurrent.textContent = pad(idx);
          dotsEl.querySelectorAll(".dot").forEach(d => {
            d.classList.toggle("active", d.dataset.index === idx);
          });
        }
      } else {
        if (video) video.pause();
      }
    });
  }, { threshold: 0.55 });

  allExhibits.forEach(el => revealObserver.observe(el));
}

/* --------- tombol musik --------- */
muteBtn.addEventListener("click", () => {
  if (bgm.muted){
    bgm.muted = false;
    muteBtn.classList.remove("muted");
    muteBtn.textContent = "♪";
  } else {
    bgm.muted = true;
    muteBtn.classList.add("muted");
    muteBtn.textContent = "✕";
  }
});

/* --------- bar progres baca --------- */
function updateScrollBar(){
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (scrollTop / max) * 100 : 0;
  scrollBarFill.style.width = pct + "%";

  if (scrollCue && scrollTop > 40){
    scrollCue.classList.add("hide");
  }
}
window.addEventListener("scroll", updateScrollBar, { passive: true });

/* --------- tilt 3D lembut pada frame (khusus perangkat dengan mouse) --------- */
function enableTilt(){
  if (REDUCE_MOTION || window.matchMedia("(hover:none)").matches) return;

  document.querySelectorAll(".frame").forEach(frame => {
    frame.addEventListener("mousemove", (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.015)`;
    });
    frame.addEventListener("mouseleave", () => {
      frame.style.transform = "perspective(700px) rotateY(0) rotateX(0) scale(1)";
    });
  });
}

/* --------- init --------- */
buildExhibits();
spawnParticles();
enableTilt();