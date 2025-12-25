import {
    Symbols,
    Conversions,
    getEnergyUnits
} from "./symbols";

const energyUnits = getEnergyUnits();
const scientificNotationPowerThreshold = 6;

class MeasurementDisplay {
    constructor(value, unitDescription) {
        this.value = value;
        this.unitDescription = unitDescription;
    }

    getDisplay(abbreviated) {
        if (this.unitDescription.prefixable) {
            return this.getPrefixedDisplay(abbreviated);
        }

        var log10 = Math.log10(Math.abs(this.value));
        if (log10 >= scientificNotationPowerThreshold || log10 <= -scientificNotationPowerThreshold) {
            return this.getScientificNotationDisplay(abbreviated);
        }

        const roundedValue = this.value.toFixed(3);
        return `${roundedValue} ${abbreviated ? this.unitDescription.abbreviation : this.unitDescription.fullName}`;
    }
}

class Energy {
    constructor(joules) {
        this.joules = joules;
    }

    static from(unitSymbol, value) {
        if (unitSymbol === Symbols.JOULE) { return new Energy(value); }
        else if (unitSymbol === Symbols.CALORIE_TH) { return new Energy(value * Conversions.JOULES_PER_CALORIE_TH); }
        else if (unitSymbol === Symbols.CALORIE_DIET) { return new Energy(value * Conversions.JOULES_PER_CALORIE_DIET); }
        else if (unitSymbol === Symbols.ELECTRON_VOLT) { return new Energy(value * Conversions.JOULES_PER_ELECTRON_VOLT); }
        else if (unitSymbol === Symbols.FOOT_POUND) { return new Energy(value * Conversions.JOULES_PER_FOOT_POUND); }
        else if (unitSymbol === Symbols.BTU) { return new Energy(value * Conversions.JOULES_PER_BTU); }
        else if (unitSymbol === Symbols.ERG) { return new Energy(value * Conversions.JOULES_PER_ERG); }
        else if (unitSymbol === Symbols.FOE) { return new Energy(value * Conversions.JOULES_PER_FOE); }
        else if (unitSymbol === Symbols.PLANCK_ENERGY) { return new Energy(value * Conversions.JOULES_PER_PLANCK_ENERGY); }
    }

    toDisplay(unitSymbol) {
        var value = this.joules;
        if (unitSymbol === Symbols.JOULE) { }
        else if (unitSymbol === Symbols.CALORIE_TH) { value /= Conversions.JOULES_PER_CALORIE_TH; }
        else if (unitSymbol === Symbols.CALORIE_DIET) { value /= Conversions.JOULES_PER_CALORIE_DIET; }
        else if (unitSymbol === Symbols.ELECTRON_VOLT) { value /= Conversions.JOULES_PER_ELECTRON_VOLT; }
        else if (unitSymbol === Symbols.FOOT_POUND) { value /= Conversions.JOULES_PER_FOOT_POUND; }
        else if (unitSymbol === Symbols.BTU) { value /= Conversions.JOULES_PER_BTU; }
        else if (unitSymbol === Symbols.ERG) { value /= Conversions.JOULES_PER_ERG; }
        else if (unitSymbol === Symbols.FOE) { value /= Conversions.JOULES_PER_FOE; }
        else if (unitSymbol === Symbols.PLANCK_ENERGY) { value /= Conversions.JOULES_PER_PLANCK_ENERGY; }
        else {
            throw new Error(`Unsupported energy unit symbol: ${unitSymbol}`);
        }

        return new MeasurementDisplay(value, energyUnits[unitSymbol]);
    }

    divideByEnergy(otherEnergy) {
        // Energy divided by energy is a unitless quantity
        return new Count(this.joules / otherEnergy.joules);
    }
}

class Count {
    constructor(count) {
        this.count = count;
    }

    static from(unitSymbol, value) {
        if (unitSymbol === Symbols.COUNT) { return new Count(value); }
        else if (unitSymbol === Symbols.PERCENTAGE) { return new Count(value * Conversions.COUNT_PER_PERCENTAGE); }
        else {
            throw new Error(`Unsupported count unit symbol: ${unitSymbol}`);
        }
    }

    toDisplay(unitSymbol) {
        var value = this.count;
        if (unitSymbol === Symbols.COUNT) { }
        else if (unitSymbol === Symbols.PERCENTAGE) { value /= Conversions.COUNT_PER_PERCENTAGE; }
        else {
            throw new Error(`Unsupported count unit symbol: ${unitSymbol}`);
        }
    }
}