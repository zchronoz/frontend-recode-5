// rota caminho atual
const route = "/allocation/";
const daysofWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

// verificar o id do elemento atual
let actualId = undefined;

// instanciar a tabela
const table = document.getElementById("tableBody");

// método responsável por criar uma linha na tabela
async function createLine(allocation) {
  let linha = document.createElement("tr");

  let colunaProfessor = document.createElement("td");
  colunaProfessor.textContent = allocation.professor.name;
  linha.appendChild(colunaProfessor);

  let colunaDepartamento = document.createElement("td");
  colunaDepartamento.textContent = allocation.professor.departament.name;
  linha.appendChild(colunaDepartamento);

  let colunaCurso = document.createElement("td");
  colunaCurso.textContent = allocation.course.name;
  linha.appendChild(colunaCurso);

  let colunaDiaSemana = document.createElement("td");
  colunaDiaSemana.textContent = allocation.dayOfWeek;
  linha.appendChild(colunaDiaSemana);

  const infoHorario = `${allocation.startHour}:00 - ${allocation.endHour}:00`
  let colunaHorario = document.createElement("td");
  colunaHorario.textContent = infoHorario;
  linha.appendChild(colunaHorario);

  let colunaEdit = document.createElement("td");
  let btnEdit = document.createElement("button");
  btnEdit.textContent = "Editar";
  btnEdit.classList.add("btn");
  btnEdit.classList.add("btn-info");

  btnEdit.addEventListener("click", () => btnUpdate_click(allocation));

  colunaEdit.appendChild(btnEdit);
  linha.appendChild(colunaEdit);

  let colunaDelete = document.createElement("td");
  let btnDelete = document.createElement("button");
  btnDelete.textContent = "Excluir";
  btnDelete.classList.add("btn");
  btnDelete.classList.add("btn-danger");

  btnDelete.addEventListener("click", () => btnDelete_click(allocation));

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


  if(listData?.length){
    $('table').attr('hidden', false);
  } else {
    $('#showNotData').attr('hidden', false);
  }

  for (const item of listData) {
    createLine(item);
  }
}

// evento disparado quando aperta em adicionar novo elemento
function btnAdd_click() {
  document.getElementById("selectProfessor").value = "0";
  document.getElementById("selectCurso").value = "0";
  document.getElementById("selectDiaSemana").value = "0";
  document.getElementById("selectStartHour").value = "0";
  document.getElementById("selectEndHour").value = "0";
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Criar aloção";
  actualId = undefined;
}

// evento disparado quando aperta em editar um elemento
function btnUpdate_click(allocation) {
  const title = document.getElementById("mdCreateTitle");
  title.textContent = "Atualizar aloção";

  document.getElementById("selectProfessor").value = allocation.professor.id;
  document.getElementById("selectCurso").value = allocation.course.id;
  document.getElementById("selectDiaSemana").value = allocation.dayOfWeek;
  document.getElementById("selectStartHour").value = allocation.startHour;
  document.getElementById("selectEndHour").value = allocation.endHour;

  actualId = allocation.id;
  $("#modalCreate").modal();
}

// evento disparado quando aperta em remover um elemento
function btnDelete_click(allocation) {
  actualId = allocation.id;

  const txtDepartamento = document.getElementById("txtRemoveName");
  txtDepartamento.textContent = `${allocation.professor.name} - ${allocation.course.name}`;

  $("#modalDelete").modal();
}

// evento disparado ao confirmar a criação do novo elemento
async function applyAddDepartament() {
  const professor = document.getElementById("selectProfessor").value;
  const curso = document.getElementById("selectCurso").value;
  const dia = document.getElementById("selectDiaSemana").value;
  const horaInicial = document.getElementById("selectStartHour").value;
  const horaFinal = document.getElementById("selectEndHour").value;


  let result;
  if (!professor || !curso || !dia || !horaInicial || !horaFinal) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  const data = {
    dayOfWeek: dia,
    startHour: horaInicial,
    endHour: horaFinal,
    professor: {
      id: professor
    },
    course: {
      id: curso
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

async function loadSelectProfessor(){
  const rounteProfessor = '/professor';
  const professores = await list(rounteProfessor);

  const select = document.getElementById('selectProfessor');

  for(let item of professores){
    let opcao = document.createElement('option');
    opcao.value = item.id;
    opcao.textContent = item.name;
    select.appendChild(opcao);
  }
}
loadSelectProfessor();

async function loadSelectCurso(){
  const routeCurso = '/course';
  const cursos = await list(routeCurso);

  const select = document.getElementById('selectCurso');

  for(let item of cursos){
    let opcao = document.createElement('option');
    opcao.value = item.id;
    opcao.textContent = item.name;
    select.appendChild(opcao);
  }
}
loadSelectCurso();

function loadSelectsDayHour(){
  const selectDay = document.getElementById('selectDiaSemana');
  const selectStartDate = document.getElementById('selectStartHour');
  const selectEndDate = document.getElementById('selectEndHour');

  for(let dia of daysofWeek){
    let opcao = document.createElement('option');
    opcao.value = dia;
    opcao.textContent = dia;
    selectDay.appendChild(opcao);
  }

  for(let hora of hours){
    let opcaoStart = document.createElement('option');
    opcaoStart.value = hora;
    opcaoStart.textContent = hora;
    selectStartDate.appendChild(opcaoStart);

    let opcaoEnd = document.createElement('option');
    opcaoEnd.value = hora;
    opcaoEnd.textContent = hora;
    selectEndDate.appendChild(opcaoEnd);
  }
}
loadSelectsDayHour();

// chamando o método de carregar a tabela para exibir na tela
loadTable();


function formatDataToApi(hour){
  let data = new Date();
  const ano = data.getFullYear();
  const mes = data.getMonth() + 1;
  const dia = data.getDate();

  return new Date(`${ano}-${mes}-${dia} ${hour.padStart(2, '0')}:00`)
}