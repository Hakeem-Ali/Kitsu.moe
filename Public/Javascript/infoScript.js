document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in (boolean)
    const isUserLoggedIn = () => {
        const user = firebase.auth().currentUser;
        return user !== null;
    };

    // Get the current URL
    const url = window.location.href;

    // Use regular expression to extract the mal_id from the query string
    const match = url.match(/(\d+)$/);
    if (match) {
        const mal_id = match[1]; // Extract mal_id
        console.log("ID from URL:", mal_id); // Log the ID from URL

        // Retrieve the rec object from localStorage using mal_id
        const rec = JSON.parse(localStorage.getItem(`anime_rec_${mal_id}`));

        if (rec) {
            // Log the full rec object
            console.log("Full rec object:", rec); 

            // Populate the title, score, synopsis, and other info dynamically
            document.getElementById('anime_title').textContent = rec.title;
            document.getElementById('anime_score').textContent = `Score: ${rec.score}`;
            document.getElementById('anime_synopsis').textContent = rec.synopsis;
            document.getElementById('poster_image').innerHTML = `<img src="${rec.images.webp.image_url}" alt="${rec.title} Poster">`;

            // Update stars based on score
            const stars = document.getElementById('stars');
            stars.innerHTML = '';
            const roundedScore = Math.floor(rec.score);
            for (let i = 0; i < 10; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.innerHTML = `<img src="${i < roundedScore ? '../Media/gold_star.png' : '../Media/white_star.png'}" alt="star">`;
                stars.appendChild(star);
            }

            // Populate character cards dynamically
            const characterCards = document.getElementById('character_cards');
            rec.characters.forEach(character => {
                const card = document.createElement('div');
                card.classList.add('extra_spacing_for_cards');
                card.innerHTML = `
                    <div class="card">
                        <div class="card_container glass_pane">
                            <img src="${character.character_image}" alt="${character.character_name}">
                            <p class="upper_card_name">${character.character_name}</p>
                            <p class="lower_card_name">${character.voice_actor}</p>
                            <img src="${character.voice_actor_image}" alt="${character.voice_actor}">
                        </div>
                    </div>
                `;
                characterCards.appendChild(card);
            });

            // Check if the user is logged in
            const isLoggedIn = isUserLoggedIn();

            // If the user is logged in, show rating and watch status
            if (isLoggedIn) {
                // Show rating and watch status
                document.getElementById('user_rating_section').style.display = 'block';
                document.getElementById('watch_status_section').style.display = 'block';
            } else {
                // Hide rating and watch status
                document.getElementById('user_rating_section').style.display = 'none';
                document.getElementById('watch_status_section').style.display = 'none';
            }


        } else {
            console.log("No record found for mal_id:", mal_id);
        }
    } else {
        console.log("No mal_id in URL.");
    }
});

// Function to display the "Watching" icon
function displayGreenIcon() {
    let result = document.querySelector('#watch_status_icon');
    let html = '<img src="../Media/green_watching.png" alt="Watching">';
    result.innerHTML = html; // Update the icon
}

// Function to display the "Plan to Watch" icon
function displayGreyIcon() {
    let result = document.querySelector('#watch_status_icon');
    let html = '<img src="../Media/grey_plan_to_watch.png" alt="Plan to Watch">';
    result.innerHTML = html; // Update the icon
}

// Function to display the "Completed" icon
function displayBlueIcon() {
    let result = document.querySelector('#watch_status_icon');
    let html = '<img src="../Media/blue_completed.png" alt="Completed">';
    result.innerHTML = html; // Update the icon
}

// Function to update the icon based on dropdown selection
function updateWatchStatusIcon() {
    const status = document.getElementById('status').value; // Get the selected status
    switch (status) {
        case 'watching':
            displayGreenIcon(); // Display the "Watching" icon
            break;
        case 'plan_to_watch':
            displayGreyIcon(); // Display the "Plan to Watch" icon
            break;
        case 'completed':
            displayBlueIcon(); // Display the "Completed" icon
            break;
        default:
            displayGreyIcon(); // Default to "Plan to Watch" icon
            break;
    }
}

// Add event listener to dropdown to trigger icon update
document.getElementById('status').addEventListener('change', updateWatchStatusIcon);

// Initial call to set the correct status icon when the page loads (if needed)
window.onload = function() {
    updateWatchStatusIcon(); // Ensures the correct icon is displayed when the page loads
};