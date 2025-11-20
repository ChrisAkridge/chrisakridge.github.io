calculate = () => {
    // Get values of elements #calories, #servingSize, and #calorieTarget as numbers
    const calories = Number(document.getElementById('calories').value);
    const servingSize = Number(document.getElementById('servingSize').value);
    const calorieTarget = Number(document.getElementById('calorieTarget').value);

    // Verify that they're not negative and return if they are
    if (calories < 0 || servingSize < 0 || calorieTarget < 0) {
        return;
    }

    const caloriesPerGram = calories / servingSize;
    const percentageOfTarget = (calories / calorieTarget) * 100;
    const gramsToMeetTarget = calorieTarget / caloriesPerGram;
    const mealTarget = calorieTarget / 3;
    const percentageOfMealTarget = (calories / mealTarget) * 100;
    const gramsToMeetMealTarget = mealTarget / caloriesPerGram;
    const caloriesPer40Grams = caloriesPerGram * 40;
    const caloriesPer200Grams = caloriesPerGram * 200;

    setElementTextById('caloriesPerGram', `Calories per Gram: ${caloriesPerGram.toFixed(2)} Calories (${caloriesToJouleText(caloriesPerGram)})`);
    const percentageOfTargetText = `Percentage of Daily Target: ${percentageOfTarget.toFixed(2)}, you can eat ${gramsToMeetTarget.toFixed(2)}g`
        .replace("Infinity", "\u221E");
    setElementTextById('percentOfDailyTarget', percentageOfTargetText);
    const percentageOfMealTargetText = `Percentage of One-Third Daily Target: ${percentageOfMealTarget.toFixed(2)}%, you can eat ${gramsToMeetMealTarget.toFixed(2)}g`
        .replace("Infinity", "\u221E");
    setElementTextById('percentOfMealTarget', percentageOfMealTargetText);
    setElementTextById('caloriesPer40Grams', `Calories per 40 Grams: ${caloriesPer40Grams.toFixed(2)} Calories (${caloriesToJouleText(caloriesPer40Grams)})`);
    setElementTextById('caloriesPer200Grams', `Calories per 200 Grams: ${caloriesPer200Grams.toFixed(2)} Calories (${caloriesToJouleText(caloriesPer200Grams)})`);
}

caloriesToJouleText = (calories) => {
    const joules = calories * 4184;
    if (joules < 1000) {
        return `${joules.toFixed(2)} J`;
    } else if (joules >= 1000 && joules < 1e6) {
        return `${(joules / 1000).toFixed(2)} kJ`;
    } else if (joules >= 1e6 && joules < 1e9) {
        return `${(joules / 1e6).toFixed(2)} MJ`;
    } else {
        return `${(joules / 1e9).toFixed(2)} GJ`;
    }
}

setElementTextById = (id, text) => {
    document.getElementById(id).innerText = text;
}

document.addEventListener("DOMContentLoaded", calculate());
