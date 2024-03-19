const EMAIL = "admin@admin.com";
const SENHA = '123456';

let campoEmail = document.querySelector("#email");
let campoSenha = document.querySelector('#senha');
let btnEntrar = document.getElementById(`btn-entrar`);

btnEntrar.addEventListener("click", () => {
    // Capiturando os valores digitados pelo usuario
    let emailDigitado = campoEmail.value.toLowerCase();
    let senhaDigitada = campoSenha.value;

    autenticar(emailDigitado, senhaDigitada);
});


function autenticar (email, senha){

    //1° Preciso saber qual a URL da API
    const URL = 'http://localhost:3400/login';

    //2° Criar um request para a api
    fetch(URL, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha})
    })
    //3° Se der certo, direcionar para a tela de home
    .then(response => response = response.json())
    .then(response => {
        console.log(response)

        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }


        // Aqui salvo o token e o usuario na storage
        salvarToken(response.token);
        salvarUsuario(response.usuario);

        window.open("home.html", "_self");
    })
    //4° Se der errado, mandar mensagem para o usuario.
    .catch(erro => {
        console.log(erro)
    })    
}
