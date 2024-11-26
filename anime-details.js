// show loading indicator
function showLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = "block";
}

// hide loading indicator
function hideLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = "none";
}

// fetch anime details by ID
async function fetchAnimeDetails(animeId) {
    showLoadingIndicator(); // show loading indicator
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`);
        const data = await response.json();
        hideLoadingIndicator(); // hide loading indicator

        // anime details 
        document.getElementById("animeTitle").textContent = data.data.attributes.canonicalTitle;
        document.getElementById("animeImage").src = data.data.attributes.posterImage.large; 
        document.getElementById("animeDescription").textContent = data.data.attributes.synopsis || "No description available.";
        document.getElementById("animeRating").textContent = `Rating: ${data.data.attributes.averageRating || "N/A"}`;
        document.getElementById("animeGenres").textContent = `Genres: ${data.data.attributes.subtype || "No genres available."}`;
        
        // episodes, seasons, and platform availability
        document.getElementById("animeEpisodes").textContent = `Episodes: ${data.data.attributes.episodeCount || "N/A"}`;
        
        document.getElementById("animeSeasons").textContent = `Seasons: ${data.data.attributes.seasonCount || "N/A"}`;

        const platforms = data.data.attributes.platforms || ["Platform data not available"];
        document.getElementById("animePlatforms").textContent = `Available on: ${platforms.join(", ")}`;
        
    } catch (error) {
        hideLoadingIndicator(); 
        console.error("Error fetching anime details:", error);
        document.getElementById("animeDescription").textContent = "Error loading anime details.";
    }
}

// function to get the anime ID
function getAnimeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

document.addEventListener("DOMContentLoaded", () => {
    const animeId = getAnimeIdFromUrl();
    fetchAnimeDetails(animeId);

    // Back button 
    document.getElementById("backButton").addEventListener("click", () => {
        window.history.back();
    });
});
