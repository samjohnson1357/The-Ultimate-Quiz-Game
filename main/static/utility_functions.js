/*
File Summary: Some general utility functions are included here.
 */

"use strict";

// These objects map values shown in the drop-down menus to the values that are sent to the API.
let CATEGORIES_MAP = {
    "Music": "music", "Sport and leisure": "sport_and_leisure", "Film and TV": "film_and_tv",
    "Arts and literature": "arts_and_literature", "History": "history", "Society and culture": "society_and_culture",
    "Science": "science", "Geography": "geography", "Food and drink": "food_and_drink", "General knowledge": "general_knowledge"
};
let DIFFICULTIES_MAP = { "Easy": "easy", "Medium": "medium", "Hard": "hard" };

function sumArray(array) {
    let sum = 0;
    for (let num of array) {
        sum += num;
    }
    return sum;
}

function shuffleStringArray(array) {
    const shuffledArray = [...array]; // Create a new array to avoid modifying the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Generate a random index within the unshuffled portion of the array.
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap the elements at indices i and j
    }
    return shuffledArray;
}

function removeDuplicatesFromStringArray(array) {
    return [...new Set(array)];
}


function trimArrayOfStringsInplace(stringArray) {
    for (let i = 0; i < stringArray.length; i++) {
        stringArray[i] = stringArray[i].trim()
    }
}

function testTrimArrayOfStringsInplace() {
    let stringArray = [' happy ', 'sad ', 'envy', '  anger  ']
    trimArrayOfStringsInplace(stringArray)
    console.log(stringArray)
}

function getSumOfObjectValues(object) {
    let valueArray = Object.values(object)
    return sumArray(valueArray)
}


function getCSSColor(variable) {
    /*
    Color variables can be defined in CSS and accessed from here.
     */
    let root = document.querySelector(':root')
    return getComputedStyle(root).getPropertyValue(variable)
}

function getCSSColors(variableArray) {
    /*
    This is a more efficient version of the getCSSColor function, as it retrieves multiple colors.
     */
    let root = document.querySelector(':root')
    let properties = getComputedStyle(root)
    let colors = []
    for (let variable of variableArray) {
        let color = properties.getPropertyValue(variable)
        colors.push(color)
    }
    return colors
}
