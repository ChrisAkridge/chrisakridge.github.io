# EasyCal Tech Spec

This document describes the high-level technical approach for implementing EasyCal as a static, offline-first PWA for iPhone Safari and home-screen use.

## Goals

- Make calorie entry very fast on an iPhone.
- Store all working data locally in IndexedDB.
- Export all entries as a complete CSV archive for external processing.
- Avoid server-side infrastructure, accounts, sync, and analytics.
- Keep in-app analysis intentionally minimal.

## Deployment Model

EasyCal can be implemented as a static web app and hosted from GitHub Pages.

Required browser-facing files:

```text
easycal/
  index.html
  styles.css
  app.js
  db.js
  export.js
  manifest.webmanifest
  service-worker.js
  icons/
```

No backend is required. GitHub Pages provides HTTPS, which is required for service workers, installability, and Web Share API support.

## PWA Requirements

The app should include:

- `manifest.webmanifest` with `name`, `short_name`, `start_url`, `scope`, `display`, `theme_color`, `background_color`, and icons.
- Apple home-screen metadata in `index.html`:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-title`
  - `apple-mobile-web-app-status-bar-style`
  - `apple-touch-icon`
- A service worker that precaches the app shell.
- A mobile viewport tag using `width=device-width, initial-scale=1`.

The service worker should cache static app assets only. User data belongs in IndexedDB, not the Cache API.

## Application Architecture

A small vanilla JavaScript app is sufficient. The app can use hash routing to avoid server rewrite requirements on GitHub Pages:

```text
#/
#/add
#/add-weight
#/entries
#/settings
```

Suggested modules:

- `app.js`: routing, rendering, form handling, and page orchestration.
- `db.js`: all IndexedDB reads/writes and schema upgrades.
- `export.js`: CSV generation, escaping, file creation, and share/download fallback.
- `styles.css`: mobile-first layout and visual states.

The app should render from state after every write. Avoid keeping a second long-lived in-memory copy of the database.

## IndexedDB Schema

Database name:

```text
easycal
```

Initial version:

```text
1
```

Object stores:

```text
entries
  keyPath: entry_id
  autoIncrement: true
  indexes:
    recorded_date
    accounted_date

settings
  keyPath: key
```

The `settings` store should contain one row:

```javascript
{
  key: "settings",
  current_day_begins_at: "07:00",
  maintenance_calories: 2000,
  last_export_date: null,
  last_export_entry_count: null,
  last_export_max_entry_id: null
}
```

An entry row should use stable JSON-compatible values:

```javascript
{
  entry_id: 1,
  recorded_date: "2026-07-14T21:30:00-04:00",
  accounted_date: "2026-07-14",
  calorie_amount: 450,
  note: "Dinner",
  calories_per_serving: null,
  serving_size: null,
  mass_consumed: null,
  maintenance_calories_at_recording: 2000
}
```

## Date and Time Rules

Store dates as strings rather than relying on ambiguous JavaScript `Date` serialization.

- `recorded_date`: ISO 8601 local timestamp with UTC offset.
- `accounted_date`: local date string in `YYYY-MM-DD` format.
- `current_day_begins_at`: local time string in `HH:mm` format.

When defaulting `accounted_date`:

1. Get the current local date and time.
2. Compare the current local time to `current_day_begins_at`.
3. If current time is earlier than the configured day start, default to yesterday's local date.
4. Otherwise default to today's local date.

This defaulting rule should apply on both add-entry screens.

## Entry Creation

Direct entry requires:

- `calorie_amount > 0`
- Optional `note`
- User-selectable `accounted_date`

By-weight entry requires:

- `serving_size > 0`
- `calories_per_serving > 0`
- `mass_consumed > 0`

The by-weight calorie amount should be calculated as:

```javascript
calorie_amount = Math.round(calories_per_serving * mass_consumed / serving_size)
```

Every new entry should copy the current settings value into `maintenance_calories_at_recording` at save time.

## Home Page Data

The home page should query IndexedDB for the relevant date range and compute totals in JavaScript.

Current-day display:

- Sum entries whose `accounted_date` is the current accounted date.
- Use current `settings.maintenance_calories` as the displayed maintenance value.

Previous 7 days:

- For each date, sum entries by `accounted_date`.
- Use the `maintenance_calories_at_recording` value from the last entry for that accounted date.
- If a date has no entries, fall back to current `settings.maintenance_calories`.

The app should not attempt deeper analysis. Exported CSV is the analysis boundary.

## CSV Export

CSV export should include every entry row in ascending `entry_id` order.

Recommended header:

```csv
entry_id,recorded_date,accounted_date,calorie_amount,note,calories_per_serving,serving_size,mass_consumed,maintenance_calories_at_recording
```

CSV generation rules:

- Export nullable fields as empty cells.
- Quote fields containing commas, quotes, CR/LF, or leading/trailing whitespace.
- Escape embedded quotes by doubling them.
- Preserve notes exactly, including newlines.
- Use `text/csv;charset=utf-8`.

After generating the CSV:

1. Create a `File` or `Blob` named with the current date, such as `easycal-entries-2026-07-14.csv`.
2. If `navigator.canShare({ files })` and `navigator.share` support the file, invoke native share from the export button click.
3. If native file sharing is unavailable or fails due to unsupported file sharing, fall back to a normal browser download.
4. If the share promise resolves, update:
   - `last_export_date`
   - `last_export_entry_count`
   - `last_export_max_entry_id`

The app cannot prove that the user emailed or permanently saved the file. It can only know that the native share flow resolved.

## Clear Entries Flow

Clearing entries should delete only the `entries` store contents. It should preserve settings and export metadata.

Before clearing:

1. Count current entries.
2. Find current maximum `entry_id`.
3. Display last export date, last exported count, and last exported maximum `entry_id`.
4. Show two confirmation modals.
5. If current count or current max id differs from the last export metadata, display an especially strong warning.

After clearing:

- Leave `last_export_*` metadata unchanged.
- Re-render the home page and entry list from IndexedDB.

## iOS PWA Constraints

Important iOS limitations:

- IndexedDB is local browser-managed storage. It can be lost if the user deletes the PWA, clears website data, or if the browser removes site data under storage pressure.
- The app cannot run arbitrary background backup jobs.
- The app cannot silently write to iCloud Drive or email exports.
- Share/export must be initiated by a user gesture.
- Web Share support should be feature-detected at runtime.

Because EasyCal treats the phone database as a capture buffer and CSV as the durable archive, the UI should make export status very visible.

## Accessibility and iPhone UX

Implementation should favor plain controls and low typing friction:

- Large tap targets.
- Numeric inputs with `inputmode="decimal"` or `inputmode="numeric"` as appropriate.
- Date and time inputs using native pickers.
- Submit buttons near the active form.
- Clear validation messages next to invalid fields.
- Tables that remain readable on narrow screens.

Avoid disabling user zoom. iOS users should retain normal accessibility scaling behavior.

## Verification Checklist

Before considering v1 complete:

- Add direct calorie entry.
- Add by-weight calorie entry.
- Default accounted date respects `current_day_begins_at`.
- Entry list sorts newest first by `recorded_date`.
- Delete confirmation displays the full entry.
- Settings persist after reload.
- CSV contains all entry fields in ascending `entry_id`.
- CSV escaping works for commas, quotes, and multiline notes.
- Export metadata updates only after a resolved share flow or accepted fallback behavior.
- Clear flow preserves settings and export metadata.
- App loads offline after first visit.
- Home-screen launch works on iPhone Safari.
