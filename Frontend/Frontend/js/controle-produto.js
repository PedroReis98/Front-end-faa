const URL = 'http://localhost:3400/produtos'

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProdutos = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produtos'),);

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    observacao: document.querySelector("#observacao"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () =>{
    limparModalProduto();
    modalProduto.show();
});

function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos = produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos){

    tabelaProdutos.textContent = '';

    produtos.forEach(produto => { 
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){

    let tr  = document.createElement('tr');

    let  tdId = document.createElement('td');
    let  tdNome = document.createElement('td');
    let  tdValor = document.createElement('td');
    let  tdObservacao = document.createElement('td');
    let  tdquantidadeEstoque = document.createElement('td');
    let  tdDataCadastro = document.createElement('td');
    let  tdAcoes = document.createElement('td');

    tdId.textContent = produto.id
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdquantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`              
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdquantidadeEstoque);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProdutos.appendChild(tr);
}


formModal.btnSalvar.addEventListener('click', () => {

    let produtos = obterProdutoDoModal();


    if(!produtos.validar()){
        alert("Nome e quantiadades  são obrigatórios.");
        return;
    }

    adicionarProdutoNoBackend(produtos);
});


function obterProdutoDoModal(){
    return new Produto({
        id:formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto){

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos);

        // Fechar modal
        
        modalProduto.hide();

        // Mandar mensagem de cliente cadastrado com sucesso!
        alert(`Produto ${produto.id}, foi cadastrado com sucesso!`)
    })
}

function limparModalProduto(){
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.observacao.value = '';
    formModal.dataCadastro.value = '';

} 
function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id );

    if(confirm("Deseja realmente excluir o Produto " + produto.id )){
        excluiProdutoNoBackEnd(id);
    }
}

function excluiProdutoNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutosDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutosDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id  == id);

    listaProdutos.splice(indice, 1);
}