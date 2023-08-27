/*
File Summary: Manage the stats and help modals.
 */

"use strict";

function getStatsCategorySelectedByUser() {
    return document.getElementById('category-drop-down-stats').value
}

function getStatsDifficultySelectedByUser() {
    return document.getElementById('difficulty-drop-down-stats').value
}

function deleteAndRecreateCanvas() {
    $('#score-line-plot').remove()
    let canvas = document.createElement("canvas");
    $('#stats-modal').append(canvas)
    canvas.id = 'score-line-plot'
    return canvas
}

function getChartInstance(category, difficulty) {
    let scoreObj = readDataFromLocalStorage(category, difficulty)
    let canvas = document.getElementById('score-line-plot');
    const context = canvas.getContext('2d');

    // Create a new chart instance.
    return new Chart(context, {
        type: 'line',
        data: {
            labels: scoreObj['dateTimes'],
            datasets: [
                {
                    label: 'Score',
                    data: scoreObj['scores'],
                    borderColor: 'blue',
                    backgroundColor: 'transparent',
                    pointRadius: 5,
                    pointBackgroundColor: 'blue',
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            hour: 'MM-dd-yyyy HH:mm',
                            day: 'MM-dd-yyyy'
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date',
                    },
                },
                y: {
                    beginAtZero: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Score',
                    },
                },
            },
        },
    })
}

function drawScoreLineChart(category, difficulty) {
    if (typeof CHART !== 'undefined') {
        CHART.destroy();
    }
    CHART = getChartInstance(category, difficulty)
}

function setStatsOnChangePlottingEvent() {
    $('#category-drop-down-stats, #difficulty-drop-down-stats').on('change', function() {
        let category = getStatsCategorySelectedByUser()
        let difficulty = getStatsDifficultySelectedByUser()
        drawScoreLineChart(category, difficulty)
    })
}

function setStatsModalOpenCloseEvents() {
    $('#stats-icon').on('click', function() {
        $('#stats-modal').css('display', 'block')
        let lastScore = getMostRecentScoreFromLocalStorage()
        $('#final-score').html(lastScore)
    })

    $('#stats-modal-close-button').on('click', function() {
        $('#stats-modal').css('display', 'none')
    })

    $(window).click(function(event) {
        if ($(event.target).is('#score-modal')) {
            $('#stats-modal').hide();
        }
    });
}

function setHelpModalOpenCloseEvents() {
    $('#help-icon').on('click', function() {
        $('#help-modal').css('display', 'block')
    })

    $('#help-modal-close-button').on('click', function() {
        $('#help-modal').css('display', 'none')
    })

    $(window).click(function(event) {
        if ($(event.target).is('#help-modal')) {
            $('#help-modal').hide();
        }
    });
}
