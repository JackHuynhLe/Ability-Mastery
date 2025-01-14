/**
 * Fetches the complete champion data from the League of Legends Data Dragon API.
 *
 * This function performs an HTTP GET request to the Data Dragon API to retrieve detailed information
 * about all champions. It parses the response into a JavaScript object and returns the `data` object,
 * which contains champion details. If the request fails or the response is unsuccessful, an error is logged.
 *
 * Process:
 * 1. Define the API endpoint URL.
 * 2. Perform a `fetch` request to the API.
 * 3. Check if the response status is OK (200-299). If not, throw an error with the response status.
 * 4. Convert the response JSON to a JavaScript object.
 * 5. Extract and return the `data` property containing champion details.
 * 6. Handle and log errors if the request or response fails.
 *
 * @async
 * @function fetchChampionData
 * @returns {Object|undefined} A JavaScript object containing champion data if successful, or `undefined` if an error occurs.
 * @throws {Error} Throws an error if the API request fails or the response status is not OK.
 */
export async function fetchChampionData() {
  const url =
    "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/championFull.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching champion data: ${response.status}`);
    }
    const data = await response.json(); //Converts response from json to js object
    return data.data; // Returns the champion object
  } catch (error) {
    console.error("Failed to fetch champion data:", error);
  }
}
