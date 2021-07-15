// rota caminho atual
const route = "/departament/";

// verificar o id do elemento atual
let actualId = undefined;

// instanciar a tabela
const table = document.getElementById("tableBody");

// método responsável por criar uma linha na tabela
async function createLine(dep) {
  let linha = document.createElement("tr");

  let colunaNome = document.createElement("td");
  colunaNome.textContent = dep.name;
  linha.appendChild(colunaNome);

  let colunaEdit = document.createElement("td");
  let btnEdit = document.createElement("button");
  btnEdit.textContent = "Editar";
  btnEdit.classList.add("btn");
  btnEdit.classList.add("btn-info");

  btnEdit.addEventListener("click", () => btnUpdate_click(dep));

  colunaEdit.appendChild(btnEdit);
  linha.appendChild(colunaEdit);

  let colunaDelete = document.createElement("td");
  let btnDelete = document.createElement("button");
  btnDelete.textContent = "Excluir";
  btnDelete.classList.add("btn");
  btnDelete.classList.add("btn-danger");

  btnDelete.addEventListener("click", () => btnDelete_click(dep));

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
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Criar departamento";
  actualId = undefined;
}

// evento disparado quando aperta em editar um elemento
function btnUpdate_click(dep) {
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Atualizar departamento";

  document.getElementById("txtName").value = dep.name;
  actualId = dep.id;
  $("#modalCreate").modal();
}

// evento disparado quando aperta em remover um elemento
function btnDelete_click(dep) {
  actualId = dep.id;

  const txtDepartamento = document.getElementById("txtRemoveName");
  txtDepartamento.textContent = dep.name;

  $("#modalDelete").modal();
}

// evento disparado ao confirmar a criação do novo elemento
async function applyAddDepartament() {
  const name = document.getElementById("txtName").value;
  let result;
  if (!name) {
    alert("O nome é obrigatório!");
    return;
  }

  if (!actualId) {
    result = await create(route, { name });
  } else {
    result = await update(route + actualId, { name });
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

// chamando o método de carregar a tabela para exibir na tela
loadTable();
