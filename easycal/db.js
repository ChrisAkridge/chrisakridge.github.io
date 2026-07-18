const DB_NAME = "easycal";
const DB_VERSION = 1;
const SETTINGS_KEY = "settings";

export const DEFAULT_SETTINGS = Object.freeze({
  key: SETTINGS_KEY,
  current_day_begins_at: "07:00",
  maintenance_calories: 2000,
  last_export_date: null,
  last_export_entry_count: null,
  last_export_max_entry_id: null,
});

let databasePromise;

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("Database transaction aborted."));
  });
}

export function openDatabase() {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("entries")) {
        const entries = db.createObjectStore("entries", { keyPath: "entry_id", autoIncrement: true });
        entries.createIndex("recorded_date", "recorded_date");
        entries.createIndex("accounted_date", "accounted_date");
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("EasyCal is open in another tab. Close it and reload."));
  });

  return databasePromise;
}

export async function getSettings() {
  const db = await openDatabase();
  const transaction = db.transaction("settings", "readwrite");
  const store = transaction.objectStore("settings");
  let settings = await requestResult(store.get(SETTINGS_KEY));
  if (!settings) {
    settings = { ...DEFAULT_SETTINGS };
    store.put(settings);
  } else {
    settings = { ...DEFAULT_SETTINGS, ...settings, key: SETTINGS_KEY };
  }
  await transactionDone(transaction);
  return settings;
}

export async function saveSettings(changes) {
  const current = await getSettings();
  const next = { ...current, ...changes, key: SETTINGS_KEY };
  const db = await openDatabase();
  const transaction = db.transaction("settings", "readwrite");
  transaction.objectStore("settings").put(next);
  await transactionDone(transaction);
  return next;
}

export async function addEntry(entry) {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readwrite");
  const id = await requestResult(transaction.objectStore("entries").add(entry));
  await transactionDone(transaction);
  return id;
}

export async function getAllEntries() {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readonly");
  const result = await requestResult(transaction.objectStore("entries").getAll());
  await transactionDone(transaction);
  return result;
}

export async function getEntry(entryId) {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readonly");
  const result = await requestResult(transaction.objectStore("entries").get(entryId));
  await transactionDone(transaction);
  return result;
}

export async function deleteEntry(entryId) {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readwrite");
  transaction.objectStore("entries").delete(entryId);
  await transactionDone(transaction);
}

export async function clearEntries() {
  const db = await openDatabase();
  const transaction = db.transaction("entries", "readwrite");
  transaction.objectStore("entries").clear();
  await transactionDone(transaction);
}

export async function getEntryStats() {
  const entries = await getAllEntries();
  return {
    count: entries.length,
    maxId: entries.length ? Math.max(...entries.map((entry) => entry.entry_id)) : null,
  };
}
