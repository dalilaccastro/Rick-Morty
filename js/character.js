const characterDetails = document.getElementById("character-details");

const getCharacterIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
};

const fetchCharacterDetails = async () => {
  const id = getCharacterIdFromURL();

  if (!id) {
    characterDetails.innerHTML = "<p class='text-danger'>Personagem não encontrado!</p>";
    return;
  }

  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    const character = await res.json();

    const firstEpisodeUrl = character.episode[0];
    const episodeRes = await fetch(firstEpisodeUrl);
    const episodeData = await episodeRes.json();

    renderCharacter(character, episodeData);
  } catch (error) {
    console.error("Erro ao buscar personagem:", error);
    characterDetails.innerHTML = "<p class='text-danger'>Erro ao carregar os dados.</p>";
  }
};

const renderCharacter = (character, firstEpisode) => {
  characterDetails.innerHTML = `
    <div class="card flex-row align-items-center p-4 shadow">
      <img src="${character.image}" alt="${character.name}" class="rounded me-4" style="width: 150px; height: 150px; object-fit: cover;" />
      <div class="flex-grow-1">
        <h3 class="mb-2">${character.name}</h3>
        <p class="mb-1"><strong>Status:</strong> <span class="status-badge ${character.status.toLowerCase()}">${character.status}</span></p>
        <p class="mb-1"><strong>Espécie:</strong> ${character.species}</p>
        <p class="mb-1"><strong>Gênero:</strong> ${character.gender}</p>
        <p class="mb-1"><strong>Última localização:</strong> ${character.location.name}</p>
        <p class="mb-1"><strong>Primeira aparição:</strong> ${firstEpisode.name} (${firstEpisode.episode})</p>
      </div>
    </div>
  `;
};

fetchCharacterDetails();
