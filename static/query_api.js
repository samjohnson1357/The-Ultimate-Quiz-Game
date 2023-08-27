/*
File Summary: Query quiz questions from The Trivia API.
 */

"use strict";

function getQuestionsURL(limit, category, difficulty) {
    /*
    There is a parameter that can be added here to include image questions as well. We chose not to include those.
    */
    let url = new URL("https://the-trivia-api.com/v2/questions");
    url.searchParams.append('limit', limit)
    url.searchParams.append("categories", category);
    url.searchParams.append("difficulties", difficulty);
    return url.href;
}

function getTotalsPerCategoryURL(category, difficulty) {
    /*
    This function is used to help determine the number of questions there are per category and difficulty.
     */
    let url = new URL("https://the-trivia-api.com/v2/totals-per-tag");
    url.searchParams.append('categories', category);
    url.searchParams.append('difficulties', difficulty);
    return url.href;
}

function getSumOfObjectValues(object) {
    let valueArray = Object.values(object)
    return sumArray(valueArray)
}

function printNumberOfQuestionsPerCategoryAndDifficulty() {
    /*
    This function is also used to help determine the number of questions there are per category and difficulty.
    The category and difficulty with the lowest number of questions is (general_knowledge, easy) at 87.
    This could be a concern but for the moment we won't worry about it.
     */
    let categories = Object.values(CATEGORIES_MAP);
    let difficulties = Object.values(DIFFICULTIES_MAP);
    let timeout = 200
    for (let category of categories) {
        for (let difficulty of difficulties) {
            timeout += 100
            setTimeout(
                function() {
                    let url = getTotalsPerCategoryURL(category, difficulty);
                    fetch(url).then((data) => data.json()).then((data) => console.log(category, difficulty, getSumOfObjectValues(data)));
                },
            timeout)
        }
    }
}

