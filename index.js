// loading indicator
function showLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = "block";
}


// hide loading indicator
function hideLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = "none";
}


// fetch popular anime
async function fetchPopularAnime() {
    showLoadingIndicator(); // loading indicator
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?sort=popularityRank&page[limit]=12`);
        const data = await response.json();
        hideLoadingIndicator(); // hide loading indicator
    
        displayAnime(data.data, "weeklyPopular");
    } catch (error) {
        hideLoadingIndicator(); // hide loading indicator
    
        console.error("Error fetching popular anime:", error);
        document.getElementById("weeklyPopular").innerHTML = "<p>Error loading popular anime.</p>";
    }
}


// fetch new additions
async function fetchNewAdditions() {
    showLoadingIndicator();
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?sort=createdAt&page[limit]=12`);
        const data = await response.json();
        hideLoadingIndicator(); 
        displayAnime(data.data, "newAdditions");
    } catch (error) {
        hideLoadingIndicator(); 
        console.error("Error fetching new additions:", error);
        document.getElementById("newAdditions").innerHTML = "<p>Error loading new additions.</p>";
    }
}


// fetch upcoming anime
async function fetchUpcomingAnime() {
    showLoadingIndicator(); 
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[status]=upcoming&page[limit]=12`);
        const data = await response.json();
        hideLoadingIndicator(); 
        displayAnime(data.data, "upcomingAnime");
    } catch (error) {
        hideLoadingIndicator(); // hide loading indicator
    
        console.error("Error fetching upcoming anime:", error);
        document.getElementById("upcomingAnime").innerHTML = "<p>Error loading upcoming anime.</p>";
    }
}

fetchPopularAnime();
fetchNewAdditions();
fetchUpcomingAnime();


// fetch anime by genre  
async function fetchAnimeByGenre(genre, elementId) {
    showLoadingIndicator(); // loading indicator
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[genres]=${genre}&page[limit]=12`);
        const data = await response.json();

        if (data.data.length > 0) {
            hideLoadingIndicator(); // hide loading indicator
        
            displayAnime(data.data, elementId);
        } else {
            hideLoadingIndicator(); // hide loading indicator
        
            document.getElementById(elementId).innerHTML = "<p>No anime available in this genre.</p>";
        }
    } catch (error) {
        hideLoadingIndicator(); // hide loading indicator
    
        console.error("Error fetching data from Kitsu:", error);
        document.getElementById(elementId).innerHTML = "<p>Error loading anime data.</p>";
    }
}


// fetch anime on search input
async function searchAnime(query) {
    showLoadingIndicator(); // loading indicator
    try {
        const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.data.length > 0) {
            hideLoadingIndicator(); // hide loading indicator
        
            displayAnime(data.data, "searchResults");
        } else {
            hideLoadingIndicator(); // hide loading indicator
        
            document.getElementById("searchResults").innerHTML = "<p>No results found.</p>";
        }
    } catch (error) {
        hideLoadingIndicator(); // hide loading indicator
    
        console.error("Error fetching search results from Kitsu:", error);
        document.getElementById("searchResults").innerHTML = "<p>Error loading search results.</p>";
    }
}


// genre IDs 
const genreNames = {
    comedy: "comedy",
    adventure: "adventure",
    fantasy: "fantasy",
    horror: "horror",
    sciFi: "science-fiction",
    mystery: "mystery",
    action: "action",
    romance: "romance"
};


// fetch data for each genre
fetchAnimeByGenre(genreNames.comedy, "comedyAnime");
fetchAnimeByGenre(genreNames.adventure, "adventureAnime");
fetchAnimeByGenre(genreNames.fantasy, "fantasyAnime");
fetchAnimeByGenre(genreNames.horror, "horrorAnime");
fetchAnimeByGenre(genreNames.sciFi, "sciFiAnime");
fetchAnimeByGenre(genreNames.mystery, "mysteryAnime");
fetchAnimeByGenre(genreNames.action, "actionAnime");
fetchAnimeByGenre(genreNames.romance, "romanceAnime");


// event listener to the search button
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        searchAnime(query);
    } else {
        document.getElementById("searchResults").innerHTML = "<p>Please enter a genre or anime title.</p>";
    }
});


// display anime data in the specified HTML element
function displayAnime(animeList, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ""; 

    animeList.forEach(anime => {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");

        // image for the anime poster
        const animeImage = document.createElement("img");
        animeImage.src = anime.attributes.posterImage.small; 
        animeImage.alt = anime.attributes.canonicalTitle;

        // title for the anime name
        const animeTitle = document.createElement("h3");
        animeTitle.textContent = anime.attributes.canonicalTitle;

        // add image and title in the card
        animeCard.appendChild(animeImage);
        animeCard.appendChild(animeTitle);

        animeCard.addEventListener("click", () => {
            window.location.href = `anime-details.html?id=${anime.id}`; // Redirect to details page with ID
        });

        container.appendChild(animeCard);
    });
}


// add a comment
function addComment(commentText) {
    const commentsSection = document.getElementById('commentsSection');
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `<p>${commentText}</p>
        <div class="reply-form">
            <textarea placeholder="Reply..."></textarea>
            <button class="submitReply">Reply</button>
        </div>`;
    
    commentsSection.appendChild(commentDiv);
    
    // add a reply 
    const replyButton = commentDiv.querySelector('.submitReply');
    replyButton.addEventListener('click', () => {
        const replyText = replyButton.previousElementSibling.value;
        if (replyText) {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'reply';
            replyDiv.innerHTML = `<p>${replyText}</p>`;
            commentDiv.appendChild(replyDiv);
            replyButton.previousElementSibling.value = ''; 
        }
    });
}


// handling comment submission
document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value;
    if (commentText) {
        addComment(commentText);
        commentInput.value = ''; 
    }
});


//feedback submission
document.getElementById("submitFeedback").addEventListener("click", function(event) {
    event.preventDefault(); 
    var feedbackInput = document.getElementById("message").value;
    var feedbackMessage = document.getElementById("feedbackMessage");
    if (feedbackInput) {
        feedbackMessage.textContent = "Thank you for your feedback!";
        feedbackMessage.style.color = "#28a745"; 
        document.getElementById("message").value = ""; 
    } else {
        feedbackMessage.textContent = "Please enter some feedback!";
        feedbackMessage.style.color = "red";
    }
});


//authentication modal
document.getElementById("authButton").addEventListener("click", () => {
    document.getElementById("authModal").style.display = "flex";
});

document.getElementById("closeButton").addEventListener("click", () => {
    document.getElementById("authModal").style.display = "none";
});




//sign in/up form
document.getElementById("toggleToSignUp").addEventListener("click", function() {
    document.getElementById("signInForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "block";
});

document.getElementById("toggleToSignIn").addEventListener("click", function() {
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("signInForm").style.display = "block";
});

document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("authModal").style.display = "none";
});

document.getElementById("forgotPassword").addEventListener("click", function() {
    alert("Password reset instructions will be sent to your email."); 
});

