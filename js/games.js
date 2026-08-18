/* =========================================================
   Noor Kids Hub — games engine (runs on games.html only)
   ========================================================= */

function switchPanel(targetId){
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const target = document.getElementById(targetId);
  if(target) target.classList.add("active");
  window.scrollTo({ top: document.querySelector(".page-header")?.offsetTop || 0, behavior:"smooth" });
}

function shuffleArr(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

document.addEventListener("DOMContentLoaded", () => {
  if(!document.body.classList.contains("games-page")) return;

  document.querySelectorAll("[data-play]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-play");
      switchPanel(target);
      startGame(target);
    });
  });
  document.querySelectorAll("[data-back-hub]").forEach(btn => {
    btn.addEventListener("click", () => switchPanel("panel-hub"));
  });
});

function startGame(panelId){
  if(panelId === "panel-quiz") initQuiz();
  if(panelId === "panel-arabic") initArabicMatch();
  if(panelId === "panel-dua") initDuaMatch();
  if(panelId === "panel-salah") initSalahOrder();
  if(panelId === "panel-scramble") initScramble();
}

/* =========================================================
   1. QUIZ GAME
   ========================================================= */
let quizState = null;

function initQuiz(){
  const pool = shuffleArr(QUIZ_QUESTIONS).slice(0, 10);
  quizState = { questions: pool, index: 0, score: 0 };
  renderQuizQuestion();
}

function renderQuizQuestion(){
  const body = document.getElementById("quiz-body");
  const { questions, index } = quizState;
  if(index >= questions.length){
    renderQuizResult();
    return;
  }
  const q = questions[index];
  const opts = q.options.map((opt,i) =>
    `<button class="quiz-option" data-i="${i}">${opt}</button>`).join("");

  body.innerHTML = `
    <div class="game-hud">
      <span class="hud-pill">Question ${index+1} / ${questions.length}</span>
      <span class="hud-pill">Score: ${quizState.score}</span>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${(index/questions.length)*100}%"></div></div>
    <p class="tag">${q.cat}</p>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">${opts}</div>
    <div id="quiz-feedback"></div>
  `;

  body.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = parseInt(btn.getAttribute("data-i"));
      body.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
      const feedback = document.getElementById("quiz-feedback");
      if(chosen === q.a){
        btn.classList.add("correct");
        quizState.score++;
        feedback.innerHTML = `<div class="feedback-banner feedback-good">Correct! Mashallah 🎉</div>`;
        noorAddXP(10, "correct answer");
      }else{
        btn.classList.add("wrong");
        body.querySelectorAll(".quiz-option")[q.a].classList.add("correct");
        feedback.innerHTML = `<div class="feedback-banner feedback-bad">Not quite — the right answer is highlighted.</div>`;
      }
      setTimeout(() => { quizState.index++; renderQuizQuestion(); }, 1300);
    });
  });
}

function renderQuizResult(){
  const body = document.getElementById("quiz-body");
  const { score, questions } = quizState;
  const total = questions.length;
  noorSetBestScore("quiz", { score, total, date: noorTodayStr() });
  noorAwardBadge("first_steps");
  if(score >= 8) noorAwardBadge("quiz_wizard");
  if(score === total) noorAwardBadge("quiz_perfect");

  const emoji = score === total ? "🏆" : score >= 8 ? "🌟" : score >= 5 ? "🙂" : "🌙";
  body.innerHTML = `
    <div class="result-panel">
      <div class="big-emoji">${emoji}</div>
      <h3>You scored ${score} / ${total}</h3>
      <p>Great effort! Keep learning and try again to beat your score, inshaAllah.</p>
      <div class="hero-cta" style="justify-content:center;">
        <button class="btn btn-primary" onclick="initQuiz()">Play Again</button>
        <button class="btn btn-secondary" data-back-hub>Back to Games</button>
      </div>
    </div>`;
  body.querySelector("[data-back-hub]").addEventListener("click", ()=> switchPanel("panel-hub"));
}

