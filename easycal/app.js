import {
  addEntry, clearEntries, deleteEntry, getAllEntries, getEntry, getEntryStats,
  getSettings, openDatabase, saveSettings,
} from "./db.js";
import { exportEntries } from "./export.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
let toastTimer;

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shiftDate(value, days) {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + days);
  return localDate(date);
}

function currentAccountedDate(settings, now = new Date()) {
  const [hour, minute] = settings.current_day_begins_at.split(":").map(Number);
  const beforeStart = now.getHours() < hour || (now.getHours() === hour && now.getMinutes() < minute);
  return beforeStart ? shiftDate(localDate(now), -1) : localDate(now);
}

function localTimestamp(date = new Date()) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHour = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
  const offsetMinute = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":");
  return `${localDate(date)}T${time}${sign}${offsetHour}:${offsetMinute}`;
}

function formatDate(value) {
  if (!value) return "Never";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseLocalDate(value) : new Date(value);
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function formatDateTime(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function pageHeader(title, includeBack = true) {
  return `${includeBack ? '<a class="back-link" href="#/">← Home</a>' : ""}<h1>${escapeHtml(title)}</h1>`;
}

function errorSummary(message) {
  return `<div class="alert alert-danger" role="alert">${escapeHtml(message)}</div>`;
}

function entryDetails(entry) {
  const weightRows = entry.serving_size !== null ? `
    <dt>Serving size</dt><dd>${formatNumber(entry.serving_size)} g/mL</dd>
    <dt>Calories/serving</dt><dd>${formatNumber(entry.calories_per_serving)}</dd>
    <dt>Amount consumed</dt><dd>${formatNumber(entry.mass_consumed)} g/mL</dd>` : "";
  return `<dl class="detail-list">
    <dt>Recorded</dt><dd>${escapeHtml(formatDateTime(entry.recorded_date))}</dd>
    <dt>Accounted date</dt><dd>${escapeHtml(formatDate(entry.accounted_date))}</dd>
    <dt>Calories</dt><dd>${formatNumber(entry.calorie_amount)}</dd>
    <dt>Note</dt><dd class="preserve-text">${entry.note ? escapeHtml(entry.note) : "—"}</dd>
    ${weightRows}
    <dt>Maintenance at recording</dt><dd>${formatNumber(entry.maintenance_calories_at_recording)}</dd>
  </dl>`;
}

async function renderHome() {
  const [settings, entries] = await Promise.all([getSettings(), getAllEntries()]);
  const today = currentAccountedDate(settings);
  const totalFor = (date) => entries.filter((entry) => entry.accounted_date === date)
    .reduce((sum, entry) => sum + Number(entry.calorie_amount), 0);
  const todayTotal = totalFor(today);
  const days = Array.from({ length: 7 }, (_, index) => shiftDate(today, -(index + 1)));
  const rows = days.map((date) => {
    const dayEntries = entries.filter((entry) => entry.accounted_date === date)
      .sort((a, b) => a.recorded_date.localeCompare(b.recorded_date));
    const total = dayEntries.reduce((sum, entry) => sum + Number(entry.calorie_amount), 0);
    const maintenance = dayEntries.at(-1)?.maintenance_calories_at_recording ?? settings.maintenance_calories;
    const percentage = maintenance > 0 ? (total / maintenance) * 100 : 0;
    return `<tr><td>${escapeHtml(formatDate(date))}</td><td>${formatNumber(total)} / ${formatNumber(maintenance)}</td><td>${percentage.toFixed(2)}%</td></tr>`;
  }).join("");

  let exportClass = "export-status";
  let exportText = settings.last_export_date ? `Last export: ${formatDateTime(settings.last_export_date)}` : "No exports yet — make your first backup.";
  if (!settings.last_export_date) exportClass += " export-warning export-critical";
  else {
    const ageDays = (Date.now() - new Date(settings.last_export_date).getTime()) / 86400000;
    if (ageDays > 14) { exportClass += " export-overdue"; exportText = `⚠️ ${exportText} ⚠️`; }
    else if (ageDays > 10) exportClass += " export-critical";
    else if (ageDays > 7) exportClass += " export-warning";
  }

  app.innerHTML = `${pageHeader("Today", false)}
    <section class="today-card" aria-label="Current calorie total">
      <div class="today-date">${escapeHtml(formatDate(today))}</div>
      <div class="today-total">${formatNumber(todayTotal)} <span>/ ${formatNumber(settings.maintenance_calories)}</span></div>
      <div class="today-caption">calories</div>
    </section>
    <nav class="action-grid" aria-label="Main actions">
      <a class="button button-primary" href="#/add">Add Calories</a>
      <a class="button button-primary" href="#/add-weight">Add by Weight</a>
      <a class="button button-secondary" href="#/settings">Settings</a>
      <button class="button button-secondary" id="export-button" type="button">Export CSV</button>
    </nav>
    <div class="${exportClass}">${escapeHtml(exportText)}</div>
    <section class="panel">
      <div class="section-heading"><h2>Previous 7 days</h2><a href="#/entries">All entries</a></div>
      <div class="table-scroll"><table><thead><tr><th>Date</th><th>Total / Maintenance</th><th>Percent</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>`;

  document.querySelector("#export-button").addEventListener("click", handleExport);
}

function numberField({ id, label, hint = "", autofocus = false }) {
  return `<div class="form-group"><label for="${id}">${escapeHtml(label)}</label>
    ${hint ? `<div class="field-hint">${escapeHtml(hint)}</div>` : ""}
    <input id="${id}" name="${id}" type="number" inputmode="decimal" min="0" step="any" required ${autofocus ? "autofocus" : ""}>
    <div class="field-error" id="${id}-error"></div></div>`;
}

async function renderAdd(byWeight = false) {
  const settings = await getSettings();
  const accountedDate = currentAccountedDate(settings);
  app.innerHTML = `${pageHeader(byWeight ? "Add by Weight" : "Add Calories")}
    <form id="entry-form" novalidate>
      <div id="form-error"></div>
      ${byWeight ? `
        ${numberField({ id: "serving_size", label: "Serving Size (grams or mL)", autofocus: true })}
        ${numberField({ id: "calories_per_serving", label: "Calories per Serving" })}
        ${numberField({ id: "mass_consumed", label: "Consumed Amount (grams or mL)" })}
        <div class="calculation" id="calculation" aria-live="polite">Calculated calories: —</div>`
        : numberField({ id: "calorie_amount", label: "Calories", autofocus: true })}
      <div class="form-group"><label for="accounted_date">Accounted Date</label>
        <input id="accounted_date" name="accounted_date" type="date" value="${accountedDate}" required>
        <div class="field-error" id="accounted_date-error"></div></div>
      <div class="form-group"><label for="note">Notes <span class="optional">(optional)</span></label>
        <textarea id="note" name="note" rows="3"></textarea></div>
      <button class="button button-primary button-block" type="submit">Add Entry</button>
    </form>`;

  const form = document.querySelector("#entry-form");
  if (byWeight) {
    ["serving_size", "calories_per_serving", "mass_consumed"].forEach((id) => {
      document.querySelector(`#${id}`).addEventListener("input", updateCalculation);
    });
  }
  form.addEventListener("submit", (event) => handleEntrySubmit(event, byWeight));
}

function positiveValue(form, name, label, errors) {
  const value = Number(form.elements[name].value);
  if (!Number.isFinite(value) || value <= 0) errors[name] = `${label} must be above 0.`;
  return value;
}

function updateCalculation() {
  const form = document.querySelector("#entry-form");
  const serving = Number(form.elements.serving_size.value);
  const calories = Number(form.elements.calories_per_serving.value);
  const consumed = Number(form.elements.mass_consumed.value);
  const valid = serving > 0 && calories > 0 && consumed > 0;
  document.querySelector("#calculation").textContent = `Calculated calories: ${valid ? Math.round(calories * consumed / serving) : "—"}`;
}

async function handleEntrySubmit(event, byWeight) {
  event.preventDefault();
  const form = event.currentTarget;
  const errors = {};
  let calorieAmount;
  let servingSize = null;
  let caloriesPerServing = null;
  let massConsumed = null;

  if (byWeight) {
    servingSize = positiveValue(form, "serving_size", "Serving size", errors);
    caloriesPerServing = positiveValue(form, "calories_per_serving", "Calories per serving", errors);
    massConsumed = positiveValue(form, "mass_consumed", "Consumed amount", errors);
    calorieAmount = Math.round(caloriesPerServing * massConsumed / servingSize);
  } else {
    calorieAmount = Math.round(positiveValue(form, "calorie_amount", "Calories", errors));
  }
  if (!form.elements.accounted_date.value) errors.accounted_date = "Choose an accounted date.";

  form.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
  Object.entries(errors).forEach(([name, message]) => {
    const target = document.querySelector(`#${name}-error`);
    if (target) target.textContent = message;
  });
  if (Object.keys(errors).length) {
    document.querySelector("#form-error").innerHTML = errorSummary("Please correct the highlighted fields.");
    form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
    return;
  }

  const settings = await getSettings();
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    await addEntry({
      recorded_date: localTimestamp(),
      accounted_date: form.elements.accounted_date.value,
      calorie_amount: calorieAmount,
      note: form.elements.note.value || null,
      calories_per_serving: caloriesPerServing,
      serving_size: servingSize,
      mass_consumed: massConsumed,
      maintenance_calories_at_recording: settings.maintenance_calories,
    });
    location.hash = "#/";
    showToast(`Added ${formatNumber(calorieAmount)} calories.`);
  } catch (error) {
    button.disabled = false;
    document.querySelector("#form-error").innerHTML = errorSummary(error.message);
  }
}

async function renderEntries() {
  const entries = (await getAllEntries()).sort((a, b) => b.recorded_date.localeCompare(a.recorded_date));
  const rows = entries.map((entry) => `<tr>
    <td><span class="date-main">${escapeHtml(formatDate(entry.accounted_date))}</span><span class="date-sub">${escapeHtml(formatDateTime(entry.recorded_date))}</span></td>
    <td>${formatNumber(entry.calorie_amount)}</td>
    <td><button class="link-button delete-entry" data-entry-id="${entry.entry_id}" type="button">Delete</button></td>
  </tr>`).join("");
  app.innerHTML = `${pageHeader("All Entries")}
    <section class="panel"><div class="section-heading"><h2>${entries.length} ${entries.length === 1 ? "entry" : "entries"}</h2></div>
    ${entries.length ? `<div class="table-scroll"><table><thead><tr><th>Date</th><th>Calories</th><th><span class="visually-hidden">Actions</span></th></tr></thead><tbody>${rows}</tbody></table></div>` : '<p class="empty-state">No calorie entries yet.</p>'}
    </section>
    <dialog id="delete-dialog"><form method="dialog"><h2>Delete this entry?</h2><div id="delete-details"></div>
      <div class="dialog-actions"><button class="button button-secondary" value="cancel">No, keep it</button><button class="button button-danger" id="confirm-delete" value="default">Yes, delete</button></div>
    </form></dialog>`;
  document.querySelectorAll(".delete-entry").forEach((button) => button.addEventListener("click", () => openDeleteDialog(Number(button.dataset.entryId))));
}

async function openDeleteDialog(entryId) {
  const entry = await getEntry(entryId);
  if (!entry) return;
  const dialog = document.querySelector("#delete-dialog");
  document.querySelector("#delete-details").innerHTML = entryDetails(entry);
  const confirm = document.querySelector("#confirm-delete");
  confirm.onclick = async (event) => {
    event.preventDefault();
    await deleteEntry(entryId);
    dialog.close();
    await renderEntries();
    showToast("Entry deleted.");
  };
  dialog.showModal();
}

async function renderSettings() {
  const [settings, stats] = await Promise.all([getSettings(), getEntryStats()]);
  app.innerHTML = `${pageHeader("Settings")}
    <form id="settings-form" novalidate>
      <div id="form-error"></div>
      <div class="form-group"><label for="current_day_begins_at">Current Day Begins At</label>
        <div class="field-hint">Entries before this time default to the previous date.</div>
        <input id="current_day_begins_at" name="current_day_begins_at" type="time" value="${escapeHtml(settings.current_day_begins_at)}" required></div>
      <div class="form-group"><label for="maintenance_calories">Maintenance Calories</label>
        <input id="maintenance_calories" name="maintenance_calories" type="number" inputmode="decimal" min="0.01" step="any" value="${settings.maintenance_calories}" required>
        <div class="field-error" id="maintenance_calories-error"></div></div>
      <button class="button button-primary button-block" type="submit">Save Settings</button>
    </form>
    <section class="danger-zone"><h2>Clear calorie entries</h2>
      <p>This removes all ${stats.count} ${stats.count === 1 ? "entry" : "entries"} from this device. Settings and export history remain.</p>
      <button class="button button-danger" id="clear-button" type="button" ${stats.count ? "" : "disabled"}>Clear All Entries</button>
    </section>
    <dialog id="clear-dialog"></dialog>`;
  document.querySelector("#settings-form").addEventListener("submit", handleSettingsSubmit);
  document.querySelector("#clear-button").addEventListener("click", () => openClearDialog(1));
}

async function handleSettingsSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const maintenance = Number(form.elements.maintenance_calories.value);
  const dayStart = form.elements.current_day_begins_at.value;
  document.querySelector("#form-error").innerHTML = "";
  document.querySelector("#maintenance_calories-error").textContent = "";
  if (!dayStart) {
    document.querySelector("#form-error").innerHTML = errorSummary("Choose the time when your current day begins.");
    form.elements.current_day_begins_at.focus();
    return;
  }
  if (!Number.isFinite(maintenance) || maintenance <= 0) {
    document.querySelector("#maintenance_calories-error").textContent = "Maintenance calories must be above 0.";
    form.elements.maintenance_calories.focus();
    return;
  }
  await saveSettings({
    current_day_begins_at: dayStart,
    maintenance_calories: maintenance,
  });
  showToast("Settings saved.");
  location.hash = "#/";
}

