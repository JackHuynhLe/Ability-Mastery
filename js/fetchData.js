/**
 * Fetches the complete champion data from the League of Legends Data Dragon API.
 *
 * This function makes an HTTP request to the Data Dragon API to retrieve detailed
 * information about all champions. It processes the response, converting it from
 * JSON format to a JavaScript object, and returns the champion data.
 *
 * If the request fails or the response is not successful, it throws an error.
 *
 * @returns {Object} A JavaScript object containing detailed information about all champions.
 * @throws {Error} If there is an issue with the fetch request or the response.
 *
 * @async
 * @function fetchChampionData
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
