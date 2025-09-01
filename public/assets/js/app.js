
async function carregarUsuarios() {
  const resposta = await fetch('http://localhost:3000/usuarios');
  const dados = await resposta.json();
  return dados; 
}

async function loadCarouselData() {
  try {
    const response = await fetch("http://localhost:3000/carrouselData");
    if (!response.ok) throw new Error("Erro ao carregar dados do carrossel");
    const carouselData = await response.json();
    createCarouselItems(carouselData);
  } catch (error) {
    console.error("Erro ao carregar carrossel:", error);
  }
}

async function loadNewsData() {
  try {
    const response = await fetch("http://localhost:3000/noticias");
    if (!response.ok) throw new Error("Erro ao carregar notícias");
    const newsData = await response.json();
    carregarNoticias(newsData);
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
  }
}


function createCarouselItems(carouselData) {
    const carouselInner = document.getElementById("carousel-inner");
    
    // Clear existing indicators
    const indicatorsContainer = document.querySelector(".carousel-indicators");
    indicatorsContainer.innerHTML = "";

    carouselData.forEach((item, index) => {
      // Create indicator
      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.setAttribute("data-bs-target", "#carouselExampleDark");
      indicator.setAttribute("data-bs-slide-to", index);
      indicator.setAttribute("aria-label", `Slide ${index + 1}`);
      if (index === 0) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-current", "true");
      }
      indicatorsContainer.appendChild(indicator);

      // Create carousel item
      const carouselItem = document.createElement("div");
      carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
      carouselItem.setAttribute("data-bs-interval", index === 0 ? "10000" : "2000");

      // Create clickable link around the image
      const link = document.createElement("a");
      link.href = `detalhes.html?id=${item.id}`;
      link.style.display = "block";
      link.style.height = "100%";

      const img = document.createElement("img");
      img.src = item.imagem[0].path || item.imagem[0].src;
      img.className = "d-block w-100";
      img.alt = item.imagem[0].alt;
      img.style.height = "500px"; // Fixed height for carousel
      img.style.width = "100%";
      img.style.objectFit = "cover";

      const caption = document.createElement("div");
      caption.className = "carousel-caption d-none d-md-block text-black bg-gradient display-6";

      const title = document.createElement("h4");
      title.className = "carrousel-title";
      title.textContent = item.titulo;

      const description = document.createElement("p");
      description.className = "carrousel-description";
      description.textContent = item.subtitulo;

      caption.appendChild(title);
      caption.appendChild(description);
      link.appendChild(img);
      carouselItem.appendChild(link);
      carouselItem.appendChild(caption);
      carouselInner.appendChild(carouselItem);
    });
  }


async function getFavoritos() {
  const res = await fetch("http://localhost:3000/favoritos");
  return await res.json();
}

function criarCard(noticia, ehFavorito = false, modoFavorito = false) {
  const card = document.createElement("div");
  card.className = "card mb-4 col";

  const img = document.createElement("img");
  img.src = noticia.imagem[0].path;
  img.className = "card-img-top";
  img.alt = noticia.imagem[0].alt;

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = noticia.titulo;

  const text = document.createElement("p");
  text.className = "card-text flex-grow-1";
  text.textContent = noticia.texto.substring(0, 100) + "...";

  const buttons = document.createElement("div");
  buttons.className = "m-4 p-3 d-flex justify-content-between";

  const saibaMais = document.createElement("a");
  saibaMais.href = `detalhes.html?id=${noticia.id}`;
  saibaMais.className = "btn btn-outline-success";
  saibaMais.textContent = "Saiba mais";

  const favBtn = document.createElement("button");
  favBtn.className = ehFavorito ? "btn btn-warning" : "btn btn-outline-warning";
  favBtn.innerHTML = ehFavorito ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
  favBtn.title = ehFavorito ? "Remover dos favoritos" : "Favoritar";

  favBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (ehFavorito) {
      await fetch(`http://localhost:3000/favoritos/${noticia.id}`, { method: "DELETE" });
      if (modoFavorito) card.remove();
      else {
        favBtn.className = "btn btn-outline-warning";
        favBtn.innerHTML = '<i class="bi bi-star"></i>';
        ehFavorito = false;
      }
    } else {
      await fetch("http://localhost:3000/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticia),
      });
      favBtn.className = "btn btn-warning";
      favBtn.innerHTML = '<i class="bi bi-star-fill"></i>';
      ehFavorito = true;
    }
  });

  buttons.appendChild(saibaMais);
  buttons.appendChild(favBtn);
  body.appendChild(title);
  body.appendChild(text);
  body.appendChild(buttons);
  card.appendChild(img);
  card.appendChild(body);

  return card;
}

async function carregarNoticias(noticias) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";
  const favoritos = await getFavoritos();
  noticias.forEach((noticia) => {
    const ehFavorito = favoritos.some((fav) => fav.id === noticia.id);
    const card = criarCard(noticia, ehFavorito, false);
    container.appendChild(card);
  });
}

async function carregarFavoritos() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  try {
    const favoritos = await getFavoritos();
    if (favoritos.length === 0) {
      container.innerHTML = "<p class='text-center'>Nenhum favorito salvo.</p>";
      return;
    }

    favoritos.forEach((noticia) => {
      const card = criarCard(noticia, true, true);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    container.innerHTML = "<p class='text-danger'>Erro ao carregar favoritos.</p>";
  }
}


const userProfile = document.getElementById("userProfile");
const imgUser = userProfile.querySelector("img");

const usuarioStr = sessionStorage.getItem("usuario");

if (usuarioStr && imgUser) {
  imgUser.src = "assets/images/logOut.png";
}



userProfile.addEventListener("click", async () => {
  const usuarioStr = sessionStorage.getItem("usuario");


  if (!usuarioStr) {
    location.href = "login.html";
  
  }

  const usuario = JSON.parse(usuarioStr);


  
  const confirmar = confirm(`${usuario.nome}, deseja sair da conta?`);
  if (confirmar) {
    sessionStorage.removeItem("usuario");
    location.href = "login.html";
  }
});




document.getElementById("searchButton").addEventListener("click", function (e) {
  e.preventDefault();
  const termo = document.getElementById("searchInput").value.trim();
  window.location.href = `index.html?search=${encodeURIComponent(termo)}`;
});







