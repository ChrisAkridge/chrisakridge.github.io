const HEADERS = [
  "entry_id", "recorded_date", "accounted_date", "calorie_amount", "note",
  "calories_per_serving", "serving_size", "mass_consumed", "maintenance_calories_at_recording",
];

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]|^\s|\s$/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function createCsv(entries) {
  const rows = entries
    .slice()
    .sort((a, b) => a.entry_id - b.entry_id)
    .map((entry) => HEADERS.map((header) => csvCell(entry[header])).join(","));
  return [HEADERS.join(","), ...rows].join("\r\n");
}

function localDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportEntries(entries) {
  const csv = createCsv(entries);
  const file = new File([csv], `easycal-entries-${localDateStamp()}.csv`, {
    type: "text/csv;charset=utf-8",
  });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "EasyCal calorie entries" });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
      // Unsupported or failed file sharing still gets the reliable download path.
    }
  }

  downloadFile(file);
  return "downloaded";
}
