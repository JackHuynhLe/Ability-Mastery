
// Fetch champion data from Riot API
export async function fetchChampionData(){
    const url = 'https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/champion.json';

    try{
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