function toggleDropdown() {
            let menu = document.getElementById("menu");
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        }

        // Close dropdown when clicking outside
        document.addEventListener("click", function(event) {
            const dropdown = document.querySelector(".dropdown");
            const menu = document.getElementById("menu");

            if (dropdown && menu && !dropdown.contains(event.target)) {
                menu.style.display = "none";
            }
        });

//Login script

//Check if user is logged in (boolean)
const isUserLoggedIn = () => {
    const user = firebase.auth().currentUser;
    return user !== null;
};

document.addEventListener("DOMContentLoaded", function () {

    //Firebase login function
    const signIn = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
        alert("Account created and signed in!");
    })
    .catch((error) => {
        console.error("Signup error:", error.message);
        alert("Signup failed: " + error.message);
    });
    };

    //Attach to login form
    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // prevent reload

            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            if (!email || !password) {
                alert('Please fill in both fields.');
                return;
            }

            signIn(email, password);
        });
    } else {
        console.error("Login form not found. Make sure the ID is 'login_form'");
    }
});

//Catalogue Script
let page = 1;
let state = [];
activeFilter = null;
           
//gets Data
async function getData(page){
    try{
        const response = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);

        //if api hits the rate limit, helps prevent the script from break and retries after 2 seconds
        if (!response.ok){
            console.warn("Rate Limit Reached... Retrying...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            return [];
        }   

        const anime = await response.json();
        state = anime.data || [];     
        filterAndDisplay()
    }catch(error){
        console.error("Error fetching Data: ", error);
        state = []//stops the script from breaking
    }    
}
            
//applies any filters if necessary and ensures 25 cards a page
async function filterAndDisplay(){
    filteredData = state;
    if(activeFilter){
        filteredData = state.filter(anime => anime.genres.some(genre => genre.name === activeFilter)
        );
    }
    showAll(filteredData);
}

//shows all the necessary information
function showAll(records){
    let result = document.querySelector('#anime_cards');
    let html = '';

    for(let rec of records){
        let genres ='';
        let maxGenres = Math.min(rec.genres.length, 5);

        for(let i = 0; i<maxGenres; i++){
            genres += (genres ? ', ' : '') + rec.genres[i].name;
        }

        if(rec.genres.length > 5){
            genres += '...';
        }

        // Store the rec object in localStorage with the key 'anime_rec_<mal_id>'
        localStorage.setItem(`anime_rec_${rec.mal_id}`, JSON.stringify(rec));

        html+=`
            <div class="extra_spacing_for_cards">
                <a href="info.html?${rec.mal_id}" class="anime-link">
                    <div class="card">
                        <img src="${rec.images.webp.image_url}" alt="Avatar" style="width:100%">
                        <div class="card_container glass_pane">
                            <h4><b>${rec.title}</b></h4>
                            <p>Score: ${rec.score}</p>
                            <p>Genres: ${genres}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    result.innerHTML = html;

    // Add click event listener to all links (anchor tags)
    const links = document.querySelectorAll('.anime-link');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const url = new URL(link.href); // Get the URL of the clicked link
            const id = url.searchParams.get('mal_id'); // Get the value of 'mal_id' from the query string

            console.log("ID from URL:", id); // Logs the ID to the console
        });
    });
}

//applies the filter if selected
function applyFilter(genre){
    activeFilter = genre;
    page = 1;
    getData(page);
}

//resets the filter to show all
function resetFilter(){
    activeFilter = null;
    page = 1;
    getData(page);
}

// MAYBE this code could fix some of the filtering issues,
// but takes very long. Apparently Jikan wasn't built to display filtered genres properly so the problem lies with them
// ignore the code since it's commented out

// function applyFilter(genre) {
//     activeFilter = genre;
//     page = 1;
//     getFilteredData();
// }

// async function getFilteredData() {
//     let filtered = [];
//     let tempPage = 1;
//     const maxPages = 10; // just to prevent infinite loops

//     while (filtered.length < 25 && tempPage <= maxPages) {
//         try {
//             const response = await fetch(`https://api.jikan.moe/v4/anime?page=${tempPage}`);

//             if (!response.ok) {
//                 console.warn("Rate limit hit, retrying...");
//                 await new Promise(resolve => setTimeout(resolve, 2000));
//                 continue;
//             }

//             const anime = await response.json();
//             const matches = anime.data.filter(anime =>
//                 anime.genres.some(g => g.name === activeFilter)
//             );

//             filtered.push(...matches);
//             tempPage++;
//         } catch (error) {
//             console.error("Error while filtering:", error);
//             break;
//         }
//     }

//     showAll(filtered.slice(0, 25));
// }

//increments to the next page
function nextPage(){
    page++;
    getData(page);
}

//decrements to the previous page if possible
function prevPage(){
    if(page>1){
        page--;
        getData(page);
    }
}

getData(page);

//info script

document.addEventListener('DOMContentLoaded', function () {
    const statusDropdown = document.getElementById('status');
    const icon = document.getElementById('watch_status_icon');

    if(statusDropdown){
        statusDropdown.disabled = true;
        statusDropdown.title = "Checking login status...";
    }

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
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("Blocked icon update: User not logged in");
        return;
    }

    const status = document.getElementById('status').value;
    switch (status) {
        case 'watching':
            displayGreenIcon();
            break;
        case 'plan_to_watch':
            displayGreyIcon();
            break;
        case 'completed':
            displayBlueIcon();
            break;
        default:
            displayGreyIcon();
            break;
    }
}

//Final login check on page load
firebase.auth().onAuthStateChanged(function(user) {
    const stars = document.querySelectorAll('.star img');


    if (user) {
        console.log("User is logged in");

        if (statusDropdown) {
            statusDropdown.disabled = false;
            statusDropdown.title = '';

            statusDropdown.addEventListener('change', function(){
                updateWatchStatusIcon();
            });
        }

        updateWatchStatusIcon(); // Show correct icon

        // Enable rating (if interactive)
        stars.forEach(star => {
            star.style.pointerEvents = 'auto';
            star.title = '';
        });

    } else {
        console.log("User is not logged in");

        if (statusDropdown) {
            statusDropdown.disabled = true;
            statusDropdown.value = '';
            statusDropdown.title = "Login required to update watch status.";
        }

        if (icon) {
            icon.innerHTML = '<p style="color: gray;">Login to update status</p>';
        }

        // Disable rating interaction
        stars.forEach(star => {
            star.style.pointerEvents = 'none';
            star.title = "Login required to rate.";
        });
    }
});