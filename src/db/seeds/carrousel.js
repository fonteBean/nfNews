
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {

  await knex('carrosel').del();
  
  await knex('carrosel').insert([
    {
      id: 1,
      titulo: 'Imperatriz de Olaria',
      subtitulo: 'A Escola de Samba Imperatriz de Olaria brilhou intensamente e foi consagrada campeã do Carnaval de Nova Friburgo 2025.',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk...AgCAID/9k=',
      imagem_alt: 'Imperatriz de Olaria'
    },
    {
      id: 2,
      titulo: 'Crise em Lumiar',
      subtitulo: 'Ervas raras desaparecem e moradores entram em pânico no distrito mais zen de Friburgo.',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk.../2Q==',
      imagem_alt: 'Lumiar'
    },
    {
      id: 3,
      titulo: 'Acidente na Via Expressa gera vítimas',
      subtitulo: 'Motorista morre após colisão em mureta na Via Expressa no Cônego.',
      imagem_path: 'data:image/jpeg;base64,/9j/4AAQSk.../2Q==',
      imagem_alt: 'Acidente na via expressa'
    }
  ]);
};