// migrations/20250901_create_initial_tables.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // Tabela de Usuários
    .createTable('usuarios', function (table) {
      table.increments('id').primary();
      table.string('nome', 255).notNullable();
      table.string('email', 255).notNullable();
      table.string('senha', 255).notNullable();
      table.boolean('admin').defaultTo(false);
      table.timestamps(true, true);
    })
    // Tabela de Notícias
    .createTable('noticias', function (table) {
      table.increments('id').primary();
      table.string('titulo', 255).notNullable();
      table.string('subtitulo', 255);
      table.text('texto', 'longtext').notNullable();
      table.text('imagem_path', 'longtext').notNullable();
      table.string('imagem_alt', 255).notNullable();
      table.string('categoria', 100).notNullable();
      table.timestamps(true, true);
    })
    // Tabela do Carrossel
    .createTable('carrosel', function (table) {
      table.increments('id').primary();
      table.string('titulo', 255).notNullable();
      table.text('subtitulo').notNullable();
      table.text('imagem_path', 'longtext').notNullable();
      table.string('imagem_alt', 255).notNullable();
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('carrosel')
    .dropTable('noticias')
    .dropTable('usuarios');
};