/* =========================================================
   2. ARABIC LETTER MATCH (memory game)
   ========================================================= */
let arabicState = null;

function initArabicMatch(){
  const chosen = shuffleArr(ARABIC_LETTERS).slice(0,6);
  let cards = [];
  chosen.forEach((item, i) => {
    cards.push({ id:i, type:"ar", label:item.ar, pairId:i });
    cards.push({ id:i+100, type:"name", label:item.name, pairId:i });
  });
  cards = shuffleArr(cards);
  arabicState = { cards, flipped: [], matched: [], moves: 0 };
  renderArabicMatch();
}

function renderArabicMatch(){
  const body = document.getElementById("arabic-body");
  const { cards, matched, moves } = arabicState;
  body.innerHTML = `
    <div class="game-hud">
      <span class="hud-pill">Moves: ${moves}</span>
      <span class="hud-pill">Matched: ${matched.length/2} / ${cards.length/2}</span>
    </div>
    <div class="memory-grid">
      ${cards.map(c => `
        <div class="memory-card ${arabicState.flipped.includes(c.id)||matched.includes(c.id) ? "flipped":""} ${matched.includes(c.id) ? "matched":""}" data-id="${c.id}">
          <div class="memory-card-inner">
            <div class="memory-face memory-front">?</div>
            <div class="memory-face memory-back">${c.label}</div>
          </div>
        </div>`).join("")}
    </div>
    <div id="arabic-feedback"></div>
  `;

  body.querySelectorAll(".memory-card").forEach(el => {
    el.addEventListener("click", () => onArabicCardClick(parseInt(el.getAttribute("data-id"))));
  });

  if(matched.length === cards.length && cards.length > 0){
    noorSetBestScore("arabic", { moves, date: noorTodayStr() });
    noorAwardBadge("first_steps");
    noorAwardBadge("arabic_explorer");
    document.getElementById("arabic-feedback").innerHTML = `
      <div class="result-panel">
        <div class="big-emoji">🕌</div>
        <h3>All matched in ${moves} moves!</h3>
        <div class="hero-cta" style="justify-content:center;">
          <button class="btn btn-primary" onclick="initArabicMatch()">Play Again</button>
          <button class="btn btn-secondary" data-back-hub>Back to Games</button>
        </div>
      </div>`;
    document.querySelector("#arabic-feedback [data-back-hub]").addEventListener("click", ()=> switchPanel("panel-hub"));
  }
}

function onArabicCardClick(id){
  const s = arabicState;
  if(s.matched.includes(id) || s.flipped.includes(id) || s.flipped.length === 2) return;
  s.flipped.push(id);
  if(s.flipped.length === 2){
    s.moves++;
    const [a,b] = s.flipped.map(fid => s.cards.find(c=>c.id===fid));
    if(a.pairId === b.pairId && a.type !== b.type){
      s.matched.push(a.id, b.id);
      s.flipped = [];
      noorAddXP(15, "letter match");
      renderArabicMatch();
    }else{
      renderArabicMatch();
      setTimeout(() => { s.flipped = []; renderArabicMatch(); }, 800);
    }
  }else{
    renderArabicMatch();
  }
}

/* =========================================================
   3. DUA MATCHER
   ========================================================= */
let duaState = null;

function initDuaMatch(){
  const chosen = shuffleArr(DUAS).slice(0,5);
  duaState = {
    left: chosen.map((d,i)=>({ id:i, text:d.name })),
    right: shuffleArr(chosen.map((d,i)=>({ id:i, text:d.meaning }))),
    selectedLeft: null,
    matched: [],
    mistakes: 0
  };
  renderDuaMatch();
}

