const API_URL = "http://localhost:3000";

function displayMessage(mensagem, tipo = "warning") {
  const msg = document.getElementById("msg");
  msg.innerHTML = `<div class="alert alert-${tipo}">${mensagem}</div>`;

  setTimeout(() => {
    msg.innerHTML = "";
  }, 5000);
}

// Função para buscar dados do JSON Server
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Erro na requisição");
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    displayMessage(`Erro ao carregar ${endpoint}`, "danger");
    return [];
  }
}

// Função para reordenar IDs sequencialmente
async function reorderIds(endpoint) {
  try {
    const data = await fetchData(endpoint);
    data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    for (let i = 0; i < data.length; i++) {
      const newId = (i + 1).toString();
      if (data[i].id !== newId) {
        data[i].id = newId;
        await fetch(`${API_URL}/${endpoint}/${data[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data[i]),
        });
      }
    }
    return true;
  } catch (error) {
    console.error(`Erro ao reordenar IDs em ${endpoint}:`, error);
    return false;
  }
}

// Função para carregar e exibir o carrossel
async function loadCarrouselData() {
  const carrouselData = await fetchData("carrouselData");
  const container = document.getElementById("carrousel-container");

  container.innerHTML = carrouselData
    .map(
      (item) => `
        <a href="#" class="list-group-item list-group-item-action" data-id="${item.id}" onclick="fillFormWithCarrouselData('${item.id}')">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${item.titulo}</h5>
            <small>ID: ${item.id}</small>
          </div>
          <p class="mb-1">${item.subtitulo}</p>
          <small><img src="${item.imagem[0].path}" alt="${item.imagem[0].alt}" style="max-width: 100px; max-height: 60px; object-fit: cover;"></small>
        </a>
      `
    )
    .join("");
}

// Função para carregar e exibir notícias
async function loadNoticiasData() {
  const noticiasData = await fetchData("noticias");
  const container = document.getElementById("noticias-container");

  container.innerHTML = noticiasData
    .map(
      (item) => `
        <a href="#" class="list-group-item list-group-item-action" data-id="${item.id}" onclick="fillFormWithNoticiaData('${item.id}')">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${item.titulo}</h5>
            <small>ID: ${item.id}</small>
          </div>
          <p class="mb-1">${item.texto.substring(0, 100)}...</p>
          <p class="mb-1">Categoria: ${item.categoria || "N/A"}</p> <!-- ADICIONADO -->
          <small><img src="${item.imagem[0].path}" alt="${item.imagem[0].alt}" style="max-width: 100px; max-height: 60px; object-fit: cover;"></small>
        </a>
      `
    )
    .join("");
}

// Função para preencher o formulário com dados do carrossel
function fillFormWithCarrouselData(id) {
  fetch(`${API_URL}/carrouselData/${id}`)
    .then((response) => response.json())
    .then((item) => {
      document.getElementById("inputId").value = item.id;
      document.getElementById("inputTitulo").value = item.titulo;
      document.getElementById("inputSubtitulo").value = item.subtitulo || "";
      document.getElementById("inputTexto").value = "";
      document.getElementById("inputPath").value = item.imagem[0].path || "";
      document.getElementById("inputAlt").value = item.imagem[0].alt || "";
      document.getElementById("inputCategoria").value = ""; // <-- ADICIONADO: limpa categoria
      document.getElementById("selectTipo").value = "carrousel";

      document.getElementById("formNoticia").scrollIntoView({ behavior: "smooth" });
    })
    .catch((error) => {
      console.error("Erro ao buscar item do carrossel:", error);
      displayMessage("Erro ao carregar os dados do carrossel", "danger");
    });
}

// Função para preencher o formulário com dados de notícia
function fillFormWithNoticiaData(id) {
  fetch(`${API_URL}/noticias/${id}`)
    .then((response) => response.json())
    .then((item) => {
      document.getElementById("inputId").value = item.id;
      document.getElementById("inputTitulo").value = item.titulo;
      document.getElementById("inputSubtitulo").value = item.subtitulo || "";
      document.getElementById("inputTexto").value = item.texto || "";
      document.getElementById("inputPath").value = item.imagem[0].path || "";
      document.getElementById("inputAlt").value = item.imagem[0].alt || "";
      document.getElementById("inputCategoria").value = item.categoria || ""; // <-- ADICIONADO
      document.getElementById("selectTipo").value = "noticias";

      document.getElementById("formNoticia").scrollIntoView({ behavior: "smooth" });
    })
    .catch((error) => {
      console.error("Erro ao buscar notícia:", error);
      displayMessage("Erro ao carregar os dados da notícia", "danger");
    });
}

// Função para criar uma nova notícia
async function createNoticia() {
  const tipo = document.getElementById("selectTipo").value;
  if (tipo === "") {
    displayMessage("Selecione o tipo de notícia", "warning");
    return;
  }

  const endpoint = tipo === "carrousel" ? "carrouselData" : "noticias";
  const data = await fetchData(endpoint);
  const newId = (data.length + 1).toString();

  const novaNoticia = {
    id: newId,
    titulo: document.getElementById("inputTitulo").value,
    subtitulo: document.getElementById("inputSubtitulo").value,
    texto: document.getElementById("inputTexto").value,
    imagem: [
      {
        path: document.getElementById("inputPath").value,
        alt: document.getElementById("inputAlt").value,
      },
    ],
  };

  if (tipo === "noticias") {
    novaNoticia.categoria = document.getElementById("inputCategoria").value; // <-- ADICIONADO
  }

  // Remove campos vazios para carrossel
  if (tipo === "carrousel") {
    delete novaNoticia.texto;
    if (!novaNoticia.subtitulo) delete novaNoticia.subtitulo;
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaNoticia),
    });

    if (!response.ok) throw new Error("Erro na criação");

    displayMessage("Notícia criada com sucesso!", "success");
    document.getElementById("formNoticia").reset();

    if (tipo === "carrousel") {
      await loadCarrouselData();
    } else {
      await loadNoticiasData();
    }
  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    displayMessage("Erro ao criar notícia", "danger");
  }
}

// Função para atualizar uma notícia
async function updateNoticia() {
  const id = document.getElementById("inputId").value;
  if (!id) {
    displayMessage("Selecione uma notícia para alterar", "warning");
    return;
  }

  const tipo = document.getElementById("selectTipo").value;
  const endpoint = tipo === "carrousel" ? "carrouselData" : "noticias";

  const noticiaAtualizada = {
    id: id,
    titulo: document.getElementById("inputTitulo").value,
    subtitulo: document.getElementById("inputSubtitulo").value,
    texto: document.getElementById("inputTexto").value,
    imagem: [
      {
        path: document.getElementById("inputPath").value,
        alt: document.getElementById("inputAlt").value,
      },
    ],
  };

  if (tipo === "noticias") {
    noticiaAtualizada.categoria = document.getElementById("inputCategoria").value; // <-- ADICIONADO
  }

  if (tipo === "carrousel") {
    delete noticiaAtualizada.texto;
    if (!noticiaAtualizada.subtitulo) delete noticiaAtualizada.subtitulo;
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticiaAtualizada),
    });

    if (!response.ok) throw new Error("Erro na atualização");

    displayMessage("Notícia atualizada com sucesso!", "success");
    document.getElementById("formNoticia").reset();

    if (tipo === "carrousel") {
      await loadCarrouselData();
    } else {
      await loadNoticiasData();
    }
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    displayMessage("Erro ao atualizar notícia", "danger");
  }
}

// Função para deletar uma notícia e reordenar os IDs
async function deleteNoticia() {
  const id = document.getElementById("inputId").value;
  if (!id) {
    displayMessage("Selecione uma notícia para excluir", "warning");
    return;
  }

  const tipo = document.getElementById("selectTipo").value;
  const endpoint = tipo === "carrousel" ? "carrouselData" : "noticias";

  if (!confirm(`Tem certeza que deseja excluir a notícia ${id}? Os IDs serão reordenados.`)) return;

  try {
    const deleteResponse = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) throw new Error("Erro na exclusão");

    const reorderSuccess = await reorderIds(endpoint);

    if (!reorderSuccess) throw new Error("Erro ao reordenar IDs");

    displayMessage("Notícia excluída e IDs reordenados com sucesso!", "success");
    document.getElementById("formNoticia").reset();

    if (tipo === "carrousel") {
      await loadCarrouselData();
    } else {
      await loadNoticiasData();
    }
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    displayMessage("Erro ao excluir notícia", "danger");
  }
}

// Inicialização da aplicação
function init() {
  loadCarrouselData();
  loadNoticiasData();

  document.getElementById("btnInsert").addEventListener("click", createNoticia);
  document.getElementById("btnUpdate").addEventListener("click", updateNoticia);
  document.getElementById("btnDelete").addEventListener("click", deleteNoticia);
  document.getElementById("btnClear").addEventListener("click", () => {
    document.getElementById("formNoticia").reset();
  });
}





