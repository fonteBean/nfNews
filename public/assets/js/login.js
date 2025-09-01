const ENDPOINT = "http://localhost:3000/usuarios"





async function carregarUsuarios() {
  const resposta = await fetch('http://localhost:3000/usuarios');
  const dados = await resposta.json();
  return dados; 
}




function checkLogin(){
  const usuarioStr = sessionStorage.getItem("usuario");
  
  if(!usuarioStr){
    location.href ="login.html"
    return false; 
  }

  const usuario = JSON.parse(usuarioStr); 
  
  const dados = carregarUsuarios();
  const resposta = dados.find(Element => Element.usuario.nome === usuario.usuario.nome); 


  if (!resposta) {
    location.href = "login.html"; 
    return false;
  }

  return true;
}

function processaLogin(dados ,nome, senha) {
   const resposta = dados.find(Element => Element.nome === nome && Element.senha === senha);
   if(resposta){
  const usuarioLogado = { nome: nome, senha: senha };
  sessionStorage.setItem("usuario", JSON.stringify(usuarioLogado));
    location.href = "index.html";

   }else{
    alert("Login ou senha incorretos");
   }

}

function criarUsuario(nome,email,senha){
      const dados = {
      nome: nome,
      email: email,
      senha: senha,
      admin: null,
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados), 
    })
      .then((response) => response.json())
        .then((data) => {
        alert("Cadastro realizado");
        
       
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
      location.href= "login.html"

    
}

