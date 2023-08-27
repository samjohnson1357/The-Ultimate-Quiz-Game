/*
File Summary: File contains various functions that manipulate HTML elements in order to provide the initial setup
of the website.
 */

"use strict";

function setAnswerMouseOverEvents() {
    $('.answer')
        .on('mouseenter', function () {
            /*
            The color is changed to red or green after an answer is chosen. This is the only time we don't want to
            change the color.
            */
            let [green, red, darkPurple] = getCSSColors(['--green', '--red', '--dark-purple'])
            let currentColor = this.style.backgroundColor;
            if (currentColor !== red && currentColor !== green) {
                this.style.backgroundColor = darkPurple;
            }
            this.style.cursor = 'pointer';
    })
        .on('mouseleave', function () {
            /*
            The color is changed to red or green after an answer is chosen. This is the only time we don't want to
            change the color.
             */
            let [green, red, darkBlue] = getCSSColors(['--green', '--red', '--dark-blue'])
            let currentColor = this.style.backgroundColor;
            if (currentColor !== red && currentColor !== green) {
                this.style.backgroundColor = darkBlue;
            }
            this.style.cursor = 'auto';
    });
}

