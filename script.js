document.body.classList.add("loading");

const loader = document.getElementById("loader");

// 🔥 SET YOUR TARGET DATE HERE
const targetDate = new Date("2026-04-21T00:00:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let isClosed = false;

function closeLoader() {
  if (isClosed) return;
  isClosed = true;
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
    document.body.classList.add("loaded");
  }, 1000);
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  if (distance <= 0) {
    clearInterval(timer);
    closeLoader();
    return;
  }
  daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((distance / (1000 * 60)) % 60);
  secondsEl.textContent = Math.floor((distance / 1000) % 60);
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

loader.addEventListener("click", closeLoader);

// ===== Markers and tooltip =====
const markers = document.querySelectorAll('.marker1, .marker2, .marker3, .marker4, .marker5, .marker6, .marker7, .marker8');
const mobileCards = document.querySelectorAll('.location-card');
const tooltip = document.getElementById('tooltip');

let currentAudio = null;
function openTooltip(markerEl) {
  if (!markerEl) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (markerEl.dataset.sound) {
    currentAudio = new Audio(markerEl.dataset.sound);
    currentAudio.volume = 0.4;
    currentAudio.loop = true;
    currentAudio.play().catch(err => console.warn("Audio play failed:", err));
  }

  tooltip.classList.add('active');
  document.body.classList.add('popup-open');

  // ← check if countdown has hit zero
  const now = new Date().getTime();
  const distance = targetDate - now;
  const countdownDone = distance <= 0;

  const innerContent = markerEl.dataset.link
    ? `<div class="image-container">
        <img src="${markerEl.dataset.img}" alt="image">
      </div>
      <div class="popup-tabs">
        <button class="tab-btn active" data-tab="lore">Lore</button>
        ${countdownDone
          ? `<button class="tab-btn" data-tab="characters">Characters</button>`
          : `<button class="tab-btn tab-btn-locked" disabled title="Unlocks when Evelia opens">Characters 🔒</button>`
        }
      </div>
      <div class="tab-panel active" id="tab-lore">
        <div class="text-content">
          <h1>${markerEl.dataset.name}</h1>
          <p>${markerEl.dataset.desc}</p>
        </div>
      </div>
      ${countdownDone
        ? `<div class="tab-panel" id="tab-characters">
            <iframe src="${markerEl.dataset.link}" style="width:100%; height:100%; border:none;"></iframe>
          </div>`
        : ``
      }`
    : `<div class="image-container">
        <img src="${markerEl.dataset.img}" alt="image">
      </div>
      <div class="text-content">
        <h1>${markerEl.dataset.name}</h1>
        <p>${markerEl.dataset.desc}</p>
        <hr>
        <h3>${markerEl.dataset.title}</h3>
        <p>${markerEl.dataset.characters}</p>
      </div>`;

  tooltip.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      ${innerContent}
    </div>
  `;

  tooltip.querySelectorAll('.tab-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      tooltip.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tooltip.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tooltip.querySelector(`#tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  tooltip.querySelector('.close-btn').addEventListener('click', () => {
    tooltip.classList.remove('active');
    document.body.classList.remove('popup-open');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  });
}



markers.forEach(marker => {
  marker.addEventListener('click', e => {
    e.stopPropagation();
    openTooltip(marker);
  });
});

mobileCards.forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('h2').textContent;
    const markerEl = Array.from(markers).find(m => m.dataset.name === name);
    openTooltip(markerEl);
  });
});

document.addEventListener('click', (e) => {
  if (!tooltip.contains(e.target) &&
      !Array.from(markers).some(m => m.contains(e.target)) &&
      !Array.from(mobileCards).some(c => c.contains(e.target))) {
    tooltip.classList.remove('active');
    document.body.classList.remove('popup-open');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }
});

// ===== Credits corner popup =====
const cornerBtn = document.getElementById("cornerBtn");
const cornerPopup = document.getElementById("cornerPopup");
const popupInner = document.querySelector(".popup-inner");

cornerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cornerPopup.classList.add("active");
});

document.querySelector(".close-corner").addEventListener("click", () => {
  cornerPopup.classList.remove("active");
});

