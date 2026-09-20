// Document load
document.addEventListener('DOMContentLoaded', () => {
    showPanel(0);
    setNavButtonStates();
});

// Navigation controls
let currentPanelIndex = 0;
const panels = document.querySelectorAll('.row > div');
const totalPanels = panels.length;

function showPanel(index) {
    panels.forEach((panel, i) => {
        if (i === index) {
            panel.classList.add('panel-shown');
            panel.classList.remove('panel-hidden');
        } else {
            panel.classList.add('panel-hidden');
            panel.classList.remove('panel-shown');
        }
    });
    currentPanelIndex = index;
}

function setNavButtonStates() {
    const canGoBackToStart = currentPanelIndex > 0;
    const canGoBack = currentPanelIndex > 0;
    const canGoForward = currentPanelIndex < totalPanels - 1;

    document.getElementById('back-to-nutrition-facts').classList.toggle('nav-button-active', canGoBackToStart);
    document.getElementById('back-one-page').classList.toggle('nav-button-active', canGoBack);
    document.getElementById('forward-one-page').classList.toggle('nav-button-active', canGoForward);
}

document.getElementById('back-to-nutrition-facts').addEventListener('click', () => {
    if (currentPanelIndex > 0) {
        showPanel(0);
        setNavButtonStates();
    }
});

document.getElementById('back-one-page').addEventListener('click', () => {
    if (currentPanelIndex > 0) {
        showPanel(currentPanelIndex - 1);
        setNavButtonStates();
    }
});

document.getElementById('forward-one-page').addEventListener('click', () => {
    if (currentPanelIndex < totalPanels - 1) {
        showPanel(currentPanelIndex + 1);
        setNavButtonStates();
    }
});

// Formatting helpers
function siPrefixed(value, unit) {
    if (value < 1e-30) {
        // Use scientific notation for extremely small values
        return `${value.toExponential(3)} ${unit}`;
    }
    if (value >= 1e-30 && value < 1e-27) {
        return `${(value * 1e30).toFixed(3)} quecto${unit}`;
    }
    if (value >= 1e-27 && value < 1e-24) {
        return `${(value * 1e27).toFixed(3)} ronto${unit}`;
    }
    if (value >= 1e-24 && value < 1e-21) {
        return `${(value * 1e24).toFixed(3)} yocto${unit}`;
    }
    if (value >= 1e-21 && value < 1e-18) {
        return `${(value * 1e21).toFixed(3)} zepto${unit}`;
    }
    if (value >= 1e-18 && value < 1e-15) {
        return `${(value * 1e18).toFixed(3)} atto${unit}`;
    }
    if (value >= 1e-15 && value < 1e-12) {
        return `${(value * 1e15).toFixed(3)} femto${unit}`;
    }
    if (value >= 1e-12 && value < 1e-9) {
        return `${(value * 1e12).toFixed(3)} pico${unit}`;
    }
    if (value >= 1e-9 && value < 1e-6) {
        return `${(value * 1e9).toFixed(3)} nano${unit}`;
    }
    if (value >= 1e-6 && value < 1e-3) {
        return `${(value * 1e6).toFixed(3)} micro${unit}`;
    }
    if (value >= 1e-3 && value < 1) {
        return `${(value * 1e3).toFixed(3)} milli${unit}`;
    }
    if (value >= 1 && value < 1e3) {
        return `${value.toFixed(3)} ${unit}`;
    }
    if (value >= 1e3 && value < 1e6) {
        return `${(value / 1e3).toFixed(3)} kilo${unit}`;
    }
    if (value >= 1e6 && value < 1e9) {
        return `${(value / 1e6).toFixed(3)} mega${unit}`;
    }
    if (value >= 1e9 && value < 1e12) {
        return `${(value / 1e9).toFixed(3)} giga${unit}`;
    }
    if (value >= 1e12 && value < 1e15) {
        return `${(value / 1e12).toFixed(3)} tera${unit}`;
    }
    if (value >= 1e15 && value < 1e18) {
        return `${(value / 1e15).toFixed(3)} peta${unit}`;
    }
    if (value >= 1e18 && value < 1e21) {
        return `${(value / 1e18).toFixed(3)} exa${unit}`;
    }
    if (value >= 1e21 && value < 1e24) {
        return `${(value / 1e21).toFixed(3)} zetta${unit}`;
    }
    if (value >= 1e24 && value < 1e27) {
        return `${(value / 1e24).toFixed(3)} yotta${unit}`;
    }
    if (value >= 1e27 && value < 1e30) {
        return `${(value / 1e27).toFixed(3)} ronna${unit}`;
    }
    if (value >= 1e30) {
        return `${(value / 1e30).toFixed(3)} quetta${unit}`;
    }

    // Use scientific notation as a fallback for extremely large values
    return `${value.toExponential(3)} ${unit}`;
}

function toScientificNotationIfNeeded(value) {
    if (value < 1e-3 || value >= 1e9) {
        return value.toExponential(3);
    } else {
        return value.toFixed(3);
    }
}

function subscriptDocumentFragment(text, subscript) {
    const fragment = document.createDocumentFragment();
    fragment.append(
        document.createTextNode(text)
    );
    const sub = document.createElement("sub");
    sub.textContent = subscript;
    fragment.append(sub);
    return fragment;
}

