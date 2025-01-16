// Object to store the current state of the scoreboard
let score = {
    correct: 0,        // Number of correct answers
    incorrect: 0,      // Number of incorrect answers
    currentStreak: 0,  // Current streak of correct answers
    longestStreak: 0,  // Longest streak of correct answers achieved
};

/**
 * Updates the scoreboard display on the webpage.
 *
 * This function ensures that the values displayed in the scoreboard reflect
 * the current state of the `score` object. It retrieves the values for
 * correct answers, incorrect answers, current streak, and longest streak,
 * and updates the corresponding DOM elements with these values.
 *
 * Process:
 * 1. Access the `score.correct` value and update the "Correct" score element.
 * 2. Access the `score.incorrect` value and update the "Incorrect" score element.
 * 3. Access the `score.currentStreak` value and update the "Current Streak" score element.
 * 4. Access the `score.longestStreak` value and update the "Longest Streak" score element.
 * 5. Reflect the changes immediately on the webpage.
 *
 * This function is called whenever the score is modified to ensure the scoreboard
 * stays up-to-date.
 *
 * @function updateScoreboard
 * @returns {void} This function does not return any value.
 */
function updateScoreboard() {
    document.getElementById("correct-score").textContent = score.correct;
    document.getElementById("incorrect-score").textContent = score.incorrect;
    document.getElementById("current-streak").textContent = score.currentStreak
    document.getElementById("longest-streak").textContent = score.longestStreak
}


/**
 * Increments the correct answer count and updates the scoreboard.
 *
 * This function performs the following actions:
 * 1. Increases the `correct` score in the `score` object by 1.
 * 2. Increases the `currentStreak` value by 1.
 * 3. Updates `longestStreak` if the current streak surpasses the recorded longest streak.
 * 4. Calls `updateScoreboard()` to refresh the displayed scoreboard values.
 *
 * Process:
 * 1. Increment the `score.correct` and `score.currentStreak`.
 * 2. Compare `currentStreak` with `longestStreak`.
 *    - If `currentStreak` exceeds `longestStreak`, update `longestStreak`.
 * 3. Refresh the scoreboard UI to reflect the updated scores.
 *
 * @function incrementCorrect
 * @returns {void} This function does not return any value.
 */
export function incrementCorrect() {
    score.correct++
    score.currentStreak++
    if (score.currentStreak > score.longestStreak) {
        score.longestStreak = score.currentStreak;
    }
    updateScoreboard();
}

/**
 * Increments the incorrect answer count and updates the scoreboard.
 *
 * This function performs the following actions:
 * 1. Increases the `incorrect` score in the `score` object by 1.
 * 2. Resets the `currentStreak` to 0 as the streak is broken by an incorrect answer.
 * 3. Calls `updateScoreboard()` to refresh the displayed scoreboard values.
 *
 * Process:
 * 1. Increment the `score.incorrect` value.
 * 2. Reset `score.currentStreak` to 0.
 * 3. Refresh the scoreboard UI to reflect the updated scores by calling `updateScoreboard`.
 *
 * @function incrementIncorrect
 * @returns {void} This function does not return any value.
 */
export function incrementIncorrect() {
    score.incorrect++;
    score.currentStreak = 0;
    updateScoreboard();
}

/**
 * Resets the scoreboard to its initial state and updates the UI.
 *
 * This function clears all scores and streaks in the `score` object, resetting it to its default values.
 * After resetting, it refreshes the displayed scoreboard to reflect the changes.
 *
 * Process:
 * 1. Reinitialize the `score` object with the following default values:
 *    - `correct`: 0
 *    - `incorrect`: 0
 *    - `currentStreak`: 0
 *    - `longestStreak`: 0
 * 2. Call `updateScoreboard()` to refresh the scoreboard UI and display the reset values.
 *
 * @function resetScoreboard
 * @returns {void} This function does not return any value.
 */
export function resetScoreboard() {
    score = {
        correct: 0,
        incorrect: 0,
        currentStreak: 0,
        longestStreak: 0,
    };
    updateScoreboard();
}

/**
 * Initializes the scoreboard display when the DOM content is fully loaded.
 *
 * This event listener ensures the scoreboard is updated and correctly displayed 
 * with the initial values from the `score` object as soon as the webpage is ready.
 *
 * Process:
 * 1. Listen for the `DOMContentLoaded` event, which signals that the DOM is fully constructed.
 * 2. Call the `updateScoreboard` function to populate the scoreboard UI with initial values.
 *
 * @event DOMContentLoaded
 * @returns {void} This function does not return any value.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateScoreboard();
})