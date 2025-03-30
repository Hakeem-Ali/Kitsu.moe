function toggleDropdown() {
            let menu = document.getElementById("menu");
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        }

        // Close dropdown when clicking outside
        document.addEventListener("click", function(event) {
            let dropdown = document.querySelector(".dropdown");
            let menu = document.getElementById("menu");

            if (!dropdown.contains(event.target)) {
                menu.style.display = "none";
            }
        });