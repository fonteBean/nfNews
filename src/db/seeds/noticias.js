
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('noticias').del();


  await knex('noticias').insert([
    {
      id: 1,
      titulo: 'Imperatriz de Olaria',
      subtitulo: 'Imperatiz é campêa do carnaval de nova friburgo!',
      texto: 'A Escola de Samba Imperatriz de Olaria brilhou intensamente e foi consagrada campeã do Carnaval de Nova Friburgo 2025...',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk...AgCAID/9k=',
      imagem_alt: 'Imperatriz de Olaria',
      categoria: 'Eventos'
    },
    {
      id: 2,
      titulo: 'Crise em Lumiar',
      subtitulo: '',
      texto: 'Nova Friburgo (RJ) — A paz, o incenso e a trilha do ukulele foram interrompidos por um drama que tem feito os moradores de Lumiar revirarem as sandálias...',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk.../2Q==',
      imagem_alt: 'Lumiar',
      categoria: 'Cidade'
    },
    {
      id: 3,
      titulo: 'Acidente na Via Expressa gera vítimas',
      subtitulo: '',
      texto: 'Nova Friburgo (RJ) — Um grave acidente foi registrado na manhã desta quinta-feira (10), na Via Expressa, no bairro Cônego...',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk.../2Q==',
      imagem_alt: 'Acidente na via expressa',
      categoria: 'Cidade'
    },
 
  ]);
};