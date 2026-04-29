const API = "http://localhost:3000";

// Crear usuario
async function crearUsuario() {
  const name = document.getElementById("userName").value;

  if (!name.trim()) {
    alert("El nombre no puede estar vacío");
    return;
  }

  await fetch(API + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  cargarUsuarios();
}

// Cargar usuarios
async function cargarUsuarios() {
  const res = await fetch(API + "/users");
  const data = await res.json();

  const lista = document.getElementById("listaUsuarios");
  const selector = document.getElementById("userId");
  lista.innerHTML = "";
  selector.innerHTML = '<option value="">Seleccione un usuario</option>';

  data.forEach(u => {
    lista.innerHTML += `<li>${u.id} - ${u.name}</li>`;
    selector.innerHTML += `<option value="${u.id}">${u.name}</option>`;
  });
}

// Crear tarea
async function crearTarea() {
  const title = document.getElementById("taskTitle").value;
  const user_id = document.getElementById("userId").value;

  if (!title.trim() || !user_id) {
    alert("El título y el usuario son obligatorios");
    return;
  }
  await fetch(API + "/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, user_id })
  });
  cargarTareas();
}

// Cargar tareas
async function cargarTareas() {
  const res = await fetch(API + "/tasks");
  const data = await res.json();

  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";

  data.forEach(t => {
    lista.innerHTML += `
      <li>
        ${t.title} - ${t.name}
        <button onclick="editarTarea(${t.id})">Editar</button>
      </li>
    `;
  });
}

// Editar tarea
async function editarTarea(id) {
  const nuevoTitulo = prompt("Ingrese la nueva tarea:");
  if (!nuevoTitulo || !nuevoTitulo.trim()) return;

  await fetch(API + "/tasks/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: nuevoTitulo })
  });

  cargarTareas();
}

cargarUsuarios();
cargarTareas();
