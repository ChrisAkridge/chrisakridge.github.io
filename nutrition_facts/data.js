import {
    Dimension,
    Unit,
    DerivedUnit,
    DerivedUnitFormulaTerm
} from './data_models.js';
import { withSubscript } from './markup.js';

export function getDimensions() {
    return [
        new Dimension(0, 'Time', 'T'),
        new Dimension(1, 'Energy', 'E'),
        new Dimension(2, 'Count', 'N'),
        new Dimension(3, 'Length', 'L'),
        new Dimension(4, 'Mass', 'M'),
        new Dimension(5, 'Electric Current', 'I'),
        new Dimension(6, 'Thermodynamic Temperature', 'Θ'),
        new Dimension(7, 'Luminous Intensity', 'J')
    ];
}

export function getUnits() {
    var startingUnitId = 0;
    var timeUnits = getTimeUnits(startingUnitId);
    startingUnitId += timeUnits.length;
    var lengthUnits = getLengthUnits(startingUnitId);
    startingUnitId += lengthUnits.length;

    // Generate light-distance units based on length units and add them to the time units
    const speedOfLightMetersPerSecond = 299792458;
    lengthUnits.forEach(lengthUnit => {
        const lightDistanceUnitId = startingUnitId++;
        const lightDistanceUnitNameSingular = `light-${lengthUnit.nameSingular}`;
        const lightDistanceUnitNamePlural = `light-${lengthUnit.namePlural}`;
        const lightDistanceUnitAbbreviation = `c · ${lengthUnit.abbreviation}`;
        const unitsPerBaseUnit = lengthUnit.unitsPerBaseUnit / speedOfLightMetersPerSecond;
        timeUnits.push(new Unit(lightDistanceUnitId, 0, lightDistanceUnitNameSingular, lightDistanceUnitNamePlural, lightDistanceUnitAbbreviation, false, false, unitsPerBaseUnit));
    });

    // Generate light-time units based on time units and add them to the length units
    const speedOfLightSecondsPerMeter = 1 / speedOfLightMetersPerSecond;
    timeUnits.forEach(timeUnit => {
        const lightTimeUnitId = startingUnitId++;
        const lightTimeUnitNameSingular = `light-${timeUnit.nameSingular}`;
        const lightTimeUnitNamePlural = `light-${timeUnit.namePlural}`;
        const lightTimeUnitAbbreviation = `c · ${timeUnit.abbreviation}`;
        const unitsPerBaseUnit = timeUnit.unitsPerBaseUnit * speedOfLightSecondsPerMeter;
        lengthUnits.push(new Unit(lightTimeUnitId, 3, lightTimeUnitNameSingular, lightTimeUnitNamePlural, lightTimeUnitAbbreviation, false, false, unitsPerBaseUnit));
    });
}

