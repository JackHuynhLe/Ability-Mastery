import { fetchChampionData } from "./fetchData.js";
import { playSound } from "./utils.js";
import {
  incrementCorrect,
  incrementIncorrect,
  resetScoreboard,
} from "./scoreBoard.js";

let champions = {}; // Store champion data globally
let currentChampion = ""; // Store the current champion
let currentChampionAbilities = []; // Store the current champion's abilities

/**
 * Preloads data for a random champion and their abilities.
 *
 * This function fetches all champion data from an external source, selects a random champion,
 * retrieves their abilities (including random abilities from other champions), and displays
 * the selected champion and their abilities on the page.
 *
 * Process:
 * 1. Fetch all champion data using `fetchChampionData`.
 * 2. Log the retrieved champion data for debugging purposes.
 * 3. Randomly select a champion from the fetched data.
 * 4. Retrieve the selected champion's abilities and additional random abilities using `getRandomChampionAbilities`.
 * 5. Display the selected champion's name and splash art using `displayChampion`.
 * 6. Display the selected champion's abilities in the UI using `displayAbilities`.
 *
 * @async
 * @function preloadChampionData
 * @returns {Promise<void>} This function does not return any value but operates asynchronously.
 */
export async function preloadChampionData() {
  champions = await fetchChampionData(); // Get all champion data
  console.log(champions); // Check if the data is fetched correctly
  const championKeys = Object.keys(champions); // Get all champion names
  currentChampion =
    championKeys[Math.floor(Math.random() * championKeys.length)]; // Pick a random Champion to be displayed
  currentChampionAbilities = await getRandomChampionAbilities(currentChampion); // Get random abilities, including from other champions
  displayChampion(currentChampion);
  displayAbilities(currentChampionAbilities); // Display the abilities
}

/**
 * Displays the selected champion's name and splash art on the page.
 *
 * This function updates the DOM to show the name and splash art of the given champion.
 * It modifies the content of the champion's name and image elements on the page.
 * If the champion's splash art is unavailable, an appropriate alt text is set for accessibility.
 *
 * Process:
 * 1. Update the champion's name in the designated DOM element.
 * 2. Set the champion's splash art image in the designated image element.
 * 3. Provide an alt attribute with a descriptive fallback in case the image fails to load.
 *
 * @param {string} champion - The name of the champion to display.
 * @returns {void} This function does not return any value.
 */
function displayChampion(champion) {
  const championNameElement = document.getElementById("champion-name");
  championNameElement.textContent = `Champion: ${champion}`; // Displays the champion name
  const characterImageElement = document.getElementById("champion-image");
  characterImageElement.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`; // Displays the champion splash art
  characterImageElement.alt = `${champion} Splash Art`; // Alt text in case champion art does not load
}

/**
 * Retrieves the abilities (Passive, Q, W, E, R) of the given champion.
 *
 * This function extracts the abilities of a specified champion from the global `champions` data.
 * It retrieves both the passive ability and the four spell abilities (Q, W, E, R) and
 * constructs an array of ability objects containing the name and image URL for each ability.
 *
 * Process:
 * 1. Access the champion's data from the `champions` object using the provided champion name.
 * 2. Add the champion's passive ability to the abilities array, including its name and image URL.
 * 3. Add the champion's spell abilities (Q, W, E, R) to the abilities array in order,
 *    including their names and image URLs.
 * 4. Log the retrieved abilities for debugging purposes.
 * 5. Return the constructed abilities array.
 *
 * @param {string} champion - The name of the champion whose abilities are to be fetched.
 * @returns {Array} An array of ability objects, each containing a `name` and `image` property.
 */
function getChampionAbilities(champion) {
  const championData = champions[champion];
  const abilities = [];

  // Add the champion's passive ability, with its name
  if (championData.passive) {
    abilities.push({
      name: championData.passive.name,
      image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${championData.passive.image.full}`,
    });
  }

  // Include the champion's abilities (Q, W, E, R, Passive) with their names
  if (championData.spells) {
    abilities.push(
      {
        name: championData.spells[0].name,
        image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${championData.spells[0].id}.png`,
      }, // Q
      {
        name: championData.spells[1].name,
        image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${championData.spells[1].id}.png`,
      }, // W
      {
        name: championData.spells[2].name,
        image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${championData.spells[2].id}.png`,
      }, // E
      {
        name: championData.spells[3].name,
        image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${championData.spells[3].id}.png`,
      } // R
    );
  }

  console.log("Selected Champion Abilities:", abilities); // Log the selected champion's abilities
  return abilities;
}

