/* =========================================================
   Noor Kids Hub — learn page interactivity
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const tabBtns = document.querySelectorAll("[data-tab]");
  if(tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");
      noorMarkLearnTab(target.replace("panel-",""));
    });
  });

  // mark the first (default active) tab as opened too
  const activePanel = document.querySelector(".tab-panel.active");
  if(activePanel) noorMarkLearnTab(activePanel.id.replace("panel-",""));

  // accordions
  document.querySelectorAll(".accordion-head").forEach(head => {
    head.addEventListener("click", () => {
      head.closest(".accordion-item").classList.toggle("open");
    });
  });
});
