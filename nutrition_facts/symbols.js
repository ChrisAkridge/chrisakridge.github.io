import { withSubscript } from "./markup";

export class UnitDescription {
    constructor(system, unitNameSingular, unitNamePlural, unitAbbreviation, prefixable) {
        this.system = system;
        this.unitNameSingular = unitNameSingular;
        this.unitNamePlural = unitNamePlural;
        this.unitAbbreviation = unitAbbreviation;
        this.prefixable = prefixable;
    }
}

export const Symbols = {
    // Energy units
    JOULE: 'joule',
    CALORIE_TH: "calorie_th",
    CALORIE_DIET: "calorie_diet",
    ELECTRON_VOLT: "electron_volt",
    FOOT_POUND: "foot_pound",
    BTU: "btu",
    ERG: "erg",
    FOE: "foe",
    PLANCK_ENERGY: "planck_energy",
    // Count units
    COUNT: 'count',
    PERCENTAGE: 'percentage',
    // Time units
    SECOND: 'second',
    PLANCK_TIME: 'planck_time',
    MINUTE: 'minute',
    HOUR: 'hour',
    MERIDIEM: 'meridiem',
    DAY: 'day',
    WEEK: 'week',
    MONTH_28_DAYS: 'month_28_days',
    MONTH_29_DAYS: 'month_29_days',
    MONTH_30_DAYS: 'month_30_days',
    MONTH_31_DAYS: 'month_31_days',
    MONTH_AVERAGE: 'month_average',
    MONTH_STANDARD: MONTH_30_DAYS,
    COMMON_YEAR: 'common_year',
    LEAP_YEAR: 'leap_year',
    YEAR_AVERAGE: 'year_average',
    YEAR_STANDARD: COMMON_YEAR,
    DECADE_1_LEAP_YEAR: 'decade_1_leap_year',
    DECADE_2_LEAP_YEARS: 'decade_2_leap_years',
    DECADE_3_LEAP_YEARS: 'decade_3_leap_years',
    DECADE_AVERAGE: 'decade_average',
    DECADE_STANDARD: 'decade_standard',
    CENTURY_24_LEAP_YEARS: 'century_24_leap_years',
    CENTURY_25_LEAP_YEARS: 'century_25_leap_years',
    CENTURY_AVERAGE: 'century_average',
    CENTURY_STANDARD: 'century_standard',
    LEAP_YEAR_CYCLE: 'leap_year_cycle',
    MILLENNIUM_242_LEAP_YEARS: 'millennium_242_leap_years',
    MILLENNIUM_243_LEAP_YEARS: 'millennium_243_leap_years',
    MILLENNIUM_AVERAGE: 'millennium_average',
    MILLENNIUM_STANDARD: 'millennium_standard',
    EON_242499999_LEAP_YEARS: 'eon_242499999_leap_years',
    EON_242500000_LEAP_YEARS: 'eon_242500000_leap_years',
    EON_STANDARD: 'eon_standard',
    UNIVERSE_AGE: 'universe_age'
    // TODO: define light-distance units here
};

export const Conversions = {
    // Energy conversions
    JOULES_PER_CALORIE_TH: 4.184,
    JOULES_PER_CALORIE_DIET: 4184,
    JOULES_PER_ELECTRON_VOLT: 1.602176634e-19,
    JOULES_PER_FOOT_POUND: 1.3558179483314004,
    JOULES_PER_BTU: 1055.05585262,
    JOULES_PER_ERG: 1e-7,
    JOULES_PER_FOE: 1e44,
    JOULES_PER_PLANCK_ENERGY: 1956099991,
    // Count conversions
    COUNT_PER_PERCENTAGE: 0.01,
    // Time conversions
    SECONDS_PER_PLANCK_TIME: 5.391247e-44,
    SECONDS_PER_MINUTE: 60,
    SECONDS_PER_HOUR: (60 * 60),
    SECONDS_PER_MERIDIEM: (12 * 60 * 60),
    SECONDS_PER_DAY: (24 * 60 * 60),
    SECONDS_PER_WEEK: (7 * 24 * 60 * 60),
    SECONDS_PER_MONTH_28_DAYS: (28 * 24 * 60 * 60),
    SECONDS_PER_MONTH_29_DAYS: (29 * 24 * 60 * 60),
    SECONDS_PER_MONTH_30_DAYS: (30 * 24 * 60 * 60),
    SECONDS_PER_MONTH_31_DAYS: (31 * 24 * 60 * 60),
    SECONDS_PER_MONTH_AVERAGE: 2629746,
    SECONDS_PER_COMMON_YEAR: 31536000,
    SECONDS_PER_LEAP_YEAR: 31622400,
    SECONDS_PER_YEAR_AVERAGE: 31556952,
    SECONDS_PER_DECADE_1_LEAP_YEAR: 315446400,
    SECONDS_PER_DECADE_2_LEAP_YEARS: 315532800,
    SECONDS_PER_DECADE_3_LEAP_YEARS: 315619200,
    SECONDS_PER_DECADE_AVERAGE: 315569520,
    SECONDS_PER_DECADE_STANDARD: 315360000,
    SECONDS_PER_CENTURY_24_LEAP_YEARS: ????,
}

export function getEnergyUnits() {
    return {
        [Symbols.JOULE]: new UnitDescription('SI', 'joule', 'joules', 'J', true),
        [Symbols.CALORIE_TH]: new UnitDescription('SI', 'thermochemical calorie', 'thermochemical calories', withSubscript('cal', 'th'), false),
        [Symbols.CALORIE_DIET]: new UnitDescription('Customary', 'Calorie', 'Calories', 'Cal', false),
        [Symbols.ELECTRON_VOLT]: new UnitDescription('Scientific', 'electron volt', 'electron-volts', 'eV', true),
        [Symbols.FOOT_POUND]: new UnitDescription('Customary', 'foot-pound', 'foot-pounds', 'ft·lb', false),
        [Symbols.BTU]: new UnitDescription('Customary', 'British Thermal Unit', 'British Thermal Units', 'BTU', false),
        [Symbols.ERG]: new UnitDescription('CGS', 'erg', 'ergs', 'erg', true),
        [Symbols.FOE]: new UnitDescription('Customary', 'foe', 'foes', 'foe', false),
        [Symbols.PLANCK_ENERGY]: new UnitDescription('Scientific', 'Planck energy', 'Planck energies', withSubscript('E', 'P'), false)
    };
};

export function getBasicQuantityUnits() {
    return {
        [Symbols.COUNT]: new UnitDescription('Universal', 'count', 'counts', 'ct', false),
        [Symbols.PERCENTAGE]: new UnitDescription('Universal', 'percentage', 'percentages', '%', false)
    };
}