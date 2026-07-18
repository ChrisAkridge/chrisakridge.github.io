## EasyCal

EasyCal is a PWA that provides extremely low-friction Calorie tracking. Usable on iOS devices via Safari and home-screen icons. It uses the IndexedDB to store recorded Calorie data on-device that can be exported as CSV. The data model is as follows (C# used only for example):

```csharp
class CalorieTrackingEntry
{
    // An autoincrementing integer id.
    int entry_id;
    // The date and time the entry was recorded, in the local timezone.
    DateTimeOffset recorded_date;
    // The date the entry is accounted for. This permits entries added after midnight to still count for the previous day, or the day of the user's choice.
    DateTime accounted_date;
    // The calorie amount of the entry.
    float calorie_amount;
    // An optional notes field for the user; things like meal, the food item it was, or anything else.
    string? note;
    // If entered using the by-weight method, this tracks the Calories in one serving of the food item.
    float? calories_per_serving;
    // If entered using the by-weight method, this tracks the mass/volume of the serving in grams or milliliters.
    float? serving_size;
    // If entered using the by-weight method, this tracks the mass/volume of the consumed food in grams or milliliters.
    float? mass_consumed;
    // The maintenance calories from the settings at the time the entry was made.
    float maintenance_calories_at_recording;
}

// Stored as a single row in IndexedDB.
class Settings
{
    // The time that the current day is considered to start. Since I stay up past midnight, I want those day's calories to count for the previous day. Default: 7:00am.
    TimeOnly current_day_begins_at;
    // The maintenance calories for the user. Default: 2000.
    float maintenance_calories;
    // The date and time that the last export occurred on. Default: null.
    DateTimeOffset? last_export_date;
    // The number of entries exported on last export. Default: null.
    int? last_export_entry_count;
    // The highest seen entry_id of the last export. Default: null.
    int? last_export_max_entry_id;
}
```

## Pages

### Page List

- Home Page
- Add Calorie Entry
- Add Calorie Entry by Weight
- Entry List Page
- Settings Page

### Home Page

The interface displays the following panels:

- A set of buttons:
    - Add Calorie Entry
    - Add Calorie Entry By Weight
    - Settings
    - Export CSV
- A display of the current day's calories and the maintenance calories (i.e. 1536 / 2000).
- A smaller bit of text showing the last export date
- A list of the previous 7 days as a table:
    - Date
    - Total and maintenance calories (i.e. 1536 / 2000)
    - A percentage of the maintenance calories (i.e. 76.80%)
- Link to the entry list page

Maintenance calories in today's display is taken from the current `maintenance_calories` settings value. The maintenance calorie values for the list of the previous 7 days is taken from the `maintenance_calories_at_recording` value for the last entry on that current day. That is, if the current day starts at 7:00am, the `maintenance_calories_at_recording` value from the last entry before 7:00am on that day is used.

Clicking Export CSV uses the system native share to share a generated CSV via e-mail or alternative share method. If the share option is resolved, the `last_export_date`, `last_export_entry_count`, and `last_export_max_entry_id` in the settings are updated. The CSV has all rows from the database, in ascending order of `entry_id`. All fields are exported to the CSV for every row.

If the last export date display is more than 7 days old, it becomes 25% larger and gets a yellow background. If it is more than 10 days old, it becomes 50% larger and gets a red background with white text. If it is more than 14 days old, it becomes 75% larger and gets a purple-red background with ⚠️ emojis on either side.

### Add Calorie Entry

Clicking Add Calorie Entry takes the user to a page where they have a few inputs: a numeric field to insert the Calories in, a Date field to set the accounting date (defaults to the current date, which often starts later into the actual day than midnight), a multiline Notes textbox that is optional, then a button to add the entry.

Validations:

- Calories must be above 0.

### Add Calorie Entry by Weight

Much like the Add Calorie Entry page, except the Calorie field becomes three:

1. A Serving Size numeric field. The label indicates that it takes either grams or milliliters.
2. A Calories per Serving numeric field.
3. A Consumed Serving Size numeric field.

When saving from this page, it sets `calories_per_serving`, `serving_size`, `mass_consumed`. It also uses the values to compute the `calorie_amount` field.

Validations:

- Serving Size must be above 0.
- Calories per Serving must be above 0.
- Consumed Serving Size must be above 0.

### Entry List Page

List entries in descending order of `recorded_date`. The list is a table with the following columns:

- Date
- Calorie Amount
- A delete link

Clicking the delete link causes a confirmation modal to show that displays the full entry, including note if present, with a Yes/No option.

## Settings Page

Lists settings. Fields for the time the current day begins at (time picker), the maintenance Calories (numeric) are first. Then there is a Save button, and below that, a button to clear the IndexedDB of all Calorie entries.

There are two layers of confirmation modals to confirm this, which indicate how many entries would be deleted, as well as the number of entries on the last export, the highest seen `entry_id`, and the last export date. If the number of entries on the previous export differs from the amount about to be deleted, loudly warn the user with big text, bright letters, emojis, the works.