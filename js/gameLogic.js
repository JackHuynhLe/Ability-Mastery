import { fetchChampionData } from "./fetchData.js";

let champions = {}; // Store champion data globally
let currentChampion = ""; // Store the current champion
let currentChampionAbilities = []; // Store the current champion's abilities

/**
 * Preloads data for a random champion and their abilities.
 *
 * This function fetches all champion data from an external source, selects a random champion,
 * and retrieves their abilities (including some random abilities from other champions).
 * It then displays the selected champion and their abilities on the page.
 *
 * Steps:
 * 1. Fetches the champion data.
 * 2. Selects a random champion from the fetched data.
 * 3. Retrieves a set of abilities, including those of the selected champion and random other champions.
 * 4. Displays the selected champion and their abilities on the page.
 *
 * @async
 * @function preloadChampionData
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
 * If the champion's splash art is unavailable, the alt text is used for better accessibility.
 *
 * @param {string} champion - The name of the champion to display.
 *
 * @function displayChampion
 */
function displayChampion(champion) {
  const championNameElement = document.getElementById("champion-name");
  championNameElement.textContent = `Champion: ${champion}`; // Displays the champion name
  const characterImageElement = document.getElementById("champion-image");
  characterImageElement.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`; // Displays the champion splash art
  characterImageElement.alt = `${champion} Splash Art`; // Alt text in case champion art does not load
}

/**
 * Retrieves the abilities (Q, W, E, R, Passive) of the given champion, including their names and images.
 *
 * This function extracts the abilities of a specified champion from the global `champions` data,
 * including their names and image URLs for display. It returns an array of ability objects that
 * contain the ability's name and the URL for the corresponding image.
 *
 * @param {string} champion - The name of the champion whose abilities are to be fetched.
 * @returns {Array} An array of ability objects, each containing a name and image URL for the ability.
 *
 * @function getChampionAbilities
 */
function getChampionAbilities(champion) {
  const championData = champions[champion];
  const abilities = [];

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

  // Add the champion's passive ability, with its name
  if (championData.passive) {
    abilities.push({
      name: championData.passive.name,
      image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${championData.passive.image.full}`,
    });
  }

  console.log("Selected Champion Abilities:", abilities); // Log the selected champion's abilities
  return abilities;
}

/**
 * Retrieves abilities from the selected champion and randomly selects additional abilities from other champions.
 *
 * This function first fetches the abilities (Q, W, E, R, Passive) of the selected champion using the
 * `getChampionAbilities` function and adds them to a list. Then, it randomly selects abilities from other
 * champions to fill up to 20 total abilities, ensuring a mix of abilities from different champions.
 *
 * @param {string} selectedChampion - The name of the champion whose abilities will be added to the list.
 * @returns {Array} An array of ability objects, each containing the name and image URL of the ability.
 *
 * @function getRandomChampionAbilities
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
 * Displays a list of abilities in a randomized order in the abilities container.
 *
 * This function clears the previous abilities (if any) from the abilities container,
 * shuffles the abilities array to randomize their order, and then dynamically creates
 * HTML elements for each ability. The abilities are displayed with their image and name.
 * Each ability is made draggable for interaction.
 *
 * @param {Array} abilities - An array of ability objects, each containing a name and image URL.
 * @returns {void} This function does not return any value.
 *
 * @function displayAbilities
 */
function displayAbilities(abilities) {
  const abilitiesContainer = document.getElementById("abilities-container");

  // Clear previous abilities
  abilitiesContainer.innerHTML = "";

  // Shuffle abilities for randomness
  const shuffledAbilities = shuffleArray(abilities);

  // Add abilities to the DOM
  shuffledAbilities.forEach((ability, index) => {
    const abilityDiv = document.createElement("div");
    abilityDiv.classList.add("ability");

    // Assign unique ID
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
 * This function takes an array and randomly reorders its elements. It modifies
 * the original array and does not create a new one. The Fisher-Yates algorithm
 * ensures that each element has an equal probability of appearing in each position.
 *
 * @param {Array} array - The array to be shuffled.
 * @returns {Array} The shuffled array, with the original array being modified.
 *
 * @function shuffleArray
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
/**
 * Clears all dropped abilities from the slots.
 *
 * This function resets each ability slot by replacing the current image with the default placeholder image
 * and restoring its default styles (border, background color, and shadow). It also re-enables dragging
 * for all abilities, ensuring the game can be played again.
 *
 * Steps:
 * 1. Iterate through all ability slots.
 * 2. Reset each slot's image to the placeholder.
 * 3. Restore default styles for the slots.
 * 4. Enable dragging for all ability elements and reset their opacity.
 *
 * @function clearDroppedAbilities
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
 * Displays the "Clear" and "Submit" buttons.
 *
 * This function makes the action buttons (Clear and Submit) visible by modifying their CSS `display` property.
 * The buttons are hidden by default and appear only after the "Play" button is clicked.
 *
 * @function showActionButtons
 */
function showActionButtons() {
  const actionButtons = document.getElementById("action-buttons");
  actionButtons.style.display = "flex"; // Show the buttons
}

/**
 * Initializes event listeners for action buttons.
 *
 * This function attaches click event listeners to the Clear and Submit buttons:
 * - The Clear button triggers `clearDroppedAbilities` to reset the game state.
 * - The Submit button is a placeholder for future functionality.
 *
 * Steps:
 * 1. Select the Clear and Submit buttons from the DOM.
 * 2. Attach a click event listener to the Clear button to clear all dropped abilities.
 * 3. Attach a click event listener to the Submit button to log a placeholder message.
 *
 * @function initializeActionButtons
 */
function initializeActionButtons() {
  const clearButton = document.getElementById("clear-button");
  const submitButton = document.getElementById("submit-button");

  // Add click listener to the Clear button
  clearButton.addEventListener("click", () => {
    clearDroppedAbilities();
  });

  // Placeholder for Submit button functionality
  submitButton.addEventListener("click", () => {
    console.log("Submit button clicked! Add functionality here.");
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
  });

  // Initialize the action buttons
  initializeActionButtons();
});
