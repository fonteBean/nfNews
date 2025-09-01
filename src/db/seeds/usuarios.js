/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {

  await knex('usuarios').del();
  
    await knex('usuarios').insert([
    { id: 1, nome: 'Amanda', email: 'amandas3324@gmail.com', senha: 'meuamo', admin: false },
    { id: 2, nome: 'Nicolas', email: 'n9ckbean@gmail.com', senha: 'nico1', admin: false },
    { id: 3, nome: 'Carlo', email: 'carleto@hotmail.com', senha: '0102', admin: false },
  ]);
};
