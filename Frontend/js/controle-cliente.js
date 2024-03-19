const URL = 'http://localhost:3400/clientes'

let listaClientes = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaCliente = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById('modal-cliente'));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    email: document.querySelector("#email"),
    telefone: document.querySelector("#telefone"),
    cpf: document.querySelector("#cpf"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () =>{
    limparModalCliente();
    modalCliente.show();
});

function obterClientes() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(clientes => {
        listaClientes = clientes;
        popularTabela(clientes);
    })
    .catch((erro) => {});
}

obterClientes();

function popularTabela(clientes){

    tabelaCliente.textContent = '';

    clientes.forEach(cliente => { 
        criarLinhaNaTabela(cliente);
    });
}

function criarLinhaNaTabela(cliente){

    let tr  = document.createElement('tr');

    let  tdId = document.createElement('td');
    let  tdNome = document.createElement('td');
    let  tdCPF = document.createElement('td');
    let  tdEmail = document.createElement('td');
    let  tdTelefone = document.createElement('td');
    let  tdDataCadastro = document.createElement('td');
    let  tdAcoes = document.createElement('td');

    tdId.textContent = cliente.id
    tdNome.textContent = cliente.nome;
    tdCPF.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdTelefone.textContent = cliente.telefone;
    tdDataCadastro.textContent = new Date(cliente.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdCPF);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaCliente.appendChild(tr);
}


formModal.btnSalvar.addEventListener('click', () => {

    let cliente = obterClienteDoModal();


    if(!cliente.validar()){
        alert("E-mail e CPF são obrigatórios.");
        return;
    }

    adicionarClienteNoBackend(cliente);
});


function obterClienteDoModal(){
    return new Cliente({
        id: formModal.id.value,
        email: formModal.email.value,
        nome: formModal.nome.value,
        cpfOuCnpj: formModal.cpf.value,
        telefone: formModal.telefone.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarClienteNoBackend(cliente){

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(response => {
        let novoCliente = new Cliente(response);
        listaClientes.push(novoCliente);

        popularTabela(listaClientes);

        // Fechar modal
        
        modalCliente.hide();

        // Mandar mensagem de cliente cadastrado com sucesso!
        alert(`Cliente ${cliente.nome}, foi cadastrado com sucesso!`)
    })
}

function limparModalCliente(){
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.cpf.value = '';
    formModal.email.value = '';
    formModal.telefone.value = '';
    formModal.dataCadastro.value = '';

} 
function excluirCliente(id){
    let cliente = listaClientes.find(cliente => cliente.id == id);

    if(confirm("Deseja realmente excluir o cliente " + cliente.nome)){
        excluirCienteNoBackEnd(id);
    }
}

function excluirCienteNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerClienteDaLista(id);
        popularTabela(listaClientes);
    })
}

function removerClienteDaLista(id){
    let indice = listaClientes.findIndex(cliente => cliente.id == id);

    listaClientes.splice(indice, 1);
}