/**
 * Retrieves a mix of abilities from the selected champion and random abilities from other champions.
 *
 * This function constructs an array of ability objects containing the abilities of the selected champion
 * (Passive, Q, W, E, R) and additional random abilities from other champions to fill the list to a total of 20.
 * Each ability object includes the name and image URL of the ability.
 *
 * Process:
 * 1. Fetch the selected champion's abilities using `getChampionAbilities` and add them to the abilities list.
 * 2. Determine the number of additional abilities needed to reach a total of 20.
 * 3. Randomly select abilities from other champions:
 *    - Choose a random champion from the available pool (excluding the selected champion).
 *    - Randomly pick an ability type (Passive, Q, W, E, R) from the selected champion.
 *    - Add the chosen ability to the list if valid.
 * 4. Ensure each ability added contains its name and image URL.
 * 5. Log the final list of abilities for debugging purposes.
 * 6. Return the completed abilities list.
 *
 * @async
 * @function getRandomChampionAbilities
 * @param {string} selectedChampion - The name of the champion whose abilities are being featured.
 * @returns {Promise<Array>} A promise resolving to an array of ability objects, each containing `name` and `image`.
 */
async function getRandomChampionAbilities(selectedChampion) {
  const abilities = [];

  // First, fetch the abilities of the selected champion (Q, W, E, R, Passive) with names
  const selectedChampionAbilities = getChampionAbilities(selectedChampion);
  abilities.push(...selectedChampionAbilities); // Add selected champion's abilities to the list

  // Then, get random abilities from other champions to fill up to 20 total abilities
  const championKeys = Object.keys(champions);
  const otherChampions = championKeys.filter(
    (champion) => champion !== selectedChampion
  ); // Exclude the selected champion
  const numberOfAdditionalAbilities = 20 - abilities.length; // Calculate how many more abilities we need

  for (let i = 0; i < numberOfAdditionalAbilities; i++) {
    const randomChampion =
      otherChampions[Math.floor(Math.random() * otherChampions.length)];
    const randomChampionData = champions[randomChampion];

    // Randomly pick an ability (Q, W, E, R, or Passive) from the random champion
    const randomAbilityType = Math.floor(Math.random() * 5); // 0 to 4
    let randomAbility = null;

    switch (randomAbilityType) {
      case 0:
        randomAbility = randomChampionData.spells
          ? randomChampionData.spells[0]
          : null; // Q
        break;
      case 1:
        randomAbility = randomChampionData.spells
          ? randomChampionData.spells[1]
          : null; // W
        break;
      case 2:
        randomAbility = randomChampionData.spells
          ? randomChampionData.spells[2]
          : null; // E
        break;
      case 3:
        randomAbility = randomChampionData.spells
          ? randomChampionData.spells[3]
          : null; // R
        break;
      case 4:
        randomAbility = randomChampionData.passive
          ? randomChampionData.passive
          : null; // Passive
        break;
      default:
        break;
    }

    // If a valid ability is found, push it to the abilities array with the correct name
    if (randomAbility) {
      if (randomAbility.id) {
        // If it's a spell (Q, W, E, R)
        abilities.push({
          name: randomAbility.name,
          image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${randomAbility.id}.png`,
        });
      } else if (randomAbility.image) {
        // If it's a passive ability
        abilities.push({
          name: randomAbility.name, // Use the passive ability's name
          image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${randomAbility.image.full}`,
        });
      }
    }
  }

  console.log("Total Abilities:", abilities); // Log all abilities
  return abilities;
}

