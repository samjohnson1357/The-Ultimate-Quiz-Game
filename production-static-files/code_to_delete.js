function addToDate(date, days=0, hours=0, minutes=0, seconds=0) {
    /*
    Note: This function can also subtract from a given date if you enter negative numbers.
     */
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);
    date.setSeconds(date.getSeconds() + seconds);
    return date
}

function getRandomInteger(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
        throw new Error('Invalid arguments. Expected two numbers, with min <= max.');
    }
    let range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
}

function capitalizeFirstLetterOfString(inputString) {
    const firstLetterCap = inputString.charAt(0).toUpperCase();
    const remainingLetters = inputString.slice(1);
    return firstLetterCap + remainingLetters;
}
