// rota caminho atual
const route = "/professor/";

// verificar o id do elemento atual
let actualId = undefined;

// instanciar a tabela
const table = document.getElementById("tableBody");

// método responsável por criar uma linha na tabela
async function createLine(professor) {
  let linha = document.createElement("tr");

  let colunaNome = document.createElement("td");
  colunaNome.textContent = professor.name;
  linha.appendChild(colunaNome);

  let colunaCPF = document.createElement("td");
  colunaCPF.textContent = professor.cpf;
  linha.appendChild(colunaCPF);

  let colunaProfessor = document.createElement("td");
  colunaProfessor.textContent = professor.departament.name;
  linha.appendChild(colunaProfessor);


  let colunaEdit = document.createElement("td");
  let btnEdit = document.createElement("button");
  btnEdit.textContent = "Editar";
  btnEdit.classList.add("btn");
  btnEdit.classList.add("btn-info");

  btnEdit.addEventListener("click", () => btnUpdate_click(professor));

  colunaEdit.appendChild(btnEdit);
  linha.appendChild(colunaEdit);

  let colunaDelete = document.createElement("td");
  let btnDelete = document.createElement("button");
  btnDelete.textContent = "Excluir";
  btnDelete.classList.add("btn");
  btnDelete.classList.add("btn-danger");

  btnDelete.addEventListener("click", () => btnDelete_click(professor));

  colunaDelete.appendChild(btnDelete);
  linha.appendChild(colunaDelete);

  table.appendChild(linha);
}

// método responsável por recarregar a tabela
async function refreshTable() {
  // o InnerHTML é contém todos os elementos internos do elemento
  // em questão, no nosso caso, estamos limpando tudo que há nele
  table.innerHTML = "";

  loadTable();
}

// método responsável por carregar a tabela
async function loadTable() {
  const listData = await list(route);

  for (const item of listData) {
    createLine(item);
  }
}

// evento disparado quando aperta em adicionar novo elemento
function btnAdd_click() {
  document.getElementById("txtName").value = "";
  document.getElementById("txtCPF").value = "";
  document.getElementById("selectDepartamento").value = "0";
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Criar professor";
  actualId = undefined;
}

// evento disparado quando aperta em editar um elemento
function btnUpdate_click(professor) {
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Atualizar professor";

  document.getElementById("txtName").value = professor.name;
  document.getElementById("txtCPF").value = professor.cpf;
  document.getElementById("selectDepartamento").value = professor.departament.id;
  actualId = professor.id;
  $("#modalCreate").modal();
}

// evento disparado quando aperta em remover um elemento
function btnDelete_click(professor) {
  actualId = professor.id;

  const txtProfessor = document.getElementById("txtRemoveName");
  txtProfessor.textContent = professor.name;

  $("#modalDelete").modal();
}

// evento disparado ao confirmar a criação do novo elemento
async function applyAddDepartament() {
  const name = document.getElementById("txtName").value;
  const cpf = document.getElementById("txtCPF").value;
  const idDepartamento = document.getElementById("selectDepartamento").value;

  let result;
  if (!name || !cpf || !idDepartamento || idDepartamento === '0') {
    alert("Todos são obrigatórios!");
    return;
  }

  const data = {
    name,
    cpf,
    departament: {
      id: idDepartamento
    }
  }

  if (!actualId) {
    result = await create(route, data);
  } else {
    result = await update(route + actualId, data);
  }

  if (result) {
    refreshTable();
  }
}

// evento disparado ao confirmar a remoção do elemento
async function applyRemoveDepartament() {
  const result = await deleteData(route + actualId);

  if (result) {
    refreshTable();
  }
}

// pegando o botao de adicionar e informando seu evento
const btnAdd = document.getElementById("btnAdd");
btnAdd.addEventListener("click", btnAdd_click);

// pegando o botao de confirmar a adicao e informando seu evento
const confirmSave = document.getElementById("btnModalCreate");
confirmSave.addEventListener("click", applyAddDepartament);

// pegando o botao de confirmar a remocao e informando seu evento
const confirmDelete = document.getElementById("btnModalDelete");
confirmDelete.addEventListener("click", applyRemoveDepartament);

async function loadSelectDepartamento() {
  const routeDepartament = '/departament';
  const departamentos = await list(routeDepartament);

  const selectDepartamentos = document.getElementById("selectDepartamento");

  for(let item of departamentos){
    const opcao = document.createElement("option");
    opcao.value = item.id;
    opcao.textContent = item.name;

    selectDepartamentos.appendChild(opcao);
  }
}

loadSelectDepartamento();

// chamando o método de carregar a tabela para exibir na tela
loadTable();
