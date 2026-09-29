const PLACEHOLDER = '—';
const DENSITY_SCALE_MAX = 9;

calculate = () => {
    const calories = Number(document.getElementById('calories').value);
    const servingSize = Number(document.getElementById('servingSize').value);

    const caloriesPerGram = calories / servingSize;

    // Blank, zero-size, or otherwise unusable input: show placeholders
    if (servingSize <= 0 || !isFinite(caloriesPerGram)) {
        showResults(null);
        return;
    }

    showResults(caloriesPerGram);
}

showResults = (caloriesPerGram) => {
    const show = (id, fn) => setElementTextById(id, caloriesPerGram === null ? PLACEHOLDER : fn(caloriesPerGram));

    show('caloriesPerGram', cpg => cpg.toFixed(2));
    show('caloriesPer40Grams', cpg => `${Math.round(cpg * 40)} Cal`);
    show('caloriesPer200Grams', cpg => `${Math.round(cpg * 200)} Cal`);
    show('gramsPer150Calories', cpg => gramsText(150 / cpg));
    show('gramsPer450Calories', cpg => gramsText(450 / cpg));
    show('gramsPer800Calories', cpg => gramsText(800 / cpg));
    updateDensityMarker(caloriesPerGram);
}

// Position the marker on the 0-9 Cal/g scale, pinning to an end (and turning red) when out of range
updateDensityMarker = (caloriesPerGram) => {
    const marker = document.getElementById('densityMarker');
    if (caloriesPerGram === null) {
        marker.style.display = 'none';
        return;
    }
    const outOfBounds = caloriesPerGram < 0 || caloriesPerGram > DENSITY_SCALE_MAX;
    const fraction = Math.min(Math.max(caloriesPerGram / DENSITY_SCALE_MAX, 0), 1);
    marker.style.left = `${fraction * 100}%`;
    marker.classList.toggle('out-of-bounds', outOfBounds);
    marker.style.display = 'block';
}

// One band per whole Cal/g, shading from green (light) to red (dense), with a tick label at each boundary
buildDensityScale = () => {
    const bar = document.getElementById('densityBar');
    const ticks = document.getElementById('densityTicks');
    for (let i = 0; i < DENSITY_SCALE_MAX; i++) {
        const band = document.createElement('div');
        band.className = 'density-band';
        band.style.background = `hsl(${130 - i * 14}, 70%, 50%)`;
        bar.insertBefore(band, document.getElementById('densityMarker'));
    }
    for (let i = 0; i <= DENSITY_SCALE_MAX; i++) {
        const tick = document.createElement('span');
        tick.textContent = i;
        tick.style.left = `${(i / DENSITY_SCALE_MAX) * 100}%`;
        ticks.appendChild(tick);
    }
}

// A zero-Calorie food lets you eat unlimited grams
gramsText = (grams) => isFinite(grams) ? `${Math.round(grams)} g` : '∞';

setElementTextById = (id, text) => {
    document.getElementById(id).innerText = text;
}

// Lowest/highest Calories per gram seen so far. Each is a stack of successive records, so undo steps back one.
// Persisted so a page reload in the aisle doesn't lose them.
const MINMAX_STORAGE_KEY = 'calinator.minmax';
let minMax = { min: [], max: [] };

loadMinMax = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(MINMAX_STORAGE_KEY));
        if (saved && Array.isArray(saved.min) && Array.isArray(saved.max)) {
            minMax = { min: saved.min.filter(isFinite), max: saved.max.filter(isFinite) };
        }
    } catch (e) { /* storage unavailable or corrupt: start fresh */ }
}

saveMinMax = () => {
    try {
        localStorage.setItem(MINMAX_STORAGE_KEY, JSON.stringify(minMax));
    } catch (e) { /* storage unavailable: memory just won't survive a reload */ }
}

renderMinMax = () => {
    const top = (stack) => stack.length ? stack[stack.length - 1].toFixed(2) : '-';
    setElementTextById('minCaloriesPerGram', top(minMax.min));
    setElementTextById('maxCaloriesPerGram', top(minMax.max));
    document.getElementById('undoMin').disabled = minMax.min.length === 0;
    document.getElementById('undoMax').disabled = minMax.max.length === 0;
    document.getElementById('resetMinMax').disabled = minMax.min.length === 0 && minMax.max.length === 0;
}

recordDensity = (caloriesPerGram) => {
    const lowest = minMax.min[minMax.min.length - 1];
    const highest = minMax.max[minMax.max.length - 1];
    if (lowest === undefined || caloriesPerGram < lowest) minMax.min.push(caloriesPerGram);
    if (highest === undefined || caloriesPerGram > highest) minMax.max.push(caloriesPerGram);
    saveMinMax();
    renderMinMax();
}

undoMin = () => { minMax.min.pop(); saveMinMax(); renderMinMax(); }
undoMax = () => { minMax.max.pop(); saveMinMax(); renderMinMax(); }
resetMinMax = () => { minMax = { min: [], max: [] }; saveMinMax(); renderMinMax(); }

// A food is recorded once both inputs have been visited (focused) since the last record and the user leaves
// one of them. Recording per keystroke would capture partial numbers like "6" on the way to "650", and
// recording after only one field would pair a new Calorie count with the previous food's serving size.
const visited = { calories: false, servingSize: false };

// Records the current inputs if they form a valid food; returns whether it did
commitMinMax = () => {
    const calories = Number(document.getElementById('calories').value);
    const servingSize = Number(document.getElementById('servingSize').value);
    const caloriesPerGram = calories / servingSize;
    if (!(servingSize > 0 && calories >= 0 && isFinite(caloriesPerGram))) return false;
    recordDensity(caloriesPerGram);
    visited.calories = visited.servingSize = false;
    return true;
}

trackVisits = () => {
    for (const id of Object.keys(visited)) {
        const input = document.getElementById(id);
        input.addEventListener('focus', () => { visited[id] = true; });
        input.addEventListener('blur', () => {
            if (visited.calories && visited.servingSize) commitMinMax();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buildDensityScale();
    loadMinMax();
    renderMinMax();
    trackVisits();
    calculate();
});
