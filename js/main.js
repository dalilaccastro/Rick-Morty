const characterList = document.getElementById("character-list");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");

let currentPage = 1;
let currentName = "";
let currentStatus = "";

const charactersPerPage = 6;

const fetchCharacters = async (page = 1, name = "", status = "") => {
  try {
    characterList.innerHTML = "<p class='text-center'>Carregando...</p>";
    const res = await fetch(`https://rickandmortyapi.com/api/character?name=${name}&status=${status}`);
    const data = await res.json();

    // Paginação manual com base no page e charactersPerPage
    const allCharacters = data.results;
    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToShow = allCharacters.slice(startIndex, endIndex);

    const totalPages = Math.ceil(allCharacters.length / charactersPerPage);

    renderCharacters(charactersToShow);
    renderPagination(totalPages, page);
  } catch (error) {
    characterList.innerHTML = "<p class='text-danger text-center'>Nenhum personagem encontrado.</p>";
    pagination.innerHTML = "";
  }
};


const renderCharacters = (characters) => {
    let html = '<div class="row gy-4">';
  
    characters.forEach((character) => {
      html += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card card-glow h-100 shadow-sm">
            <img src="${character.image}" class="card-img-top" alt="${character.name}" />
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title">${character.name}</h5>
              <p class="card-text">
                <strong>Status:</strong> <span class="status-badge ${character.status.toLowerCase()}">${character.status}</span><br />
                <strong>Espécie:</strong> ${character.species}<br />
                <strong>Gênero:</strong> ${character.gender}<br />
                <strong>Origem:</strong> ${character.origin.name}<br />
                <strong>Local Atual:</strong> ${character.location.name}
              </p>
              <div class="d-flex justify-content-center mt-3">
                <a href="#" class="btn btn-rickmorty" onclick="openCharacterModal(${character.id})">Ver Detalhes</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  
    html += '</div>';
    characterList.innerHTML = html;
  };
  

const renderPagination = (totalPages, activePage) => {
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === activePage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }
};

const changePage = (page) => {
  currentPage = page;
  fetchCharacters(currentPage, currentName, currentStatus);
};

// Eventos de filtro
searchInput.addEventListener("input", () => {
  currentName = searchInput.value.trim().toLowerCase();
  currentPage = 1;
  fetchCharacters(currentPage, currentName, currentStatus);
});

statusFilter.addEventListener("change", () => {
  currentStatus = statusFilter.value;
  currentPage = 1;
  fetchCharacters(currentPage, currentName, currentStatus);
});

// Início
fetchCharacters(currentPage);

const updateFooterStats = async () => {
    try {
      const [charactersRes, locationsRes, episodesRes] = await Promise.all([
        fetch("https://rickandmortyapi.com/api/character"),
        fetch("https://rickandmortyapi.com/api/location"),
        fetch("https://rickandmortyapi.com/api/episode")
      ]);
  
      const charactersData = await charactersRes.json();
      const locationsData = await locationsRes.json();
      const episodesData = await episodesRes.json();
  
      document.getElementById("total-characters").textContent = charactersData.info.count;
      document.getElementById("total-locations").textContent = locationsData.info.count;
      document.getElementById("total-episodes").textContent = episodesData.info.count;
    } catch (error) {
      console.error("Erro ao carregar dados do rodapé:", error);
    }
  };
  
  updateFooterStats();

  // Modal
  const openCharacterModal = async (id) => {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      const character = await res.json();
  
      document.getElementById("modal-character-name").textContent = character.name;
      document.getElementById("modal-character-img").src = character.image;
      document.getElementById("modal-character-img").alt = character.name;
      document.getElementById("modal-character-status").textContent = character.status;
      document.getElementById("modal-character-species").textContent = character.species;
      document.getElementById("modal-character-gender").textContent = character.gender;
      document.getElementById("modal-character-origin").textContent = character.origin.name;
      document.getElementById("modal-character-location").textContent = character.location.name;
  
      const modal = document.getElementById("character-modal");
      modal.classList.add("show");
      modal.style.display = "block";
      document.body.classList.add("modal-open");
      document.body.insertAdjacentHTML("beforeend", '<div class="modal-backdrop fade show"></div>');
    } catch (error) {
      console.error("Erro ao abrir modal:", error);
    }
  };
  
  const closeModal = () => {
    const modal = document.getElementById("character-modal");
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  };
  
