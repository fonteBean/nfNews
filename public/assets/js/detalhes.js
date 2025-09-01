document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');


  const apiUrl = `http://localhost:3000/noticias/${id}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Notícia não encontrada');
      }
      return response.json();
    })
    .then(noticia => {
      const tituloEl = document.querySelector('.titulo');
      const contentEl = document.querySelector('#content');
      const imageEl = document.querySelector('#image-about');

      if (tituloEl && contentEl && imageEl && noticia) {
        tituloEl.textContent = noticia.titulo;
        contentEl.innerHTML = noticia.texto;
        imageEl.src = noticia.imagem[0].path;
        imageEl.alt = noticia.imagem[0].alt;
        imageEl.style.display = 'block';
      }
    })
    .catch(error => {
      console.error(error);
      const tituloEl = document.querySelector('.titulo');
      const contentEl = document.querySelector('#content');
      const imageEl = document.querySelector('#image-about');

      if (tituloEl) tituloEl.textContent = 'Notícia não encontrada';
      if (contentEl) contentEl.textContent = 'Desculpe, não encontramos a notícia que você procurava.';
      if (imageEl) imageEl.style.display = 'none';
    });
});
