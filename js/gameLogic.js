import { fetchChampionData } from "./fetchData.js";

let champions = {}; //Store champion data globally
let currentChampion = ""; //Store the current champion

// Load champion and pick one at random
export async function preloadChampionData() {
    champions = await fetchChampionData(); // Get all champion data
    const championKeys = Object.keys(champions); // Get all champion names
    currentChampion = championKeys[Math.floor(Math.random() * championKeys.length)]; // Pick a random Champion to be displayed
    displayChampion(currentChampion)
}

//Display the current champion's name in the UI
function displayChampion(champion) {
    const championNameElement = document.getElementById("champion-name"); 
    championNameElement.textContent = `Champion: ${champion}`; // Displays the champion name

    const characterImageElement = document.getElementById("character-image");
    characterImageElement.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`; //Displays the champion splash art
    characterImageElement.alt = `${champion} Splash Art`; // Alt text incase champion art does not load
}

// Attach an event listner to the play button to display champion name and iamge
document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-button");

    playButton.addEventListener("click", async () => {
        console.log("Play button clicked!");
        await preloadChampionData(); // Call the function to fetch and display a random champion
    });
});