function getTimeUnits(startingUnitId) {
    var unitId = startingUnitId;

    return [
        // Time units
        new Unit(unitId++, 0, 'second', 'seconds', 's', true, true, 1),
        new Unit(unitId++, 0, 'Planck time', 'Planck times', withSubscript('t', 'P'), false, false, 5.391247e-44),
        new Unit(unitId++, 0, 'minute', 'minutes', 'min', false, false, 60),
        new Unit(unitId++, 0, 'hour', 'hours', 'h', false, false, 3600),
        new Unit(unitId++, 0, 'meridiem', 'meridiems', 'md', false, false, 43200),
        new Unit(unitId++, 0, 'day', 'days', 'd', false, false, 86400),
        new Unit(unitId++, 0, 'week', 'weeks', 'wk', false, false, 604800),
        new Unit(unitId++, 0, 'month (28 days)', 'months (28 days)', withSubscript('mo', '28'), false, false, 2419200),
        new Unit(unitId++, 0, 'month (29 days)', 'months (29 days)', withSubscript('mo', '29'), false, false, 2505600),
        new Unit(unitId++, 0, 'month (30 days)', 'months (30 days)', withSubscript('mo', '30'), false, false, 2592000),
        new Unit(unitId++, 0, 'month (31 days)', 'months (31 days)', withSubscript('mo', '31'), false, false, 2678400),
        new Unit(unitId++, 0, 'month (average)', 'months (average)', withSubscript('mo', 'avg'), false, false, 2629746),
        new Unit(unitId++, 0, 'common year', 'common years', withSubscript('yr', '365'), false, false, 31536000),
        new Unit(unitId++, 0, 'leap year', 'leap years', withSubscript('yr', '366'), false, false, 31622400),
        new Unit(unitId++, 0, 'year (average)', 'years (average)', withSubscript('yr', 'avg'), false, false, 31556952),
        new Unit(unitId++, 0, 'decade (1 leap year)', 'decades (1 leap year)', withSubscript('dec', 'L1'), false, false, 315.4464e7),
        new Unit(unitId++, 0, 'decade (2 leap years)', 'decades (2 leap years)', withSubscript('dec', 'L2'), false, false, 315.5328e7),
        new Unit(unitId++, 0, 'decade (3 leap years)', 'decades (3 leap years)', withSubscript('dec', 'L3'), false, false, 315.6192e7),
        new Unit(unitId++, 0, 'decade (average)', 'decades (average)', withSubscript('dec', 'avg'), false, false, 315.56952e7),
        new Unit(unitId++, 0, 'decade (standard)', 'decades (standard)', withSubscript('dec', 'std'), false, false, 315.36e7),
        new Unit(unitId++, 0, 'century (24 leap years)', 'centuries (24 leap years)', withSubscript('cen', 'L24'), false, false, 3.1556736e9),
        new Unit(unitId++, 0, 'century (25 leap years)', 'centuries (25 leap years)', withSubscript('cen', 'L25'), false, false, 3.15576e9),
        new Unit(unitId++, 0, 'century (average)', 'centuries (average)', withSubscript('cen', 'avg'), false, false, 3.1556952e9),
        new Unit(unitId++, 0, 'century (standard)', 'centuries (standard)', withSubscript('cen', 'std'), false, false, 3.1536e9),
        new Unit(unitId++, 0, 'leap year cycle', 'leap year cycles', 'Lyc', false, false, 12.6227808e9),
        new Unit(unitId++, 0, 'millennium (242 leap years)', 'millennia (242 leap years)', withSubscript('mln', 'L242'), false, false, 31.5569089e9),
        new Unit(unitId++, 0, 'millennium (243 leap years)', 'millennia (243 leap years)', withSubscript('mln', 'L243'), false, false, 31.5569952e9),
        new Unit(unitId++, 0, 'millennium (average)', 'millennia (average)', withSubscript('mln', 'avg'), false, false, 31.556952e9),
        new Unit(unitId++, 0, 'millennium (standard)', 'millennia (standard)', withSubscript('mln', 'std'), false, false, 31.536e9),
        new Unit(unitId++, 0, 'eon (242,499,999 leap years)', 'eons (242,499,999 leap years)', withSubscript('eon', 'L242499999'), false, false, 31.5569519999136e15),
        new Unit(unitId++, 0, 'eon (242,500,000 leap years)', 'eons (242,500,000 leap years)', withSubscript('eon', 'L242500000'), false, false, 31.556952e15),
        new Unit(unitId++, 0, 'eon (standard)', 'eons (standard)', withSubscript('eon', 'std'), false, false, 31.536e15),
        new Unit(unitId++, 0, 'age of the universe', 'ages of the universe', withSubscript('U', 'age'), false, false, 13.7e9 * 31556952)
    ];
}

function getLengthUnits(startingUnitId) {
    var unitId = startingUnitId;

    return [
        new Unit(unitId++, 3, 'meter', 'meters', 'm', true, true, 1),
        new Unit(unitId++, 3, 'inch', 'inches', 'in', false, false, 0.0254),
        new Unit(unitId++, 3, 'foot', 'feet', 'ft', false, false, 0.3048),
        new Unit(unitId++, 3, 'yard', 'yards', 'yd', false, false, 0.9144),
        new Unit(unitId++, 3, 'football field width', 'football field widths', withSubscript('ff', 'w'), false, false, 160 * 0.3048),
        new Unit(unitId++, 3, 'football field length', 'football field lengths', withSubscript('ff', 'l'), false, false, 100 * 0.9144),
        new Unit(unitId++, 3, 'football field length with endzones', 'football field lengths with endzones', withSubscript('ff', 'le'), false, false, 120 * 0.9144),
        new Unit(unitId++, 3, 'mile', 'miles', 'mi', false, false, 1609.344),
        new Unit(unitId++, 3, 'Planck length', 'Planck lengths', withSubscript('l', 'P'), false, false, 1.616255e-35),
        new Unit(unitId++, 3, 'astronomical unit', 'astronomical units', 'AU', false, false, 1.495978707e11),
        new Unit(unitId++, 3, 'parsec', 'parsecs', 'pc', false, false, 3.08567758149137e16),
    ];
}

function getEnergyUnits(startingUnitId) {
    var unitId = startingUnitId;

    return [
        new Unit(unitId++, 1, 'joule', 'joules', 'J', true, true, 1),
        new Unit(unitId++, 1, 'thermochemical calorie', 'thermochemical calories', withSubscript('cal', 'th'), false, false, 4.184),
        new Unit(unitId++, 1, 'Calorie', 'Calories', 'Cal', false, false, 4184),
        new Unit(unitId++, 1, 'electron volt', 'electron-volts', 'eV', false, false, 1.602176634e-19),
        new Unit(unitId++, 1, 'foot-pound', 'foot-pounds', 'ft·lb', false, false, 1.3558179483314004),
        new Unit(unitId++, 1, 'British Thermal Unit', 'British Thermal Units', 'BTU', false, false, 1055.05585262),
        new Unit(unitId++, 1, 'erg', 'ergs', 'erg', false, false, 1e-7),
        new Unit(unitId++, 1, 'foe', 'foes', 'foe', false, false, 1e44),
        new Unit(unitId++, 1, 'Planck energy', 'Planck energies', withSubscript('E', 'P'), false, false, 1.956099991e9)
    ];
}