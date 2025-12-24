export class Dimension {
    constructor(id, name, symbol) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
    }
}

export class Unit {
    constructor(id, dimensionId, nameSingular, namePlural, abbreviation, isPrefixable, isBaseUnit, unitsPerBaseUnit) {
        this.id = id;
        this.dimensionId = dimensionId;
        this.nameSingular = nameSingular;
        this.namePlural = namePlural;
        this.abbreviation = abbreviation;
        this.isPrefixable = isPrefixable;
        this.isBaseUnit = isBaseUnit;
        this.unitsPerBaseUnit = unitsPerBaseUnit;
    }
}

export class DerivedUnit {
    constructor(id, nameSingular, namePlural, abbreviation) {
        this.id = id;
        this.nameSingular = nameSingular;
        this.namePlural = namePlural;
        this.abbreviation = abbreviation;
    }
}

export class DerivedUnitFormulaTerm {
    constructor(id, derivedUnitId, dimensionId, exponent) {
        this.id = id;
        this.derivedUnitId = derivedUnitId;
        this.dimensionId = dimensionId;
        this.exponent = exponent;
    }
}