/**
 * Displays a shuffled list of abilities in the abilities container.
 *
 * This function populates the abilities container with a randomized display of abilities,
 * creating interactive elements for each ability. It ensures each ability is draggable
 * and integrates with the drag-and-drop functionality.
 *
 * Process:
 * 1. Clear the abilities container to remove any previously displayed abilities.
 * 2. Shuffle a copy of the provided abilities array to randomize their order for display.
 * 3. For each ability:
 *    - Create a `div` element with the class `ability`.
 *    - Assign a unique ID for identification during drag-and-drop interactions.
 *    - Populate the element with the ability's image and name.
 *    - Mark the element as draggable.
 * 4. Append each ability element to the abilities container.
 * 5. Reinitialize drag-and-drop functionality to make the new elements interactive.
 *
 * @function displayAbilities
 * @param {Array} abilities - An array of ability objects, each containing a `name` and `image` property.
 * @returns {void} This function does not return any value.
 */
function displayAbilities(abilities) {
  const abilitiesContainer = document.getElementById("abilities-container");

  // Clear previous abilities
  abilitiesContainer.innerHTML = "";

  // Shuffle a copy of the abilities array for display
  const shuffledAbilities = shuffleArray([...abilities]); // Copy the array

  // Add abilities to the DOM
  shuffledAbilities.forEach((ability, index) => {
    const abilityDiv = document.createElement("div");
    abilityDiv.classList.add("ability");

    // Assign a unique ID for identification
    abilityDiv.setAttribute("id", `ability-${index}`);
    abilityDiv.setAttribute("draggable", true);
    abilityDiv.innerHTML = `
      <img src="${ability.image}" alt="${ability.name}" />
      <p>${ability.name}</p>
    `;
    abilitiesContainer.appendChild(abilityDiv);
  });

  // Initialize drag-and-drop functionality for the newly added abilities
  initializeDragAndDrop();
}

/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
 *
 * This function randomizes the order of elements within the provided array.
 * It modifies the original array directly and returns the shuffled array.
 * The Fisher-Yates algorithm ensures an unbiased and uniform random distribution of elements.
 *
 * Process:
 * 1. Iterate through the array from the last element to the second element.
 * 2. For each element, generate a random index `j` between 0 and the current index `i`.
 * 3. Swap the elements at indices `i` and `j`.
 * 4. Continue until all elements have been processed.
 *
 * @function shuffleArray
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} The shuffled array, with the original array modified in place.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Clears all dropped abilities from the slots and resets the game state.
 *
 * This function restores each ability slot to its initial state by resetting the image,
 * styles, and any associated data. It also reactivates dragging for all abilities, ensuring
 * the game can be played again from a clean state.
 *
 * Process:
 * 1. Iterate through all ability slots:
 *    - Replace the current slot image with the default placeholder image.
 *    - Reset slot styles, including border, shadow, and background color.
 * 2. Iterate through all draggable abilities:
 *    - Reactivate the `draggable` attribute for all abilities.
 *    - Reset the opacity of abilities to make them fully visible.
 * 3. Log a message to confirm that all slots and abilities have been reset.
 *
 * @function clearDroppedAbilities
 * @returns {void} This function does not return any value.
 */
function clearDroppedAbilities() {
  const slots = document.querySelectorAll(".ability-slot");

  // Reset all slot images and styles
  slots.forEach((slot) => {
    const slotImage = slot.querySelector("img.placeholder");

    if (slotImage) {
      slotImage.src = "assets/pictures/missing_ping.jpg";
      slotImage.alt = "Ability Placeholder";
    }

    // Reset slot styles
    slot.style.borderColor = "#ccc";
    slot.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    slot.style.backgroundColor = "#f8f8f8";
  });

  // Reactivate dragging for all abilities
  const abilities = document.querySelectorAll(".ability");
  abilities.forEach((ability) => {
    ability.setAttribute("draggable", true);
    ability.style.opacity = "1"; // Reset opacity
  });

  console.log("All slots cleared and styles reset.");
}