function renderDuaMatch(){
  const body = document.getElementById("dua-body");
  const { left, right, matched, mistakes, selectedLeft } = duaState;
  body.innerHTML = `
    <div class="game-hud">
      <span class="hud-pill">Matched: ${matched.length} / ${left.length}</span>
      <span class="hud-pill">Mistakes: ${mistakes}</span>
    </div>
    <p style="color:var(--navy-soft);font-weight:700;margin-bottom:14px;">Tap a dua name, then tap its matching meaning.</p>
    <div class="match-columns">
      <div>${left.map(l => `<button class="match-item ${matched.includes(l.id)?"matched":""} ${selectedLeft===l.id?"selected":""}" data-side="left" data-id="${l.id}" ${matched.includes(l.id)?"disabled":""}>${l.text}</button>`).join("")}</div>
      <div>${right.map(r => `<button class="match-item ${matched.includes(r.id)?"matched":""}" data-side="right" data-id="${r.id}" ${matched.includes(r.id)?"disabled":""}>${r.text}</button>`).join("")}</div>
    </div>
    <div id="dua-feedback"></div>
  `;

  body.querySelectorAll(".match-item").forEach(btn => {
    btn.addEventListener("click", () => onDuaItemClick(btn.getAttribute("data-side"), parseInt(btn.getAttribute("data-id"))));
  });

  if(matched.length === left.length && left.length > 0){
    noorSetBestScore("dua", { mistakes, date: noorTodayStr() });
    noorAwardBadge("first_steps");
    if(mistakes === 0) noorAwardBadge("dua_master");
    document.getElementById("dua-feedback").innerHTML = `
      <div class="result-panel">
        <div class="big-emoji">🤲</div>
        <h3>All duas matched!</h3>
        <p>${mistakes===0 ? "Perfect run — no mistakes at all!" : `You matched them all with ${mistakes} mistake(s).`}</p>
        <div class="hero-cta" style="justify-content:center;">
          <button class="btn btn-primary" onclick="initDuaMatch()">Play Again</button>
          <button class="btn btn-secondary" data-back-hub>Back to Games</button>
        </div>
      </div>`;
    document.querySelector("#dua-feedback [data-back-hub]").addEventListener("click", ()=> switchPanel("panel-hub"));
  }
}

function onDuaItemClick(side, id){
  const s = duaState;
  if(s.matched.includes(id) && side==="left") return;
  if(side === "left"){
    s.selectedLeft = id;
    renderDuaMatch();
    return;
  }
  if(side === "right" && s.selectedLeft !== null){
    if(s.selectedLeft === id){
      s.matched.push(id);
      s.selectedLeft = null;
      noorAddXP(12, "dua matched");
      renderDuaMatch();
    }else{
      s.mistakes++;
      s.selectedLeft = null;
      renderDuaMatch();
    }
  }
}

/* =========================================================
   4. SALAH ORDER
   ========================================================= */
let salahState = null;

function initSalahOrder(){
  salahState = { order: shuffleArr(SALAH_STEPS), tries: 0 };
  renderSalahOrder();
}

function renderSalahOrder(){
  const body = document.getElementById("salah-body");
  const { order, tries } = salahState;
  body.innerHTML = `
    <div class="game-hud">
      <span class="hud-pill">Tries: ${tries}</span>
    </div>
    <p style="color:var(--navy-soft);font-weight:700;margin-bottom:14px;">Use the arrows to arrange the steps of Salah in the correct order, then check your answer.</p>
    <div class="order-list">
      ${order.map((step,i) => `
        <div class="order-item">
          <span class="num">${i+1}</span>
          <span style="flex:1;">${step}</span>
          <button class="btn btn-ghost btn-sm" data-move="up" data-i="${i}" aria-label="Move up">▲</button>
          <button class="btn btn-ghost btn-sm" data-move="down" data-i="${i}" aria-label="Move down">▼</button>
        </div>`).join("")}
    </div>
    <div class="hero-cta" style="justify-content:center;margin-top:20px;">
      <button class="btn btn-primary" id="salah-check">Check Order</button>
    </div>
    <div id="salah-feedback"></div>
  `;

  body.querySelectorAll("[data-move]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-i"));
      const dir = btn.getAttribute("data-move");
      const j = dir === "up" ? i-1 : i+1;
      if(j < 0 || j >= salahState.order.length) return;
      [salahState.order[i], salahState.order[j]] = [salahState.order[j], salahState.order[i]];
      renderSalahOrder();
    });
  });

  body.querySelector("#salah-check").addEventListener("click", checkSalahOrder);
}

