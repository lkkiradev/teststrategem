fetch('../JSON/tierlist.json')
    .then(response => response.json())
    .then(champions => {
        const filterButtons = document.querySelectorAll('.filter-button');
        const roleDropdown = document.getElementById('role-filter');

        function renderChampionsByRole(role) {
          const allTierContainers = document.querySelectorAll('.tier-champions');
          
          allTierContainers.forEach(container => container.classList.add('hidden'));
          
          setTimeout(() => {

              allTierContainers.forEach(container => (container.innerHTML = ''));
      
              const tiers = ['S', 'A', 'B', 'C', 'D'];
              
              tiers.forEach(tier => {
                  const filteredChampions = champions.filter(
                      champion => champion.roles.includes(role) && champion.tier === tier
                  );
      
                  const tierContainer = document.getElementById(`${tier.toLowerCase()}-tier-champions`);
                  
                  filteredChampions.forEach(champion => {
                      const championCard = document.createElement('div');
                      championCard.className = 'champion-card';
      
                      let winRateColor;
                      if (tier === 'S') {
                          winRateColor = '#2fff00;';
                      } else if (tier === 'A') {
                          winRateColor = 'rgb(0, 200, 0);';
                      } else if (tier === 'B') {
                          winRateColor = 'white';
                      } else if (tier === 'C') {
                          winRateColor = '#ffe478';
                      } else if (tier === 'D') {
                          winRateColor = 'red';
                      }
      
                      championCard.innerHTML = `
                          <img src="${champion.image}" alt="${champion.name}">
                          <div class="popup">
                              <p class="champ-name">${champion.name}</p>
                              <p class="champ-wr"> Win Rate: <span style="color: ${winRateColor}">${champion.win_rate}%</span></p>
                          </div>
                      `;
                      tierContainer.appendChild(championCard);
                  });
              });
      
              allTierContainers.forEach(container => container.classList.remove('hidden'));
          }, 500); 
      }

        renderChampionsByRole('Top Lane');


        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const selectedRole = button.getAttribute('data-role');
                renderChampionsByRole(selectedRole);
            });
        });

        roleDropdown.addEventListener('change', (event) => {
            const selectedRole = event.target.value;
            renderChampionsByRole(selectedRole);
        });
    })
    .catch(error => console.error('Error fetching champion data:', error));
