let champions = [];
let debounceTimeout;
let selectedRole = 'all'; 
let searchInputText = '';

// JSON FILE
async function fetchChampions() {
    try {
        const response = await fetch('../JSON/champions-list.json'); 
        if (!response.ok) {
            throw new Error('Network response not ok.');
        }
        champions = await response.json(); 
        createChampionCards();
        changeImageObjectPosition();
    } catch (error) {
        console.error('Fetching champions error: ', error);
    }
}

// CREATE CHAMPION CARDS
function createChampionCards() {
    const grid = document.getElementById("js-champion-grid");
    grid.innerHTML = '';

    champions.forEach(champion => {
        const card = document.createElement("div");
        card.classList.add("champion-card");
        card.setAttribute("data-roles", champion.roles.join(',')); 
        
        card.innerHTML = `
            <img src="${champion.image}" alt="${champion.name}">
            <div class="overlay">
                <h2> ${champion.name} </h2>
                <p> Role <p> 
                 <p class="role">${champion.roles}</p>
        `;

        grid.appendChild(card);
    });
}

// FILTER CHAMPIONS
function filterChampions(role) {
    selectedRole = role;

    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });

    const selectedButton = document.querySelector(`[data-role="${role}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    const championCards = Array.from(document.querySelectorAll('.champion-card'));

    championCards.forEach((champion) => {
        champion.classList.add('hidden');
    });


    setTimeout(() => {
        championCards.forEach((champion, index) => {
            const roles = champion.getAttribute('data-roles').split(',');

            setTimeout(() => {
                if (role === 'all' || roles.includes(role)) {
                    champion.classList.remove('hidden');
                }
            }, index * 5); 
        });
    }, 50); 

    searchChampions();
}

// SEARCH CHAMPIONS
function searchChampions() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const championCards = document.querySelectorAll('.champion-card'); 
    const noResultsMessage = document.getElementById("no-results-message");
    const pleaseTypeMoreMessage = document.getElementById("please-type-more-message");

    let noResultsFound = true; 
    const inputLength = searchInput.length;

    searchInputText = searchInput; 

    if (inputLength === 0) {
        championCards.forEach(champion => {
            if (selectedRole === 'all' || champion.getAttribute('data-roles').split(',').includes(selectedRole)) {
                champion.style.display = 'block';
            } else {
                champion.style.display = 'none';
            }
        });
        noResultsMessage.style.display = "none";
        pleaseTypeMoreMessage.style.display = "none";
        return; 
    }

    if (inputLength === 1) {
        pleaseTypeMoreMessage.style.display = "block";
        noResultsMessage.style.display = "none";
        championCards.forEach(champion => {
            champion.style.display = 'none';
        });
        return; 
    } else {
        pleaseTypeMoreMessage.style.display = "none";
    }

    championCards.forEach(champion => {
        const championName = champion.querySelector('h2').textContent.toLowerCase();
        const roles = champion.getAttribute('data-roles').split(',');

        if ((selectedRole === 'all' || roles.includes(selectedRole)) && championName.includes(searchInput)) {
            champion.style.display = 'block';
            noResultsFound = false;
        } else {
            champion.style.display = 'none';
        }
    });

    if (noResultsFound) {
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }
}

function addFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const role = this.getAttribute('data-role');
            filterChampions(role);
        });
    });
}

function changeImageObjectPosition() {
    const objectPositionMap = {
        "30% 50%": [84], // Naafiri
        "40% 50%": [54, 71, 128], // K'Sante, Lillia, Syndra
        "45% 50%": [35, 82, 114, 160], // Galio, Mordekaiser, Seraphine, Yuumi
        "60% 50%": [1, 4, 6, 24, 32, 39, 44, 52, 101, 103, 105, 106, 111, 112, 121, 125, 139, 141], //Ahri, Alistar, Anivia Fiddlesticks, Gragas, Hwei, Jhin, Rakan, Rek'Saim Renata Glasc, Renekton, Samira, Sejuani, Sivir, Soraka, Twitch, Urgot
        "65% 50%": [0, 13, 21, 22, 45, 56, 75, 77, 78, 93, 102, 136, 145, 149, 151],  // Aatrox, Bard, Cassiopeia, Cho'Gath, Illaoi, Kalista, Lux, Malzahar, Maokai, Olaf, Rammus, Trundle, Vel'Koz, Viktor, Vladimir
        "70% 50%": [3, 5, 9, 15, 31, 33, 42, 50, 59, 60, 69, 73, 86, 90, 91, 92, 97, 100, 107, 120, 129, 131, 134, 144, 146, 153, 154, 161, 162],   // Akshan, Amumu, Ashe, Blitzcrank, Ezreal, Fiora, Hecarim, Jax, Kassadin, Katarina, Leesin, Lucian, Nasus, Nilah, Nocturne, Nunu, Rengar, Sion, Tahm Kench, Talon, Thresh, Veigar, Vex, Wukong Xayah, Zac, Zed
        "75% 50%": [12, 23, 25, 36, 53, 58, 67, 68, 72, 74, 76, 109, 118, 119, 124, 126, 135, 137, 138, 152, 159], // Azir, Corki, Diana, Gangplank, Jinx, Karthus, Kog'Maw, Leblanc, Lissandra, Lulu, Malphite, Poppy, Rumble, Shyvana, Singed, Sona, Swain, Tristana, Tryndamere, Twisted Fate, Warwick
        "80% 50%": [19, 28, 29, 43, 49, 57, 64, 81, 94, 110, 116, 117, 130, 147, 148, 150, 157, 164], // Caitlyn, Ekko, Elise, Heimerdinger, Jarvan IV, Kalista, Kha'Zix, Miss Fortune, Oriannam, Ryze, Shaco, Shen, Taliyah, Vi, Viego, Vladimir, Yasuo, Ziggs
        "85% 50%": [7, 16, 17, 27, 37, 38, 40, 51 , 61, 63, 65, 66, 70, 83, 85, 87, 89, 108, 132, 143, 167],  // Annie, Brand, Braum, Draven, Garen, Gnar, Gragas, Jayce, Kayle, Kennen, Kindred, Kled, Leona, Morgana, Nami, Nautilus, Nidalee, Riven, Taric, Vayne, Zyra
        "90% 50%": [20, 34, 48, 79], // Camille, Fizz, Janna, Master Yi
    };
    
    const images = document.querySelectorAll('.champion-card img');
    
    for (let i = 0; i < images.length; i++) {
        for (const [position, indices] of Object.entries(objectPositionMap)) {
            if (indices.includes(i)) {
                images[i].style.objectPosition = position;
                break;
            }                          
        }
    }
}

function handleSearchInput() {
    const searchInput = document.querySelector('.searchbar-container input');
    const championGrid = document.querySelector('.css-champion-grid');

    if (searchInput && championGrid) {
        searchInput.addEventListener('input', function() {
            if (searchInput.value.trim()) {
                championGrid.classList.add('searching'); 
            } else {
                championGrid.classList.remove('searching'); 
            }
            searchChampions();
        });
    } else {
        console.error('Search input or champion grid element not found');
    }
}

document.querySelectorAll('.champion-card').forEach(card => {
    observer.observe(card);
});

// Call the fetch function everytime the page loads
window.onload = function () {
    fetchChampions(); // Fetch the champions data
    addFilterEventListeners(); // Add filter button event listeners
    changeImageObjectPosition(); // Adjust the image object position 
    handleSearchInput(); // Call the function to handle the search input
   
};