async function openClearDialog(step) {
  const [settings, stats] = await Promise.all([getSettings(), getEntryStats()]);
  const dialog = document.querySelector("#clear-dialog");
  const differs = stats.count !== settings.last_export_entry_count || stats.maxId !== settings.last_export_max_entry_id;
  const warning = differs ? `<div class="data-warning">⚠️ NOT ALL CURRENT DATA MATCHES YOUR LAST EXPORT ⚠️</div>` : '<div class="alert alert-safe">Current entries match the last export metadata.</div>';
  dialog.innerHTML = `<form method="dialog">
    <h2>${step === 1 ? "Clear all entries?" : "Final confirmation"}</h2>
    ${warning}
    <dl class="detail-list">
      <dt>Entries to delete</dt><dd>${stats.count}</dd><dt>Current maximum ID</dt><dd>${stats.maxId ?? "None"}</dd>
      <dt>Last exported entries</dt><dd>${settings.last_export_entry_count ?? "No export"}</dd><dt>Last exported maximum ID</dt><dd>${settings.last_export_max_entry_id ?? "No export"}</dd>
      <dt>Last export date</dt><dd>${escapeHtml(formatDateTime(settings.last_export_date))}</dd>
    </dl>
    ${step === 2 ? '<p class="final-warning">This cannot be undone within EasyCal.</p>' : ""}
    <div class="dialog-actions"><button class="button button-secondary" value="cancel">Cancel</button>
      <button class="button button-danger" id="continue-clear" value="default">${step === 1 ? "Continue" : "Permanently Delete All"}</button></div>
  </form>`;
  document.querySelector("#continue-clear").onclick = async (event) => {
    event.preventDefault();
    dialog.close();
    if (step === 1) openClearDialog(2);
    else {
      await clearEntries();
      await renderSettings();
      showToast(`${stats.count} ${stats.count === 1 ? "entry" : "entries"} deleted.`);
    }
  };
  dialog.showModal();
}