cornerPopup.addEventListener("click", (e) => {
  if (!popupInner.contains(e.target)) {
    cornerPopup.classList.remove("active");
  }
});

// ===== Gods corner popup =====
const tbfCornerBtn = document.getElementById("tbfCornerBtn");
const tbfCornerPopup = document.getElementById("tbfCornerPopup");
const tbfPopupInner = document.getElementById("tbfPopupInner");

tbfCornerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  tbfCornerPopup.classList.add("active");
});

document.querySelector(".close-tbf-corner").addEventListener("click", () => {
  tbfCornerPopup.classList.remove("active");
});

tbfCornerPopup.addEventListener("click", (e) => {
  if (!tbfPopupInner.contains(e.target)) {
    tbfCornerPopup.classList.remove("active");
  }
});



// ===== World Info popup =====
const worldBtn = document.getElementById("worldBtn");
const worldPopup = document.getElementById("worldPopup");
const worldPopupInner = document.getElementById("worldPopupInner");

worldBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  worldPopup.classList.add("active");
});

document.querySelector(".close-world").addEventListener("click", () => {
  worldPopup.classList.remove("active");
});

worldPopup.addEventListener("click", (e) => {
  if (!worldPopupInner.contains(e.target)) {
    worldPopup.classList.remove("active");
  }
});




// ===== Evelia Music Player =====
const evAudio     = document.getElementById('evAudio');
const evBar       = document.getElementById('evBar');
const evTime      = document.getElementById('evTime');
const evDuration  = document.getElementById('evDuration');
const evPlayBtn   = document.getElementById('evPlayBtn');
const evNowPlay   = document.getElementById('evNowPlaying');
const evTracks    = document.querySelectorAll('.ev-track');

let evCurrentIdx  = 0;
let evLoaded      = false;

function evFmt(s) {
  const m = Math.floor(s / 60);
  return m + ':' + Math.floor(s % 60).toString().padStart(2, '0');
}

function evLoadTrack(idx) {
  evTracks.forEach(t => t.classList.remove('active'));
  evTracks[idx].classList.add('active');
  evCurrentIdx = idx;
  evAudio.src = evTracks[idx].dataset.src;
  evNowPlay.textContent = evTracks[idx].querySelector('.ev-track-name').textContent
    + ' — ' + evTracks[idx].querySelector('.ev-track-loc').textContent;
  evBar.style.width = '0%';
  evTime.textContent = '0:00';
  evDuration.textContent = '0:00';
  evLoaded = true;
}

function evPlay(el) {
  const idx = Array.from(evTracks).indexOf(el);
  if (idx === evCurrentIdx && evLoaded) {
    evToggle();
  } else {
    evLoadTrack(idx);
    evAudio.play();
    evPlayBtn.textContent = '⏸';
  }
}

function evToggle() {
  if (!evLoaded) { evLoadTrack(0); }
  if (evAudio.paused) {
    evAudio.play();
    evPlayBtn.textContent = '⏸';
  } else {
    evAudio.pause();
    evPlayBtn.textContent = '▶';
  }
}

function evPrev() {
  const idx = (evCurrentIdx - 1 + evTracks.length) % evTracks.length;
  evLoadTrack(idx);
  evAudio.play();
  evPlayBtn.textContent = '⏸';
}

function evNext() {
  const idx = (evCurrentIdx + 1) % evTracks.length;
  evLoadTrack(idx);
  evAudio.play();
  evPlayBtn.textContent = '⏸';
}

function evSeek(e) {
  if (!evAudio.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  evAudio.currentTime = ((e.clientX - rect.left) / rect.width) * evAudio.duration;
}

evAudio.addEventListener('timeupdate', () => {
  if (!evAudio.duration) return;
  evBar.style.width = (evAudio.currentTime / evAudio.duration * 100) + '%';
  evTime.textContent = evFmt(evAudio.currentTime);
});

evAudio.addEventListener('loadedmetadata', () => {
  evDuration.textContent = evFmt(evAudio.duration);
});

evAudio.addEventListener('ended', () => {
  evNext();
});