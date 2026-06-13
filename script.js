"use strict";

/* Your Life in Weeks
 * Each cell is one week. Weeks already lived are filled in.
 * We treat a year as exactly 52 weeks so the grid stays tidy and the
 * progress bar reaches 100% precisely at your life-expectancy age. */

const WEEKS_PER_YEAR = 52;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "lifeInWeeks";

const els = {
  dob: document.getElementById("dob"),
  age: document.getElementById("age"),
  grid: document.getElementById("grid"),
  stats: document.getElementById("stats"),
  progressFill: document.getElementById("progressFill"),
  progressLabel: document.getElementById("progressLabel"),
  hint: document.getElementById("hint"),
  prompt: document.getElementById("prompt"),
};

const fmt = (n) => Math.round(n).toLocaleString("en-US");

function clampAge(raw) {
  let n = parseInt(raw, 10);
  if (Number.isNaN(n)) n = 70;
  return Math.min(150, Math.max(1, n));
}

/* ---- persistence ---- */
function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.dob) els.dob.value = saved.dob;
    if (saved.age) els.age.value = saved.age;
  } catch (_) {
    /* ignore corrupt/blocked storage */
  }
}
function persist() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dob: els.dob.value, age: els.age.value })
    );
  } catch (_) {
    /* storage may be unavailable (private mode); not critical */
  }
}

/* ---- core ---- */
function computeWeeksLived(dobStr) {
  if (!dobStr) return { state: "empty" };
  const dob = new Date(dobStr + "T00:00:00");
  if (Number.isNaN(dob.getTime())) return { state: "empty" };
  const now = new Date();
  if (dob > now) return { state: "future" };
  const ageYears = (now - dob) / MS_PER_YEAR;
  return { state: "ok", weeksLived: Math.floor(ageYears * WEEKS_PER_YEAR) };
}

function buildGrid(totalWeeks, weeksLived) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < totalWeeks; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (weeksLived !== null) {
      if (i < weeksLived) cell.classList.add("lived");
      else if (i === weeksLived) cell.classList.add("current");
    }
    const year = Math.floor(i / WEEKS_PER_YEAR);
    const week = (i % WEEKS_PER_YEAR) + 1;
    cell.title = `Age ${year}, week ${week}`;
    frag.appendChild(cell);
  }
  els.grid.replaceChildren(frag);
}

function renderStats(weeksLived, totalWeeks) {
  const livedShown = Math.min(weeksLived, totalWeeks);
  const weeksLeft = Math.max(0, totalWeeks - weeksLived);
  const cards = [
    { value: fmt(livedShown), label: "Weeks lived", gold: true },
    { value: fmt(weeksLeft), label: "Weeks remaining" },
    { value: fmt(weeksLeft / WEEKS_PER_YEAR) + " yrs", label: "Time left" },
  ];
  els.stats.innerHTML = cards
    .map(
      (c) =>
        `<div class="stat"><div class="stat-value${
          c.gold ? " gold" : ""
        }">${c.value}</div><div class="stat-label">${c.label}</div></div>`
    )
    .join("");
}

function renderEmptyStats() {
  els.stats.innerHTML = "";
}

function render() {
  const age = clampAge(els.age.value);
  const totalWeeks = age * WEEKS_PER_YEAR;
  const result = computeWeeksLived(els.dob.value);

  if (result.state === "ok") {
    const { weeksLived } = result;
    const pct = Math.min(100, (weeksLived / totalWeeks) * 100);
    const weeksLeft = Math.max(0, totalWeeks - weeksLived);

    buildGrid(totalWeeks, weeksLived);
    renderStats(weeksLived, totalWeeks);

    els.progressFill.style.width = pct + "%";
    els.progressLabel.textContent = pct.toFixed(1) + "%";

    els.hint.textContent = "";
    els.hint.classList.remove("warn");

    if (weeksLeft > 0) {
      els.prompt.innerHTML = `You have about <strong>${fmt(
        weeksLeft
      )}</strong> weeks left.<br>What are you waiting for?`;
    } else {
      els.prompt.textContent = "Every week from here is a bonus. Make it count.";
    }
  } else {
    // No (or invalid) date yet: show the empty life ahead.
    buildGrid(totalWeeks, null);
    renderEmptyStats();
    els.progressFill.style.width = "0%";
    els.progressLabel.textContent = "0%";
    els.prompt.textContent = "What are you waiting for?";

    if (result.state === "future") {
      els.hint.textContent = "That date is in the future — try your real birthday.";
      els.hint.classList.add("warn");
    } else {
      els.hint.textContent =
        "Enter your date of birth to fill in the weeks you've already lived.";
      els.hint.classList.remove("warn");
    }
  }
}

function onChange() {
  // Keep the age field within range visually too.
  const clamped = clampAge(els.age.value);
  if (els.age.value !== "" && String(clamped) !== els.age.value) {
    // Don't fight the user mid-typing; only snap obviously out-of-range values.
    if (parseInt(els.age.value, 10) > 150 || parseInt(els.age.value, 10) < 1) {
      els.age.value = clamped;
    }
  }
  persist();
  render();
}

loadSaved();
els.dob.addEventListener("input", onChange);
els.age.addEventListener("input", onChange);
els.age.addEventListener("change", onChange);
render();
