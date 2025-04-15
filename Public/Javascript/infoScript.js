document.addEventListener('DOMContentLoaded', function () {
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


        } else {
            console.log("No record found for mal_id:", mal_id);
        }
    } else {
        console.log("No mal_id in URL.");
    }
});