function none(value) { return value; }
function count(value) { return `${toScientificNotationIfNeeded(value)}`; }
function toPercent(percent) { return `${toScientificNotationIfNeeded(percent)}%`; }
function toGrams(grams) { return `${toScientificNotationIfNeeded(grams)} grams`; }
function toGramsPrefixed(grams) { return siPrefixed(grams, 'grams'); }
function toPlanckMasses(planckMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(planckMasses)} M`, 'P'); }
function toOunces(ounces) { return `${toScientificNotationIfNeeded(ounces)} ounces`; }
function toPounds(pounds) { return `${toScientificNotationIfNeeded(pounds)} pounds`; }
function toTons(tons) { return `${toScientificNotationIfNeeded(tons)} tons`; }
function toLunarMasses(lunarMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(lunarMasses)} M`, '🌔︎'); }
function toEarthMasses(earthMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(earthMasses)} M`, '🜨'); }
function toSolarMasses(solarMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(solarMasses)} M`, '☉'); }
function toMilkyWayMasses(milkyWayMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(milkyWayMasses)} M`, 'MW'); }
function toUniverseMasses(universeMasses) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(universeMasses)} M`, 'U'); }
function toJoules(joules) { return siPrefixed(joules, 'joules'); }
function toThermochemicalCalories(calories) { return subscriptDocumentFragment(`${siPrefixed(calories, 'cal')}`, 'th'); }
function toDietaryCalories(calories) { return `${toScientificNotationIfNeeded(calories)} Calories`; }
function toElectronVolts(electronVolts) { return siPrefixed(electronVolts, 'electron-volts'); }
function toFootPounds(footPounds) { return `${toScientificNotationIfNeeded(footPounds)} ft�lb`; }
function toBritishThermalUnits(btu) { return `${toScientificNotationIfNeeded(btu)} BTU`; }
function toErgs(ergs) { return siPrefixed(ergs, 'ergs'); }
function toFoes(foes) { return `${toScientificNotationIfNeeded(foes)} foe`; }
function toPlanckEnergies(planckEnergies) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(planckEnergies)} E`, 'P'); }
function toDuration(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(3)}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m${remainingSeconds.toFixed(3)}s`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}h${minutes}m${remainingSeconds.toFixed(3)}s`;
    } else if (seconds < (86400 * 7)) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${days}d${hours}h${minutes}m${remainingSeconds.toFixed(3)}s`;
    } else {
        const years = Math.floor(seconds / (86400 * 365));
        const days = Math.floor((seconds % (86400 * 365)) / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${years}y${days}d${hours}h${minutes}m${remainingSeconds.toFixed(3)}s`;
    }
}
function heatingEffectOnWater(joules, waterMassGrams) {
    var liquidWaterLeft = waterMassGrams;
    var steamMade = 0;
    var temperature = 20;

    const specificHeatCapacityWater = 4.184; // J/g�C
    const temperatureChange = joules / (waterMassGrams * specificHeatCapacityWater);
    if (temperatureChange > 80) {
        // Some of this energy goes into evaporating the water, compute how much is evaporated
        const energyToBoilWater = waterMassGrams * 2260; // J/g
        const excessEnergy = joules - (waterMassGrams * specificHeatCapacityWater * 80);
        steamMade = excessEnergy / 2260;
        liquidWaterLeft -= steamMade;
        temperature = 100;

        if (liquidWaterLeft == 0) {
            // All water has been evaporated, we can focus the remaining energy into
            // superheating the steam
            const specificHeatCapacitySteam = 2.03; // J/g�C
            const superheatTemperatureChange = excessEnergy / (steamMade * specificHeatCapacitySteam);
            temperature += superheatTemperatureChange;
        }
    }

    return `Achieved ${temperature.toFixed(3)}�C, ${liquidWaterLeft.toFixed(3)} g liquid water left, ${steamMade.toFixed(3)} g steam made.`;
}
function toSeconds(seconds) { return siPrefixed(seconds, 'seconds'); }
function toMinutes(minutes) { return `${toScientificNotationIfNeeded(minutes)} minutes`; }
function toHours(hours) { return `${toScientificNotationIfNeeded(hours)} hours`; }
function toMeridiems(meridiems) { return `${toScientificNotationIfNeeded(meridiems)} meridiems`; }
function toDays(days) { return `${toScientificNotationIfNeeded(days)} days`; }
function toWeeks(weeks) { return `${toScientificNotationIfNeeded(weeks)} weeks`; }
function to28DayMonths(months) { return `${toScientificNotationIfNeeded(months)} months (28 days)`; }
function to29DayMonths(months) { return `${toScientificNotationIfNeeded(months)} months (29 days)`; }
function to30DayMonths(months) { return `${toScientificNotationIfNeeded(months)} months (30 days/standard)`; }
function to31DayMonths(months) { return `${toScientificNotationIfNeeded(months)} months (31 days)`; }
function toAverageMonths(months) { return `${toScientificNotationIfNeeded(months)} months (average)`; }
function toCommonYears(years) { return `${toScientificNotationIfNeeded(years)} common years`; }
function toLeapYears(years) { return `${toScientificNotationIfNeeded(years)} leap years`; }
function toAverageYears(years) { return `${toScientificNotationIfNeeded(years)} years (average)`; }
function to1LeapYearDecades(decades) { return `${toScientificNotationIfNeeded(decades)} decades (1 leap year)`; }
function to2LeapYearDecades(decades) { return `${toScientificNotationIfNeeded(decades)} decades (2 leap years)`; }
function to3LeapYearDecades(decades) { return `${toScientificNotationIfNeeded(decades)} decades (3 leap years)`; }
function toAverageDecades(decades) { return `${toScientificNotationIfNeeded(decades)} decades (average)`; }
function toStandardDecades(decades) { return `${toScientificNotationIfNeeded(decades)} decades (standard)`; }
function to24LeapYearCenturies(centuries) { return `${toScientificNotationIfNeeded(centuries)} centuries (24 leap years)`; }
function to25LeapYearCenturies(centuries) { return `${toScientificNotationIfNeeded(centuries)} centuries (25 leap years)`; }
function toAverageCenturies(centuries) { return `${toScientificNotationIfNeeded(centuries)} centuries (average)`; }
function toStandardCenturies(centuries) { return `${toScientificNotationIfNeeded(centuries)} centuries (standard)`; }
function toLeapYearCycles(cycles) { return `${toScientificNotationIfNeeded(cycles)} leap year cycles`; }
function to242LeapYearMillennia(millennia) { return `${toScientificNotationIfNeeded(millennia)} millennia (242 leap years)`; }
function to243LeapYearMillennia(millennia) { return `${toScientificNotationIfNeeded(millennia)} millennia (243 leap years)`; }
function toAverageMillennia(millennia) { return `${toScientificNotationIfNeeded(millennia)} millennia (average)`; }
function toStandardMillennia(millennia) { return `${toScientificNotationIfNeeded(millennia)} millennia (standard)`; }
function to242499999LeapYearEons(eons) { return `${toScientificNotationIfNeeded(eons)} eons (242,499,999 leap years)`; }
function to242500000LeapYearEons(eons) { return `${toScientificNotationIfNeeded(eons)} eons (242,500,000 leap years)`; }
function toUniverseAges(universeAges) { return `${toScientificNotationIfNeeded(universeAges)} universe ages`; }
function toLightMeters(lightMeters) { return siPrefixed(lightMeters, 'light-meters'); }
function toLightInches(lightInches) { return `${toScientificNotationIfNeeded(lightInches)} light-inches`; }
function toLightFeet(lightFeet) { return `${toScientificNotationIfNeeded(lightFeet)} light-feet`; }
function toLightYards(lightYards) { return `${toScientificNotationIfNeeded(lightYards)} light-yards`; }
function toLightMiles(lightMiles) { return `${toScientificNotationIfNeeded(lightMiles)} light-miles`; }
function toLightAstronomicalUnits(lightAu) { return `${toScientificNotationIfNeeded(lightAu)} light-AU`; }
function toLightParsecs(lightParsecs) { return `${toScientificNotationIfNeeded(lightParsecs)} light-parsecs`; }
function toPlanckLengths(planckLengths) { return subscriptDocumentFragment(`${toScientificNotationIfNeeded(planckLengths)} L`, 'P'); }
function toMeters(meters) { return siPrefixed(meters, 'meters'); }
function toInches(inches) { return `${toScientificNotationIfNeeded(inches)} inches`; }
function toFeet(feet) { return `${toScientificNotationIfNeeded(feet)} feet`; }
function toYards(yards) { return `${toScientificNotationIfNeeded(yards)} yards`; }
function toMiles(miles) { return `${toScientificNotationIfNeeded(miles)} miles`; }
function toAstronomicalUnits(au) { return `${toScientificNotationIfNeeded(au)} AU`; }
function toParsecs(parsecs) { return `${toScientificNotationIfNeeded(parsecs)} parsecs`; }
function toLightSeconds(lightSeconds) { return siPrefixed(lightSeconds, 'light-seconds'); }
function toLightMinutes(lightMinutes) { return `${toScientificNotationIfNeeded(lightMinutes)} light-minutes`; }
function toLightHours(lightHours) { return `${toScientificNotationIfNeeded(lightHours)} light-hours`; }
function toLightDays(lightDays) { return `${toScientificNotationIfNeeded(lightDays)} light-days`; }
function toLightYears(lightYears) { return `${toScientificNotationIfNeeded(lightYears)} light-years`; }

function onUpdate(inputs) {
        // servingsPerContainer
    const servingsPerContainerValue = (inputs.containerNetWeight / inputs.servingSize);
    const servingsPerContainerUnit = ' '
    document.getElementById('calc-servingsPerContainer').innerText = servingsPerContainerValue.toFixed(3) + servingsPerContainerUnit;

    // monounsaturatedFat
    const monounsaturatedFatValue = (inputs.totalFat - inputs.saturatedFat - inputs.polyunsaturatedFat - inputs.transFat);
    const monounsaturatedFatUnit = ' g'
    document.getElementById('calc-monounsaturatedFat').innerText = monounsaturatedFatValue.toFixed(3) + monounsaturatedFatUnit;

    // naturalSugars
    const naturalSugarsValue = (inputs.totalSugars - inputs.addedSugars);
    const naturalSugarsUnit = ' g'
    document.getElementById('calc-naturalSugars').innerText = naturalSugarsValue.toFixed(3) + naturalSugarsUnit;


    // Update table 'servingSizeInfo'
    document.getElementById('servingSizeInfo_0_0').innerText = toGramsPrefixed((inputs.servingSize));
    document.getElementById('servingSizeInfo_0_1').replaceChildren(toPlanckMasses((inputs.servingSize) / 2.17645e-5));
    document.getElementById('servingSizeInfo_0_2').innerText = toOunces((inputs.servingSize) / 28);
    document.getElementById('servingSizeInfo_0_3').innerText = toOunces((inputs.servingSize) / 28.349523125);
    document.getElementById('servingSizeInfo_0_4').innerText = toPounds((inputs.servingSize) / 453.59237);
    document.getElementById('servingSizeInfo_0_5').innerText = toTons((inputs.servingSize) / 907184.74);
    document.getElementById('servingSizeInfo_0_6').innerText = count((inputs.servingSize) / 90264.88163);
    document.getElementById('servingSizeInfo_0_7').innerText = count((inputs.servingSize) / 77927.16917);
    document.getElementById('servingSizeInfo_0_8').innerText = count((inputs.servingSize) / 2267.96185);
    document.getElementById('servingSizeInfo_0_9').innerText = count((inputs.servingSize) / 9071.8474);
    document.getElementById('servingSizeInfo_0_10').innerText = count((inputs.servingSize) / 22679.6185);
    document.getElementById('servingSizeInfo_0_11').innerText = count((inputs.servingSize) / 45359.237);
    document.getElementById('servingSizeInfo_0_12').innerText = toElectronVolts((inputs.servingSize) / 1.8e-33);
    document.getElementById('servingSizeInfo_0_13').innerText = count((inputs.servingSize) / 9.11e-28);
    document.getElementById('servingSizeInfo_0_14').innerText = count((inputs.servingSize) / 1.673e-24);
    document.getElementById('servingSizeInfo_0_15').innerText = count((inputs.servingSize) / 1.675e-24);
    document.getElementById('servingSizeInfo_0_16').innerText = count((inputs.servingSize) / 4.9e-22);
    document.getElementById('servingSizeInfo_0_17').innerText = toJoules((inputs.servingSize) / 1.1e-14);
    document.getElementById('servingSizeInfo_0_18').replaceChildren(toLunarMasses((inputs.servingSize) / 7.346e25));
    document.getElementById('servingSizeInfo_0_19').replaceChildren(toEarthMasses((inputs.servingSize) / 6e27));
    document.getElementById('servingSizeInfo_0_20').replaceChildren(toSolarMasses((inputs.servingSize) / 2e33));
    document.getElementById('servingSizeInfo_0_21').replaceChildren(toMilkyWayMasses((inputs.servingSize) / 2.98e45));
    document.getElementById('servingSizeInfo_0_22').replaceChildren(toUniverseMasses((inputs.servingSize) / 1.5e56));
    const servingSizeInfo_showColumn1 = (inputs.foodIsDiscrete);
    for (let r = 0; r < 23; r++) {
        const cell = document.getElementById('servingSizeInfo_1_' + r);
        cell.style.display = servingSizeInfo_showColumn1 ? '' : 'none';
    }
    document.getElementById('servingSizeInfo_1_0').innerText = toGramsPrefixed((inputs.servingSize / inputs.unitsPerServing));
    document.getElementById('servingSizeInfo_1_1').replaceChildren(toPlanckMasses((inputs.servingSize / inputs.unitsPerServing) / 2.17645e-5));
    document.getElementById('servingSizeInfo_1_2').innerText = toOunces((inputs.servingSize / inputs.unitsPerServing) / 28);
    document.getElementById('servingSizeInfo_1_3').innerText = toOunces((inputs.servingSize / inputs.unitsPerServing) / 28.349523125);
    document.getElementById('servingSizeInfo_1_4').innerText = toPounds((inputs.servingSize / inputs.unitsPerServing) / 453.59237);
    document.getElementById('servingSizeInfo_1_5').innerText = toTons((inputs.servingSize / inputs.unitsPerServing) / 907184.74);
    document.getElementById('servingSizeInfo_1_6').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 90264.88163);
    document.getElementById('servingSizeInfo_1_7').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 77927.16917);
    document.getElementById('servingSizeInfo_1_8').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 2267.96185);
    document.getElementById('servingSizeInfo_1_9').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 9071.8474);
    document.getElementById('servingSizeInfo_1_10').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 22679.6185);
    document.getElementById('servingSizeInfo_1_11').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 45359.237);
    document.getElementById('servingSizeInfo_1_12').innerText = toElectronVolts((inputs.servingSize / inputs.unitsPerServing) / 1.8e-33);
    document.getElementById('servingSizeInfo_1_13').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 9.11e-28);
    document.getElementById('servingSizeInfo_1_14').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 1.673e-24);
    document.getElementById('servingSizeInfo_1_15').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 1.675e-24);
    document.getElementById('servingSizeInfo_1_16').innerText = count((inputs.servingSize / inputs.unitsPerServing) / 4.9e-22);
    document.getElementById('servingSizeInfo_1_17').innerText = toJoules((inputs.servingSize / inputs.unitsPerServing) / 1.1e-14);
    document.getElementById('servingSizeInfo_1_18').replaceChildren(toLunarMasses((inputs.servingSize / inputs.unitsPerServing) / 7.346e25));
    document.getElementById('servingSizeInfo_1_19').replaceChildren(toEarthMasses((inputs.servingSize / inputs.unitsPerServing) / 6e27));
    document.getElementById('servingSizeInfo_1_20').replaceChildren(toSolarMasses((inputs.servingSize / inputs.unitsPerServing) / 2e33));
    document.getElementById('servingSizeInfo_1_21').replaceChildren(toMilkyWayMasses((inputs.servingSize / inputs.unitsPerServing) / 2.98e45));
    document.getElementById('servingSizeInfo_1_22').replaceChildren(toUniverseMasses((inputs.servingSize / inputs.unitsPerServing) / 1.5e56));
    document.getElementById('servingSizeInfo_2_0').innerText = toGramsPrefixed((inputs.containerNetWeight));
    document.getElementById('servingSizeInfo_2_1').replaceChildren(toPlanckMasses((inputs.containerNetWeight) / 2.17645e-5));
    document.getElementById('servingSizeInfo_2_2').innerText = toOunces((inputs.containerNetWeight) / 28);
    document.getElementById('servingSizeInfo_2_3').innerText = toOunces((inputs.containerNetWeight) / 28.349523125);
    document.getElementById('servingSizeInfo_2_4').innerText = toPounds((inputs.containerNetWeight) / 453.59237);
    document.getElementById('servingSizeInfo_2_5').innerText = toTons((inputs.containerNetWeight) / 907184.74);
    document.getElementById('servingSizeInfo_2_6').innerText = count((inputs.containerNetWeight) / 90264.88163);
    document.getElementById('servingSizeInfo_2_7').innerText = count((inputs.containerNetWeight) / 77927.16917);
    document.getElementById('servingSizeInfo_2_8').innerText = count((inputs.containerNetWeight) / 2267.96185);
    document.getElementById('servingSizeInfo_2_9').innerText = count((inputs.containerNetWeight) / 9071.8474);
    document.getElementById('servingSizeInfo_2_10').innerText = count((inputs.containerNetWeight) / 22679.6185);
    document.getElementById('servingSizeInfo_2_11').innerText = count((inputs.containerNetWeight) / 45359.237);
    document.getElementById('servingSizeInfo_2_12').innerText = toElectronVolts((inputs.containerNetWeight) / 1.8e-33);
    document.getElementById('servingSizeInfo_2_13').innerText = count((inputs.containerNetWeight) / 9.11e-28);
    document.getElementById('servingSizeInfo_2_14').innerText = count((inputs.containerNetWeight) / 1.673e-24);
    document.getElementById('servingSizeInfo_2_15').innerText = count((inputs.containerNetWeight) / 1.675e-24);
    document.getElementById('servingSizeInfo_2_16').innerText = count((inputs.containerNetWeight) / 4.9e-22);
    document.getElementById('servingSizeInfo_2_17').innerText = toJoules((inputs.containerNetWeight) / 1.1e-14);
    document.getElementById('servingSizeInfo_2_18').replaceChildren(toLunarMasses((inputs.containerNetWeight) / 7.346e25));
    document.getElementById('servingSizeInfo_2_19').replaceChildren(toEarthMasses((inputs.containerNetWeight) / 6e27));
    document.getElementById('servingSizeInfo_2_20').replaceChildren(toSolarMasses((inputs.containerNetWeight) / 2e33));
    document.getElementById('servingSizeInfo_2_21').replaceChildren(toMilkyWayMasses((inputs.containerNetWeight) / 2.98e45));
    document.getElementById('servingSizeInfo_2_22').replaceChildren(toUniverseMasses((inputs.containerNetWeight) / 1.5e56));

    // Update table 'calorieInfo'
    const calorieInfo_showColumn0 = (inputs.servingSizeUnit.toLowerCase() == 'grams');
    for (let r = 0; r < 37; r++) {
        const cell = document.getElementById('calorieInfo_0_' + r);
        cell.style.display = calorieInfo_showColumn0 ? '' : 'none';
    }
    document.getElementById('calorieInfo_0_0').innerText = toJoules(((inputs.calories / inputs.servingSize)) * 4184);
    document.getElementById('calorieInfo_0_1').replaceChildren(toThermochemicalCalories(((inputs.calories / inputs.servingSize)) * 1000));
    document.getElementById('calorieInfo_0_2').innerText = toDietaryCalories(((inputs.calories / inputs.servingSize)));
    document.getElementById('calorieInfo_0_3').innerText = toElectronVolts(((inputs.calories / inputs.servingSize)) * 2.611e22);
    document.getElementById('calorieInfo_0_4').innerText = toElectronVolts(((inputs.calories / inputs.servingSize)) * 3086);
    document.getElementById('calorieInfo_0_5').innerText = toBritishThermalUnits(((inputs.calories / inputs.servingSize)) * 3.966);
    document.getElementById('calorieInfo_0_6').innerText = toErgs(((inputs.calories / inputs.servingSize)) * 4.184e10);
    document.getElementById('calorieInfo_0_7').innerText = toFoes(((inputs.calories / inputs.servingSize)) * 4.184e-41);
    document.getElementById('calorieInfo_0_8').replaceChildren(toPlanckEnergies(((inputs.calories / inputs.servingSize)) * 2.139e-6));
    document.getElementById('calorieInfo_0_9').innerText = toPercent((((inputs.calories / inputs.servingSize)) / inputs.dailyEnergyIntake) * 100);
    document.getElementById('calorieInfo_0_10').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) / inputs.dailyEnergyIntake) * 86400));
    document.getElementById('calorieInfo_0_11').innerText = none(toDuration(((inputs.calories / inputs.servingSize)) * 4184));
    document.getElementById('calorieInfo_0_12').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 1.5));
    document.getElementById('calorieInfo_0_13').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 5));
    document.getElementById('calorieInfo_0_14').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 12));
    document.getElementById('calorieInfo_0_15').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 120));
    document.getElementById('calorieInfo_0_16').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 240));
    document.getElementById('calorieInfo_0_17').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 480));
    document.getElementById('calorieInfo_0_18').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 1e5));
    document.getElementById('calorieInfo_0_19').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 8e5));
    document.getElementById('calorieInfo_0_20').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 8e5));
    document.getElementById('calorieInfo_0_21').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize)));
    document.getElementById('calorieInfo_0_22').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1));
    document.getElementById('calorieInfo_0_23').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1e3));
    document.getElementById('calorieInfo_0_24').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1e6));
    document.getElementById('calorieInfo_0_25').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize)) * 4.655e-14);
    document.getElementById('calorieInfo_0_26').innerText = count(((inputs.calories / inputs.servingSize)) / 6.837e-7);
    document.getElementById('calorieInfo_0_27').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 10));
    document.getElementById('calorieInfo_0_28').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 100));
    document.getElementById('calorieInfo_0_29').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 650));
    document.getElementById('calorieInfo_0_30').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 24e3));
    document.getElementById('calorieInfo_0_31').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 50e3));
    document.getElementById('calorieInfo_0_32').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 10e6));
    document.getElementById('calorieInfo_0_33').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 19.6e12));
    document.getElementById('calorieInfo_0_34').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_0_35').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_0_36').innerText = count(((inputs.calories / inputs.servingSize)) * 3e-67);
    const calorieInfo_showColumn1 = (inputs.servingSizeUnit.toLowerCase() == 'milliliters');
    for (let r = 0; r < 37; r++) {
        const cell = document.getElementById('calorieInfo_1_' + r);
        cell.style.display = calorieInfo_showColumn1 ? '' : 'none';
    }
    document.getElementById('calorieInfo_1_0').innerText = toJoules(((inputs.calories / inputs.servingSize)) * 4184);
    document.getElementById('calorieInfo_1_1').replaceChildren(toThermochemicalCalories(((inputs.calories / inputs.servingSize)) * 1000));
    document.getElementById('calorieInfo_1_2').innerText = toDietaryCalories(((inputs.calories / inputs.servingSize)));
    document.getElementById('calorieInfo_1_3').innerText = toElectronVolts(((inputs.calories / inputs.servingSize)) * 2.611e22);
    document.getElementById('calorieInfo_1_4').innerText = toElectronVolts(((inputs.calories / inputs.servingSize)) * 3086);
    document.getElementById('calorieInfo_1_5').innerText = toBritishThermalUnits(((inputs.calories / inputs.servingSize)) * 3.966);
    document.getElementById('calorieInfo_1_6').innerText = toErgs(((inputs.calories / inputs.servingSize)) * 4.184e10);
    document.getElementById('calorieInfo_1_7').innerText = toFoes(((inputs.calories / inputs.servingSize)) * 4.184e-41);
    document.getElementById('calorieInfo_1_8').replaceChildren(toPlanckEnergies(((inputs.calories / inputs.servingSize)) * 2.139e-6));
    document.getElementById('calorieInfo_1_9').innerText = toPercent((((inputs.calories / inputs.servingSize)) / inputs.dailyEnergyIntake) * 100);
    document.getElementById('calorieInfo_1_10').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) / inputs.dailyEnergyIntake) * 86400));
    document.getElementById('calorieInfo_1_11').innerText = none(toDuration(((inputs.calories / inputs.servingSize)) * 4184));
    document.getElementById('calorieInfo_1_12').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 1.5));
    document.getElementById('calorieInfo_1_13').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 5));
    document.getElementById('calorieInfo_1_14').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 12));
    document.getElementById('calorieInfo_1_15').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 120));
    document.getElementById('calorieInfo_1_16').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 240));
    document.getElementById('calorieInfo_1_17').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 480));
    document.getElementById('calorieInfo_1_18').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 1e5));
    document.getElementById('calorieInfo_1_19').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 8e5));
    document.getElementById('calorieInfo_1_20').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 8e5));
    document.getElementById('calorieInfo_1_21').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize)));
    document.getElementById('calorieInfo_1_22').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1));
    document.getElementById('calorieInfo_1_23').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1e3));
    document.getElementById('calorieInfo_1_24').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize)) * 4184, 1e6));
    document.getElementById('calorieInfo_1_25').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize)) * 4.655e-14);
    document.getElementById('calorieInfo_1_26').innerText = count(((inputs.calories / inputs.servingSize)) / 6.837e-7);
    document.getElementById('calorieInfo_1_27').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 10));
    document.getElementById('calorieInfo_1_28').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 100));
    document.getElementById('calorieInfo_1_29').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 650));
    document.getElementById('calorieInfo_1_30').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 24e3));
    document.getElementById('calorieInfo_1_31').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 50e3));
    document.getElementById('calorieInfo_1_32').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 10e6));
    document.getElementById('calorieInfo_1_33').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 19.6e12));
    document.getElementById('calorieInfo_1_34').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_1_35').innerText = none(toDuration((((inputs.calories / inputs.servingSize)) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_1_36').innerText = count(((inputs.calories / inputs.servingSize)) * 3e-67);
    document.getElementById('calorieInfo_2_0').innerText = toJoules((inputs.calories) * 4184);
    document.getElementById('calorieInfo_2_1').replaceChildren(toThermochemicalCalories((inputs.calories) * 1000));
    document.getElementById('calorieInfo_2_2').innerText = toDietaryCalories((inputs.calories));
    document.getElementById('calorieInfo_2_3').innerText = toElectronVolts((inputs.calories) * 2.611e22);
    document.getElementById('calorieInfo_2_4').innerText = toElectronVolts((inputs.calories) * 3086);
    document.getElementById('calorieInfo_2_5').innerText = toBritishThermalUnits((inputs.calories) * 3.966);
    document.getElementById('calorieInfo_2_6').innerText = toErgs((inputs.calories) * 4.184e10);
    document.getElementById('calorieInfo_2_7').innerText = toFoes((inputs.calories) * 4.184e-41);
    document.getElementById('calorieInfo_2_8').replaceChildren(toPlanckEnergies((inputs.calories) * 2.139e-6));
    document.getElementById('calorieInfo_2_9').innerText = toPercent(((inputs.calories) / inputs.dailyEnergyIntake) * 100);
    document.getElementById('calorieInfo_2_10').innerText = none(toDuration(((inputs.calories) / inputs.dailyEnergyIntake) * 86400));
    document.getElementById('calorieInfo_2_11').innerText = none(toDuration((inputs.calories) * 4184));
    document.getElementById('calorieInfo_2_12').innerText = none(toDuration(((inputs.calories) * 4184) / 1.5));
    document.getElementById('calorieInfo_2_13').innerText = none(toDuration(((inputs.calories) * 4184) / 5));
    document.getElementById('calorieInfo_2_14').innerText = none(toDuration(((inputs.calories) * 4184) / 12));
    document.getElementById('calorieInfo_2_15').innerText = none(toDuration(((inputs.calories) * 4184) / 120));
    document.getElementById('calorieInfo_2_16').innerText = none(toDuration(((inputs.calories) * 4184) / 240));
    document.getElementById('calorieInfo_2_17').innerText = none(toDuration(((inputs.calories) * 4184) / 480));
    document.getElementById('calorieInfo_2_18').innerText = none(toDuration(((inputs.calories) * 4184) / 1e5));
    document.getElementById('calorieInfo_2_19').innerText = none(toDuration(((inputs.calories) * 4184) / 8e5));
    document.getElementById('calorieInfo_2_20').innerText = none(toDuration(((inputs.calories) * 4184) / 8e5));
    document.getElementById('calorieInfo_2_21').innerText = toGramsPrefixed((inputs.calories));
    document.getElementById('calorieInfo_2_22').innerText = none(heatingEffectOnWater((inputs.calories) * 4184, 1));
    document.getElementById('calorieInfo_2_23').innerText = none(heatingEffectOnWater((inputs.calories) * 4184, 1e3));
    document.getElementById('calorieInfo_2_24').innerText = none(heatingEffectOnWater((inputs.calories) * 4184, 1e6));
    document.getElementById('calorieInfo_2_25').innerText = toGramsPrefixed((inputs.calories) * 4.655e-14);
    document.getElementById('calorieInfo_2_26').innerText = count((inputs.calories) / 6.837e-7);
    document.getElementById('calorieInfo_2_27').innerText = none(toDuration(((inputs.calories) * 4184) / 10));
    document.getElementById('calorieInfo_2_28').innerText = none(toDuration(((inputs.calories) * 4184) / 100));
    document.getElementById('calorieInfo_2_29').innerText = none(toDuration(((inputs.calories) * 4184) / 650));
    document.getElementById('calorieInfo_2_30').innerText = none(toDuration(((inputs.calories) * 4184) / 24e3));
    document.getElementById('calorieInfo_2_31').innerText = none(toDuration(((inputs.calories) * 4184) / 50e3));
    document.getElementById('calorieInfo_2_32').innerText = none(toDuration(((inputs.calories) * 4184) / 10e6));
    document.getElementById('calorieInfo_2_33').innerText = none(toDuration(((inputs.calories) * 4184) / 19.6e12));
    document.getElementById('calorieInfo_2_34').innerText = none(toDuration(((inputs.calories) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_2_35').innerText = none(toDuration(((inputs.calories) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_2_36').innerText = count((inputs.calories) * 3e-67);
    const calorieInfo_showColumn3 = (inputs.foodIsDiscrete);
    for (let r = 0; r < 37; r++) {
        const cell = document.getElementById('calorieInfo_3_' + r);
        cell.style.display = calorieInfo_showColumn3 ? '' : 'none';
    }
    document.getElementById('calorieInfo_3_0').innerText = toJoules(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184);
    document.getElementById('calorieInfo_3_1').replaceChildren(toThermochemicalCalories(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 1000));
    document.getElementById('calorieInfo_3_2').innerText = toDietaryCalories(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))));
    document.getElementById('calorieInfo_3_3').innerText = toElectronVolts(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 2.611e22);
    document.getElementById('calorieInfo_3_4').innerText = toElectronVolts(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 3086);
    document.getElementById('calorieInfo_3_5').innerText = toBritishThermalUnits(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 3.966);
    document.getElementById('calorieInfo_3_6').innerText = toErgs(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4.184e10);
    document.getElementById('calorieInfo_3_7').innerText = toFoes(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4.184e-41);
    document.getElementById('calorieInfo_3_8').replaceChildren(toPlanckEnergies(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 2.139e-6));
    document.getElementById('calorieInfo_3_9').innerText = toPercent((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) / inputs.dailyEnergyIntake) * 100);
    document.getElementById('calorieInfo_3_10').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) / inputs.dailyEnergyIntake) * 86400));
    document.getElementById('calorieInfo_3_11').innerText = none(toDuration(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184));
    document.getElementById('calorieInfo_3_12').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 1.5));
    document.getElementById('calorieInfo_3_13').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 5));
    document.getElementById('calorieInfo_3_14').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 12));
    document.getElementById('calorieInfo_3_15').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 120));
    document.getElementById('calorieInfo_3_16').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 240));
    document.getElementById('calorieInfo_3_17').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 480));
    document.getElementById('calorieInfo_3_18').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 1e5));
    document.getElementById('calorieInfo_3_19').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 8e5));
    document.getElementById('calorieInfo_3_20').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 8e5));
    document.getElementById('calorieInfo_3_21').innerText = toGramsPrefixed(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))));
    document.getElementById('calorieInfo_3_22').innerText = none(heatingEffectOnWater(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184, 1));
    document.getElementById('calorieInfo_3_23').innerText = none(heatingEffectOnWater(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184, 1e3));
    document.getElementById('calorieInfo_3_24').innerText = none(heatingEffectOnWater(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184, 1e6));
    document.getElementById('calorieInfo_3_25').innerText = toGramsPrefixed(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4.655e-14);
    document.getElementById('calorieInfo_3_26').innerText = count(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) / 6.837e-7);
    document.getElementById('calorieInfo_3_27').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 10));
    document.getElementById('calorieInfo_3_28').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 100));
    document.getElementById('calorieInfo_3_29').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 650));
    document.getElementById('calorieInfo_3_30').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 24e3));
    document.getElementById('calorieInfo_3_31').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 50e3));
    document.getElementById('calorieInfo_3_32').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 10e6));
    document.getElementById('calorieInfo_3_33').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 19.6e12));
    document.getElementById('calorieInfo_3_34').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_3_35').innerText = none(toDuration((((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_3_36').innerText = count(((inputs.calories / (inputs.servingSize / inputs.unitsPerServing))) * 3e-67);
    document.getElementById('calorieInfo_4_0').innerText = toJoules(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184);
    document.getElementById('calorieInfo_4_1').replaceChildren(toThermochemicalCalories(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 1000));
    document.getElementById('calorieInfo_4_2').innerText = toDietaryCalories(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight));
    document.getElementById('calorieInfo_4_3').innerText = toElectronVolts(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 2.611e22);
    document.getElementById('calorieInfo_4_4').innerText = toElectronVolts(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 3086);
    document.getElementById('calorieInfo_4_5').innerText = toBritishThermalUnits(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 3.966);
    document.getElementById('calorieInfo_4_6').innerText = toErgs(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4.184e10);
    document.getElementById('calorieInfo_4_7').innerText = toFoes(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4.184e-41);
    document.getElementById('calorieInfo_4_8').replaceChildren(toPlanckEnergies(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 2.139e-6));
    document.getElementById('calorieInfo_4_9').innerText = toPercent((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) / inputs.dailyEnergyIntake) * 100);
    document.getElementById('calorieInfo_4_10').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) / inputs.dailyEnergyIntake) * 86400));
    document.getElementById('calorieInfo_4_11').innerText = none(toDuration(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184));
    document.getElementById('calorieInfo_4_12').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 1.5));
    document.getElementById('calorieInfo_4_13').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 5));
    document.getElementById('calorieInfo_4_14').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 12));
    document.getElementById('calorieInfo_4_15').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 120));
    document.getElementById('calorieInfo_4_16').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 240));
    document.getElementById('calorieInfo_4_17').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 480));
    document.getElementById('calorieInfo_4_18').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 1e5));
    document.getElementById('calorieInfo_4_19').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 8e5));
    document.getElementById('calorieInfo_4_20').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 8e5));
    document.getElementById('calorieInfo_4_21').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight));
    document.getElementById('calorieInfo_4_22').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184, 1));
    document.getElementById('calorieInfo_4_23').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184, 1e3));
    document.getElementById('calorieInfo_4_24').innerText = none(heatingEffectOnWater(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184, 1e6));
    document.getElementById('calorieInfo_4_25').innerText = toGramsPrefixed(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4.655e-14);
    document.getElementById('calorieInfo_4_26').innerText = count(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) / 6.837e-7);
    document.getElementById('calorieInfo_4_27').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 10));
    document.getElementById('calorieInfo_4_28').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 100));
    document.getElementById('calorieInfo_4_29').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 650));
    document.getElementById('calorieInfo_4_30').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 24e3));
    document.getElementById('calorieInfo_4_31').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 50e3));
    document.getElementById('calorieInfo_4_32').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 10e6));
    document.getElementById('calorieInfo_4_33').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 19.6e12));
    document.getElementById('calorieInfo_4_34').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_4_35').innerText = none(toDuration((((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 4184) / 38.28e24));
    document.getElementById('calorieInfo_4_36').innerText = count(((inputs.calories / inputs.servingSize) * inputs.containerNetWeight) * 3e-67);


}

// Auto-generated
class NutritionFactsInputs {
    constructor() {
        this.dailyEnergyIntake = null;
        this.servingSize = null;
        this.servingSizeUnit = null;
        this.foodIsDiscrete = null;
        this.unitsPerServing = null;
        this.containerNetWeight = null;
        this.calories = null;
        this.totalFat = null;
        this.saturatedFat = null;
        this.polyunsaturatedFat = null;
        this.transFat = null;
        this.cholesterol = null;
        this.sodium = null;
        this.totalCarbohydrates = null;
        this.dietaryFibers = null;
        this.totalSugars = null;
        this.addedSugars = null;
        this.biotin = null;
        this.choline = null;
        this.folate = null;
        this.niacin = null;
        this.pantotheticAcid = null;
        this.riboflavin = null;
        this.thiamin = null;
        this.vitaminA = null;
        this.vitaminB6 = null;
        this.vitaminB12 = null;
        this.vitaminC = null;
        this.vitaminD = null;
        this.vitaminE = null;
        this.vitaminK = null;
        this.calcium = null;
        this.chloride = null;
        this.chromium = null;
        this.copper = null;
        this.iodine = null;
        this.iron = null;
        this.magnesium = null;
        this.manganese = null;
        this.molybdenum = null;
        this.potassium = null;
        this.selenium = null;
        this.zinc = null;
    }
}

function buildNutritionFactsInputs() {
    const inputs = new NutritionFactsInputs();
    inputs.dailyEnergyIntake = parseFloat(document.getElementById('dailyEnergyIntake').value) || 0;
    inputs.servingSize = parseFloat(document.getElementById('servingSize').value) || 0;
    inputs.servingSizeUnit = document.querySelector('input[name="servingSizeUnit"]:checked').value;;
    inputs.foodIsDiscrete = document.getElementById('foodIsDiscrete').checked;
    inputs.unitsPerServing = parseFloat(document.getElementById('unitsPerServing').value) || 0;
    inputs.containerNetWeight = parseFloat(document.getElementById('containerNetWeight').value) || 0;
    inputs.calories = parseFloat(document.getElementById('calories').value) || 0;
    inputs.totalFat = parseFloat(document.getElementById('totalFat').value) || 0;
    inputs.saturatedFat = parseFloat(document.getElementById('saturatedFat').value) || 0;
    inputs.polyunsaturatedFat = parseFloat(document.getElementById('polyunsaturatedFat').value) || 0;
    inputs.transFat = parseFloat(document.getElementById('transFat').value) || 0;
    inputs.cholesterol = parseFloat(document.getElementById('cholesterol').value) || 0;
    inputs.sodium = parseFloat(document.getElementById('sodium').value) || 0;
    inputs.totalCarbohydrates = parseFloat(document.getElementById('totalCarbohydrates').value) || 0;
    inputs.dietaryFibers = parseFloat(document.getElementById('dietaryFibers').value) || 0;
    inputs.totalSugars = parseFloat(document.getElementById('totalSugars').value) || 0;
    inputs.addedSugars = parseFloat(document.getElementById('addedSugars').value) || 0;
    inputs.biotin = parseFloat(document.getElementById('biotin').value) || 0;
    inputs.choline = parseFloat(document.getElementById('choline').value) || 0;
    inputs.folate = parseFloat(document.getElementById('folate').value) || 0;
    inputs.niacin = parseFloat(document.getElementById('niacin').value) || 0;
    inputs.pantotheticAcid = parseFloat(document.getElementById('pantotheticAcid').value) || 0;
    inputs.riboflavin = parseFloat(document.getElementById('riboflavin').value) || 0;
    inputs.thiamin = parseFloat(document.getElementById('thiamin').value) || 0;
    inputs.vitaminA = parseFloat(document.getElementById('vitaminA').value) || 0;
    inputs.vitaminB6 = parseFloat(document.getElementById('vitaminB6').value) || 0;
    inputs.vitaminB12 = parseFloat(document.getElementById('vitaminB12').value) || 0;
    inputs.vitaminC = parseFloat(document.getElementById('vitaminC').value) || 0;
    inputs.vitaminD = parseFloat(document.getElementById('vitaminD').value) || 0;
    inputs.vitaminE = parseFloat(document.getElementById('vitaminE').value) || 0;
    inputs.vitaminK = parseFloat(document.getElementById('vitaminK').value) || 0;
    inputs.calcium = parseFloat(document.getElementById('calcium').value) || 0;
    inputs.chloride = parseFloat(document.getElementById('chloride').value) || 0;
    inputs.chromium = parseFloat(document.getElementById('chromium').value) || 0;
    inputs.copper = parseFloat(document.getElementById('copper').value) || 0;
    inputs.iodine = parseFloat(document.getElementById('iodine').value) || 0;
    inputs.iron = parseFloat(document.getElementById('iron').value) || 0;
    inputs.magnesium = parseFloat(document.getElementById('magnesium').value) || 0;
    inputs.manganese = parseFloat(document.getElementById('manganese').value) || 0;
    inputs.molybdenum = parseFloat(document.getElementById('molybdenum').value) || 0;
    inputs.potassium = parseFloat(document.getElementById('potassium').value) || 0;
    inputs.selenium = parseFloat(document.getElementById('selenium').value) || 0;
    inputs.zinc = parseFloat(document.getElementById('zinc').value) || 0;
    return inputs;
}

document.getElementById('dailyEnergyIntake').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('servingSize').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.querySelectorAll('input[name="servingSizeUnit"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const inputs = buildNutritionFactsInputs();
        onUpdate(inputs);
    });
});
document.getElementById('foodIsDiscrete').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('unitsPerServing').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('containerNetWeight').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('calories').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('totalFat').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('saturatedFat').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('polyunsaturatedFat').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('transFat').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('cholesterol').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('sodium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('totalCarbohydrates').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('dietaryFibers').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('totalSugars').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('addedSugars').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('biotin').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('choline').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('folate').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('niacin').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('pantotheticAcid').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('riboflavin').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('thiamin').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminA').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminB6').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminB12').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminC').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminD').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminE').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('vitaminK').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('calcium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('chloride').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('chromium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('copper').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('iodine').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('iron').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('magnesium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('manganese').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('molybdenum').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('potassium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('selenium').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});
document.getElementById('zinc').addEventListener('change', () => {
    const inputs = buildNutritionFactsInputs();
    onUpdate(inputs);
});