async function handleExport(event) {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Preparing…";
  try {
    const entries = (await getAllEntries()).sort((a, b) => a.entry_id - b.entry_id);
    const outcome = await exportEntries(entries);
    if (outcome === "cancelled") {
      showToast("Export cancelled.");
    } else {
      await saveSettings({
        last_export_date: localTimestamp(),
        last_export_entry_count: entries.length,
        last_export_max_entry_id: entries.at(-1)?.entry_id ?? null,
      });
      await renderHome();
      showToast(outcome === "shared" ? "Export shared successfully." : "CSV download started.");
    }
  } catch (error) {
    button.disabled = false;
    button.textContent = "Export CSV";
    showToast(`Export failed: ${error.message}`);
  }
}

async function route() {
  const path = location.hash.slice(1) || "/";
  app.setAttribute("aria-busy", "true");
  try {
    if (path === "/") await renderHome();
    else if (path === "/add") await renderAdd(false);
    else if (path === "/add-weight") await renderAdd(true);
    else if (path === "/entries") await renderEntries();
    else if (path === "/settings") await renderSettings();
    else { location.hash = "#/"; return; }
    app.focus({ preventScroll: true });
  } catch (error) {
    app.innerHTML = `${pageHeader("EasyCal", false)}${errorSummary(`EasyCal could not load: ${error.message}`)}<button class="button button-primary" onclick="location.reload()">Reload</button>`;
  } finally {
    app.removeAttribute("aria-busy");
  }
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", async () => {
  await openDatabase();
  await route();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
});
