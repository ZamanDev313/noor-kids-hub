/* =========================================================
   Noor Kids Hub — dashboard rendering
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const scoreBox = document.querySelector("[data-score-list]");
  if(!scoreBox) return;

  const state = noorLoad();
  const rows = [
    { label:"Quiz best score", value: state.bestScores.quiz ? `${state.bestScores.quiz.score}/${state.bestScores.quiz.total}` : "Not played yet" },
    { label:"Arabic match — best moves", value: state.bestScores.arabic ? `${state.bestScores.arabic.moves} moves` : "Not played yet" },
    { label:"Dua matcher — fewest mistakes", value: state.bestScores.dua ? `${state.bestScores.dua.mistakes} mistakes` : "Not played yet" },
    { label:"Salah order — fewest tries", value: state.bestScores.salah ? `${state.bestScores.salah.tries} tries` : "Not played yet" },
    { label:"Word scrambles solved", value: `${state.bestScores.scramble || 0} words` }
  ];

  scoreBox.innerHTML = rows.map(r => `
    <div class="score-row">
      <span>${r.label}</span>
      <strong>${r.value}</strong>
    </div>
  `).join("");
});