function checkSalahOrder(){
  const s = salahState;
  s.tries++;
  const correct = s.order.every((step,i) => step === SALAH_STEPS[i]);
  const feedback = document.getElementById("salah-feedback");
  if(correct){
    noorSetBestScore("salah", { tries: s.tries, date: noorTodayStr() });
    noorAwardBadge("first_steps");
    noorAwardBadge("salah_star");
    noorAddXP(20, "Salah steps in order");
    feedback.innerHTML = `
      <div class="result-panel">
        <div class="big-emoji">⭐</div>
        <h3>MashaAllah — perfect order!</h3>
        <p>It took you ${s.tries} tr${s.tries===1?"y":"ies"}.</p>
        <div class="hero-cta" style="justify-content:center;">
          <button class="btn btn-primary" onclick="initSalahOrder()">Play Again</button>
          <button class="btn btn-secondary" data-back-hub>Back to Games</button>
        </div>
      </div>`;
    document.querySelector("#salah-feedback [data-back-hub]").addEventListener("click", ()=> switchPanel("panel-hub"));
  }else{
    feedback.innerHTML = `<div class="feedback-banner feedback-bad">Not quite in order yet — use the arrows and try again!</div>`;
  }
}

/* =========================================================
   5. WORD SCRAMBLE
   ========================================================= */
let scrambleState = null;

function scrambleWord(word){
  let letters = word.split("");
  let scrambled;
  do{
    scrambled = shuffleArr(letters).join("");
  }while(scrambled === word && word.length > 1);
  return scrambled;
}

function initScramble(){
  const item = SCRAMBLE_WORDS[Math.floor(Math.random()*SCRAMBLE_WORDS.length)];
  scrambleState = { word: item.word, hint: item.hint, scrambled: scrambleWord(item.word), tries:0 };
  renderScramble();
}

function renderScramble(){
  const body = document.getElementById("scramble-body");
  const s = scrambleState;
  body.innerHTML = `
    <div class="game-hud">
      <span class="hud-pill">Solved so far: <span data-scramble-count>${noorLoad().bestScores.scramble || 0}</span></span>
    </div>
    <p style="text-align:center;color:var(--navy-soft);font-weight:700;">Hint: ${s.hint}</p>
    <div class="scramble-word">${s.scrambled.split("").join(" ")}</div>
    <input type="text" class="scramble-input" id="scramble-input" placeholder="Type your answer" autocomplete="off" />
    <div class="hero-cta" style="justify-content:center;">
      <button class="btn btn-primary" id="scramble-check">Check</button>
      <button class="btn btn-secondary" id="scramble-skip">New Word</button>
    </div>
    <div id="scramble-feedback"></div>
  `;

  const input = document.getElementById("scramble-input");
  input.addEventListener("keydown", e => { if(e.key === "Enter") checkScramble(); });
  document.getElementById("scramble-check").addEventListener("click", checkScramble);
  document.getElementById("scramble-skip").addEventListener("click", initScramble);
  input.focus();
}

function checkScramble(){
  const input = document.getElementById("scramble-input");
  const feedback = document.getElementById("scramble-feedback");
  const guess = input.value.trim().toUpperCase();
  if(guess === scrambleState.word){
    const count = noorIncrementScramble();
    noorAwardBadge("first_steps");
    noorAddXP(10, "word solved");
    feedback.innerHTML = `<div class="feedback-banner feedback-good">Correct! It was ${scrambleState.word} 🎉</div>`;
    setTimeout(initScramble, 1200);
  }else{
    scrambleState.tries++;
    feedback.innerHTML = `<div class="feedback-banner feedback-bad">Try again! (${scrambleState.tries} attempt${scrambleState.tries===1?"":"s"})</div>`;
  }
}
