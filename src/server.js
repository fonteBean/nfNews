require('dotenv').config();

const PORT = process.env.API_PORT;

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()=>{
  console.log(`Servidor rodando na porta: ${PORT}`);
})