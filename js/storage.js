/* =========================================================
   Noor Kids Hub — storage & state engine
   All progress lives in localStorage under NOOR_KEY.
   ========================================================= */

const NOOR_KEY = "noorKidsHub_v1";

if(typeof structuredClone !== "function"){
  window.structuredClone = obj => JSON.parse(JSON.stringify(obj));
}

const DEFAULT_STATE = {
  name: "",
  xp: 0,
  badges: [],              // array of badge ids
  streak: 0,
  lastVisit: null,         // YYYY-MM-DD
  bestScores: {            // per-game best results
    quiz: null,            // {score, total, date}
    arabic: null,          // {moves, date}
    dua: null,             // {mistakes, date}
    salah: null,           // {tries, date}
    scramble: 0            // count solved (lifetime)
  },
  learnTabsOpened: []       // for "Knowledge Seeker" badge
};

function noorLoad(){
  try{
    const raw = localStorage.getItem(NOOR_KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return Object.assign(structuredClone(DEFAULT_STATE), parsed);
  }catch(e){
    console.warn("Noor storage read failed, resetting.", e);
    return structuredClone(DEFAULT_STATE);
  }
}

function noorSave(state){
  try{
    localStorage.setItem(NOOR_KEY, JSON.stringify(state));
  }catch(e){
    console.warn("Noor storage write failed.", e);
  }
}

function noorTodayStr(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

/* Update daily streak on every page load */
function noorUpdateStreak(){
  const state = noorLoad();
  const today = noorTodayStr();
  if(state.lastVisit === today){
    noorSave(state);
    return state;
  }
  if(state.lastVisit){
    const prev = new Date(state.lastVisit);
    const now = new Date(today);
    const diffDays = Math.round((now - prev) / 86400000);
    state.streak = diffDays === 1 ? state.streak + 1 : 1;
  }else{
    state.streak = 1;
  }
  state.lastVisit = today;
  noorSave(state);
  noorCheckStreakBadges(state);
  return state;
}

function noorCheckStreakBadges(state){
  if(state.streak >= 3) noorAwardBadge("streak_3", false);
  if(state.streak >= 7) noorAwardBadge("streak_7", false);
}

function noorLevelInfo(xp){
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for(let i=0;i<LEVELS.length;i++){
    if(xp >= LEVELS[i].minXP){
      current = LEVELS[i];
      next = LEVELS[i+1] || null;
    }
  }
  const span = next ? (next.minXP - current.minXP) : 1;
  const into = next ? (xp - current.minXP) : span;
  const pct = next ? Math.min(100, Math.round((into/span)*100)) : 100;
  return { current, next, pct };
}

/* Add XP, persist, refresh nav widgets, show toast, check xp badges */
function noorAddXP(amount, reason){
  const state = noorLoad();
  state.xp += amount;
  noorSave(state);
  if(state.xp >= 500) noorAwardBadge("xp_500", false);
  if(state.xp >= 1500) noorAwardBadge("xp_1500", false);
  noorRefreshChrome();
  if(amount > 0) noorToast(`+${amount} XP — ${reason}`, "🌟");
  return state;
}

/* Award a badge (idempotent). showToast controls whether a popup fires immediately. */
function noorAwardBadge(id, showToast=true){
  const state = noorLoad();
  if(state.badges.includes(id)) return false;
  state.badges.push(id);
  noorSave(state);
  noorRefreshChrome();
  if(showToast){
    const def = BADGES.find(b=>b.id===id);
    if(def) noorToast(`Badge earned: ${def.name}`, def.icon);
    noorConfetti();
  }
  return true;
}

function noorMarkLearnTab(tabId){
  const state = noorLoad();
  if(!state.learnTabsOpened.includes(tabId)) state.learnTabsOpened.push(tabId);
  const allTabs = ["kalimas","pillars","duas","salah","prophets","manners","ramadan"];
  const allOpened = allTabs.every(t => state.learnTabsOpened.includes(t));
  noorSave(state);
  if(allOpened) noorAwardBadge("all_learner");
}

function noorSetBestScore(game, value){
  const state = noorLoad();
  state.bestScores[game] = value;
  noorSave(state);
}

function noorIncrementScramble(){
  const state = noorLoad();
  state.bestScores.scramble = (state.bestScores.scramble || 0) + 1;
  noorSave(state);
  if(state.bestScores.scramble >= 5) noorAwardBadge("word_hero");
  return state.bestScores.scramble;
}

function noorResetProgress(){
  localStorage.removeItem(NOOR_KEY);
}

/* =========================== UI CHROME =========================== */

function noorRefreshChrome(){
  const state = noorLoad();
  const info = noorLevelInfo(state.xp);

  document.querySelectorAll("[data-xp-value]").forEach(el => el.textContent = state.xp);
  document.querySelectorAll("[data-level-title]").forEach(el => el.textContent = info.current.title);
  document.querySelectorAll("[data-level-num]").forEach(el => el.textContent = info.current.level);
  document.querySelectorAll("[data-streak-value]").forEach(el => el.textContent = state.streak);
  document.querySelectorAll("[data-badge-count]").forEach(el => el.textContent = `${state.badges.length}/${BADGES.length}`);

  document.querySelectorAll("[data-next-xp]").forEach(el => {
    el.textContent = info.next ? `${info.next.minXP - state.xp} XP to ${info.next.title}` : "Top level reached!";
  });

  // mini navbar ring
  document.querySelectorAll(".mini-ring .progress").forEach(circle => {
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c - (info.pct/100)*c;
  });

  // big dashboard ring
  document.querySelectorAll(".moon-ring .progress").forEach(circle => {
    const r = circle.r.baseVal.value;
    const c = 2*Math.PI*r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c - (info.pct/100)*c;
  });

  // name display
  document.querySelectorAll("[data-user-name]").forEach(el => {
    el.textContent = state.name ? state.name : "Little Star";
  });

  // badge grid render (if present)
  const grid = document.querySelector("[data-badge-grid]");
  if(grid){
    grid.innerHTML = BADGES.map(b => {
      const earned = state.badges.includes(b.id);
      return `<div class="badge ${earned ? "earned":""}">
        <div class="b-icon">${b.icon}</div>
        <h4>${b.name}</h4>
        <p>${earned ? b.desc : "Locked"}</p>
      </div>`;
    }).join("");
  }
}

/* Toast notification */
let noorToastTimer = null;
function noorToast(message, icon="✨"){
  let toast = document.querySelector(".toast");
  if(!toast){
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  requestAnimationFrame(()=> toast.classList.add("show"));
  clearTimeout(noorToastTimer);
  noorToastTimer = setTimeout(()=> toast.classList.remove("show"), 2800);
}

/* Lightweight confetti burst */
function noorConfetti(){
  const colors = ["#E8A33D","#16A374","#4FB3D9","#FF6F5E","#FCD98B"];
  for(let i=0;i<26;i++){
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random()*100 + "vw";
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(piece);
    const duration = 1600 + Math.random()*900;
    piece.animate([
      { transform:`translateY(0) rotate(0deg)`, opacity:1 },
      { transform:`translateY(100vh) rotate(${360+Math.random()*360}deg)`, opacity:0.9 }
    ], { duration, easing:"ease-in" });
    setTimeout(()=> piece.remove(), duration+50);
  }
}

/* Ask for name once (first visit) */
function noorEnsureName(){
  const state = noorLoad();
  if(state.name) return;
  const backdrop = document.querySelector(".name-modal-backdrop");
  if(!backdrop) return;
  backdrop.classList.add("show");
  const form = backdrop.querySelector("form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = form.querySelector("input");
    const val = input.value.trim();
    const s = noorLoad();
    s.name = val || "Little Star";
    noorSave(s);
    backdrop.classList.remove("show");
    noorRefreshChrome();
    noorToast(`Assalamu Alaikum, ${s.name}!`, "👋");
  });
}

/* Mobile nav toggle + active link highlight */
function noorInitNav(){
  const btn = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if(btn && links){
    btn.addEventListener("click", ()=> links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", ()=> links.classList.remove("open")));
  }
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
}

/* Run on every page */
document.addEventListener("DOMContentLoaded", () => {
  noorUpdateStreak();
  noorInitNav();
  noorRefreshChrome();
  noorEnsureName();

  const yearEl = document.querySelector("[data-year]");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const resetBtn = document.querySelector("[data-reset-progress]");
  if(resetBtn){
    resetBtn.addEventListener("click", () => {
      if(confirm("This will erase all XP, badges, and scores on this device. Are you sure?")){
        noorResetProgress();
        location.reload();
      }
    });
  }
});
