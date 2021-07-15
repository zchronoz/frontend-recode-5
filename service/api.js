const baseUrl = "https://professor-allocation.herokuapp.com";

// GET - retorna uma lista
async function list(route) {
  const response = await fetch(baseUrl + route);
  return await response.json();
}

// POST - Cria um novo elemento
async function create(route, data) {
  const response = await fetch(baseUrl + route, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.log("houve um erro");
    return false;
  }

  return await response.json();
}

// PUT - Atualiza um elemento
async function update(route, data) {
  const response = await fetch(baseUrl + route, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.log("houve um erro");
    return false;
  }

  return true;
}

// DELETE - Deleta um elemento
async function deleteData(route) {
  const response = await fetch(baseUrl + route, {
    method: "DELETE",
  });

  if (!response.ok) {
    console.log("houve um erro");
    return false;
  }

  return true;
}