/**
 * Displays the action buttons (Clear and Submit).
 *
 * This function makes the action buttons visible by updating their `display` style property.
 * The buttons are initially hidden and only appear when this function is called.
 *
 * Process:
 * 1. Select the action buttons container from the DOM using its ID.
 * 2. Update the container's `display` property to "flex" to make the buttons visible.
 *
 * @function showActionButtons
 * @returns {void} This function does not return any value.
 */
function showActionButtons() {
  const actionButtons = document.getElementById("action-buttons");
  actionButtons.style.display = "flex"; // Show the buttons
}

/**
 * Resets the game state for a new round.
 *
 * This function prepares the game for a new champion by clearing the current state,
 * reloading a new champion with its abilities, and reinitializing drag-and-drop functionality.
 * The action buttons (Clear and Submit) are hidden during the reset process and shown again afterward.
 *
 * Process:
 * 1. Hide the action buttons by updating their `display` style property.
 * 2. Clear all dropped abilities and reset slots using `clearDroppedAbilities`.
 * 3. Fetch and display a new random champion and its abilities using `preloadChampionData`.
 * 4. Reinitialize drag-and-drop functionality for the new abilities and slots.
 * 5. Show the action buttons again after the reset is complete.
 *
 * @async
 * @function resetGameState
 * @returns {Promise<void>} This function returns a promise that resolves when the new champion data is loaded and the game state is reset.
 */
async function resetGameState() {
  const actionButtons = document.getElementById("action-buttons");

  // Hide the action buttons
  actionButtons.style.display = "none";

  // Clear dropped abilities
  clearDroppedAbilities();

  // Fetch and load a new champion
  await preloadChampionData();

  // Reinitialize drag-and-drop
  initializeDragAndDrop();

  // Show the action buttons again
  actionButtons.style.display = "flex";
}

/**
 * Validates the player's submitted abilities against the expected abilities of the current champion.
 *
 * This function ensures the abilities placed in the slots match the expected abilities
 * for the selected champion in the correct order. If all abilities are correct, the game proceeds
 * to the next round by resetting the game state, and the player's score is updated. If any ability
 * is incorrect, the game resets and updates the player's incorrect score.
 *
 * Process:
 * 1. Retrieve all ability slots from the DOM.
 * 2. Iterate through each slot and compare its `data-ability-name` attribute
 *    to the corresponding ability name in `currentChampionAbilities`.
 * 3. If a slot's ability name does not match the expected name or is empty, mark the submission as incorrect.
 * 4. Play a sound and update the scoreboard:
 *    - On correct submission:
 *      - Play the victory sound.
 *      - Increment the correct score using `incrementCorrect`.
 *      - Reset the game state to load a new champion and abilities.
 *    - On incorrect submission:
 *      - Play the defeat sound.
 *      - Increment the incorrect score using `incrementIncorrect`.
 *      - Reset the game state to allow the player to try again.
 * 5. Log validation details for debugging purposes.
 *
 * @function submitAnswers
 * @returns {void} This function does not return any value.
 */
function submitAnswers() {
  const slots = document.querySelectorAll(".ability-slot");
  let isCorrect = true;

  slots.forEach((slot, index) => {
    const slotAbilityName = slot.getAttribute("data-ability-name"); // Get the ability name stored in the slot
    const expectedAbilityName = currentChampionAbilities[index].name; // Get the expected ability name

    if (!slotAbilityName || slotAbilityName !== expectedAbilityName) {
      console.log(
        `Slot ${index} validation failed: expected "${expectedAbilityName}", got "${slotAbilityName}"`
      );
      isCorrect = false;
    }
  });

  if (isCorrect) {
    playSound("assets/audio/victory.mp3"); // Play victory sound
    incrementCorrect(); // Update the scoreboard
    resetGameState(); // Proceed to the next champion
  } else {
    playSound("assets/audio/defeat.mp3"); // Play defeat sound
    incrementIncorrect(); // Update the scoreboard
    resetGameState(); //Proceed to the next champion
  }
}

