// Load user comments from localStorage
function loadUserComments() {
    const commentsSection = document.getElementById("userComments");
    const comments = JSON.parse(localStorage.getItem("userComments")) || [];
    commentsSection.innerHTML = comments.length > 0
        ? comments.map(comment => `<p>${comment.comment} (${new Date(comment.timestamp).toLocaleString()})</p>`).join("")
        : "<p>No comments yet.</p>";
}

// Load search history from localStorage
function loadSearchHistory() {
    const searchHistorySection = document.getElementById("searchHistory");
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistorySection.innerHTML = searchHistory.length > 0
        ? searchHistory.map(history => `<p>${history.query} (${new Date(history.timestamp).toLocaleString()})</p>`).join("")
        : "<p>No search history yet.</p>";
}

// Generate personalized recommendations based on search history
function getMostSearchedGenre() {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const genreCount = {};

    // Count occurrences of each genre
    searchHistory.forEach(entry => {
        const genre = entry.query.toLowerCase();
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Find the most frequently searched genre
    return Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, "");
}

function generateRecommendations() {
    const recommendationsSection = document.getElementById("recommendationsSection");
    const mostSearchedGenre = getMostSearchedGenre();
    if (mostSearchedGenre) {
        fetchAnimeByGenre(mostSearchedGenre);
    } else {
        recommendationsSection.innerHTML = "<p>No recommendations yet.</p>";
    }
}

// Function to fetch anime by genre and display on profile page
async function fetchAnimeByGenre(genre) {
    const recommendationsSection = document.getElementById("recommendationsSection");
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[genres]=${encodeURIComponent(genre)}`);
        const data = await response.json();
        recommendationsSection.innerHTML = data.data.map(anime => `<p>${anime.attributes.titles.en || anime.attributes.titles.en_jp}</p>`).join("");
    } catch (error) {
        recommendationsSection.innerHTML = "<p>Error loading recommendations.</p>";
    }
}

// Load all profile data when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadUserComments();
    loadSearchHistory();
    generateRecommendations();
});