/**
 * Hides the Play button when the game starts.
 *
 * This function updates the `display` style property of the Play button to "none",
 * effectively removing it from view. It is typically called when the game begins
 * to prevent the player from restarting mid-round.
 *
 * Process:
 * 1. Select the Play button from the DOM using its ID.
 * 2. Update the `display` style property of the button to "none".
 *
 * @function hidePlayButton
 * @returns {void} This function does not return any value.
 */
function hidePlayButton() {
  const playButton = document.getElementById("play-button");
  const playSection = document.querySelector(".play-section");
  playButton.style.display = "none";
  playSection.remove();
}

/**
 * Refreshes the current champion.
 *
 * This function resets the ability slots, reloads the current champion's data and abilities,
 * reinitializes the drag-and-drop functionality and resets scoreboard. It is useful for scenarios where the user
 * wants to start over with a new champion without resfreshing the page.
 *
 * Steps:
 * 1. Clears the current ability slots.
 * 2. Reloads the current champion's data and abilities.
 * 3. Reinitializes drag-and-drop interactions for the updated abilities.
 * 4. Reset the scoreboard.
 *
 * @async
 * @function refreshChampion
 */
async function refreshChampion() {
  console.log("Refreshing the current champion...");

  // Clear the dropped abilities
  clearDroppedAbilities();

  // Reload the current champion's abilities and display
  await preloadChampionData();

  // Reinitialize drag-and-drop functionality
  initializeDragAndDrop();

  // Reset scoreboard
  resetScoreboard();

  console.log("Champion refreshed.");
}

/**
 * Initializes event listeners for the action buttons (Clear and Submit).
 *
 * This function sets up click event listeners for the Clear and Submit buttons to handle their respective actions:
 * - The Clear button resets the ability slots using `clearDroppedAbilities`.
 * - The Submit button validates the player's answers using `submitAnswers`.
 *
 * Process:
 * 1. Select the Clear and Submit buttons from the DOM using their respective IDs.
 * 2. Attach a click event listener to the Clear button to invoke `clearDroppedAbilities`.
 * 3. Attach a click event listener to the Submit button to invoke `submitAnswers`.
 * 4. Attach a click event listener to the Refresh button to invoke `refreshChampion`.
 *
 * @function initializeActionButtons
 * @returns {void} This function does not return any value.
 */
function initializeActionButtons() {
  const clearButton = document.getElementById("clear-button");
  const submitButton = document.getElementById("submit-button");
  const refreshButton = document.getElementById("refresh-button");

  // Add click listener to the Clear button
  clearButton.addEventListener("click", () => {
    clearDroppedAbilities();
  });

  // Add click listener to the Submit button
  submitButton.addEventListener("click", () => {
    submitAnswers();
  });

  // Add click listener to the Refresh button
  refreshButton.addEventListener("click", async () => {
    await refreshChampion(); // Call the refresh function
  });
}

/**
 * Attaches event listeners to the Play button and initializes the game.
 *
 * This function waits for the DOM content to load, then attaches a click event listener to the Play button.
 * When the Play button is clicked:
 * 1. Fetch and display a random champion and their abilities using `preloadChampionData`.
 * 2. Activate drag-and-drop functionality with `initializeDragAndDrop`.
 * 3. Display the action buttons (Clear and Submit) using `showActionButtons`.
 * 4. Ensure action buttons are ready by calling `initializeActionButtons`.
 * 5. Hide the play button once the game begins using `hidePlayButton`.
 *
 * @function
 */
document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("play-button");

  playButton.addEventListener("click", async () => {
    console.log("Play button clicked!");

    // Call the function to fetch and display a random champion and their abilities
    await preloadChampionData();

    // Activate drag-and-drop
    initializeDragAndDrop();

    // Show action buttons after Play is clicked
    showActionButtons();

    // Hide the Play button
    hidePlayButton();
  });

  // Initialize the action buttons
  initializeActionButtons();
});
