// Archivo: app.js
// Descripción: Lógica de la aplicación para gestionar Categorías, Carreras y Estudiantes.
// Fecha: 2025-06-22

const API_BASE_URL = "http://localhost:5001/api";
const API_KEY = "12345ABCDEF";
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// ============================
// CRUD Categorías
// ============================
async function createCategoryService(name, description) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear categoría");
    return data;
}

async function getCategoryService(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: "GET", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Categoría no encontrada");
    return data;
}

async function deleteCategoryService(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar categoría");
    return data;
}

async function listCategoriesService() {
    const res = await fetch(`${API_BASE_URL}/categories`, { method: "GET", headers });
    if (!res.ok) throw new Error("Error al listar categorías");
    return res.json();
}

function setupCreateCategory() {
    document.getElementById('formCreateCategory').addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('categoryName').value.trim();
        const description = document.getElementById('categoryDescription').value.trim();
        if (!name) return Swal.fire('Error','El nombre es obligatorio','error');
        try {
            await createCategoryService(name, description);
            Swal.fire('¡Creada!','Categoría registrada','success');
            e.target.reset();
            loadAndRenderCategoriesTable();
            // refrescar dropdowns de carreras
            loadCategoriesDropdownForCareer();
        } catch (err) {
            Swal.fire('Error', err.message,'error');
        }
    });
}

function setupGetCategory() {
    const form = document.getElementById('formGetCategory');
    const pre = document.getElementById('getCategoryResult');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        pre.textContent = "";
        const id = form.elements['getCategoryId'].value.trim();
        if (!id) return pre.textContent = "Ingresa un ID válido.";
        try {
            const cat = await getCategoryService(id);
            pre.innerHTML = `
<div class="result-card">
  <h4>Categoría</h4>
  <p><strong>ID:</strong> ${cat.id}</p>
  <p><strong>Nombre:</strong> ${cat.name}</p>
  <p><strong>Descripción:</strong> ${cat.description || '-'}</p>
</div>`;
        } catch (err) {
            pre.textContent = err.message;
        }
    });
}

function setupDeleteCategory() {
    document.getElementById('formDeleteCategory').addEventListener('submit', async e => {
        e.preventDefault();
        const id = document.getElementById('deleteCategoryId').value.trim();
        if (!id) return Swal.fire('Error','ID inválido','error');
        const c = await Swal.fire({
            title: '¿Eliminar?',
            text: `Categoría ID: ${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        });
        if (c.isConfirmed) {
            try {
                await deleteCategoryService(id);
                Swal.fire('Eliminada','Categoría eliminada','success');
                e.target.reset();
                loadAndRenderCategoriesTable();
                loadCategoriesDropdownForCareer();
            } catch (err) {
                Swal.fire('Error', err.message,'error');
            }
        }
    });
}

async function loadAndRenderCategoriesTable() {
    try {
        const cats = await listCategoriesService();
        const tbody = document.querySelector('#categoriesTable tbody');
        tbody.innerHTML = '';
        cats.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.description||''}</td>
                <td>
                  <button class="btn btn-danger btn-sm btn-del-cat" data-id="${c.id}">
                    Eliminar
                  </button>
                </td>`;
            tbody.appendChild(tr);
        });
        document.querySelectorAll('.btn-del-cat').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const ok = await Swal.fire({
                    title:'¿Eliminar?',
                    text:`ID ${id}`,
                    icon:'warning',
                    showCancelButton:true,
                    confirmButtonText:'Sí'
                });
                if (!ok.isConfirmed) return;
                await deleteCategoryService(id);
                Swal.fire('Hecho','Eliminada','success');
                loadAndRenderCategoriesTable();
                loadCategoriesDropdownForCareer();
            };
        });
    } catch (err) {
        console.error(err);
    }
}

// ============================
// CRUD Carreras
// ============================
async function createCareerService(name, category) {
    const res = await fetch(`${API_BASE_URL}/careers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, category })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear carrera");
    return data;
}

async function getCareerService(id) {
    const res = await fetch(`${API_BASE_URL}/careers/${id}`, { method:"GET", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Carrera no encontrada");
    return data;
}

async function deleteCareerService(id) {
    const res = await fetch(`${API_BASE_URL}/careers/${id}`, { method:"DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar carrera");
    return data;
}

async function listCareersService() {
    const res = await fetch(`${API_BASE_URL}/careers`, { method:"GET", headers });
    if (!res.ok) throw new Error("Error al listar carreras");
    return res.json();
}

function setupCreateCareer() {
    const form = document.getElementById('formCreateCareer');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('careerName').value.trim();
        const category = document.getElementById('careerCategorySelect').value;
        if (!name||!category) return Swal.fire('Error','Completa todos los campos','error');
        try {
            await createCareerService(name, category);
            Swal.fire('¡Creada!','Carrera registrada','success');
            form.reset();
            loadAndRenderCareersTable();
        } catch (err) {
            Swal.fire('Error', err.message,'error');
        }
    });
}

function setupGetCareer() {
    const form = document.getElementById('formGetCareer');
    const pre = document.getElementById('getCareerResult');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        pre.textContent = "";
        const id = form.elements['getCareerId'].value.trim();
        if (!id) return pre.textContent="ID inválido";
        try {
            const c = await getCareerService(id);
            pre.innerHTML = `
<div class="result-card">
  <h4>Carrera</h4>
  <p><strong>ID:</strong> ${c.id}</p>
  <p><strong>Nombre:</strong> ${c.name}</p>
  <p><strong>Categoría:</strong> ${c.category}</p>
</div>`;
        } catch (err) {
            pre.textContent = err.message;
        }
    });
}

function setupDeleteCareer() {
    const form = document.getElementById('formDeleteCareer');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const id = form.elements['deleteCareerId'].value.trim();
        if (!id) return Swal.fire('Error','ID inválido','error');
        const ok = await Swal.fire({
            title:'¿Eliminar?',
            text:`Carrera ID: ${id}`,
            icon:'warning',
            showCancelButton:true,
            confirmButtonText:'Sí'
        });
        if (!ok.isConfirmed) return;
        try {
            await deleteCareerService(id);
            Swal.fire('Hecho','Carrera eliminada','success');
            form.reset();
            loadAndRenderCareersTable();
        } catch(err) {
            Swal.fire('Error', err.message,'error');
        }
    });
}

async function loadCategoriesDropdownForCareer() {
    const sel = document.getElementById('careerCategorySelect');
    sel.innerHTML = `<option value="">Selecciona una categoría</option>`;
    const cats = await listCategoriesService();
    cats.forEach(c => {
        sel.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
}

async function loadAndRenderCareersTable() {
    try {
        const careers = await listCareersService();
        const tbody = document.querySelector('#careersTable tbody');
        tbody.innerHTML = '';
        careers.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.category||''}</td>
                <td>
                  <button class="btn btn-danger btn-sm btn-del-career" data-id="${c.id}">
                    Eliminar
                  </button>
                </td>`;
            tbody.appendChild(tr);
        });
        document.querySelectorAll('.btn-del-career').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const ok = await Swal.fire({
                    title:'¿Eliminar?',
                    text:`ID ${id}`,
                    icon:'warning',
                    showCancelButton:true,
                    confirmButtonText:'Sí'
                });
                if (!ok.isConfirmed) return;
                await deleteCareerService(id);
                Swal.fire('Hecho','Carrera eliminada','success');
                loadAndRenderCareersTable();
            };
        });
    } catch (err) {
        console.error(err);
    }
}

// ============================
// CRUD Estudiantes
// ============================
async function createStudentService(name, career) {
    const res = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, career })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear estudiante");
    return data;
}

async function getStudentService(id) {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method:"GET", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Estudiante no encontrado");
    return data;
}

async function deleteStudentService(id) {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, { method:"DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al eliminar estudiante");
    return data;
}

async function getStudentsByCareerService(career) {
    const res = await fetch(`${API_BASE_URL}/students?career=${encodeURIComponent(career)}`, { method:"GET", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al filtrar estudiantes");
    return data;
}

function setupCreateStudent() {
    const form = document.getElementById('formCreateStudent');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('studentName').value.trim();
        const career = document.getElementById('studentCareerSelect').value;
        if (!name||!career) return Swal.fire('Error','Completa todos los campos','error');
        try {
            await createStudentService(name, career);
            Swal.fire('¡Registrado!','Estudiante creado','success');
            form.reset();
            loadAndRenderStudentsTable(career);
        } catch(err) {
            Swal.fire('Error', err.message,'error');
        }
    });
}

function setupGetStudent() {
    const form = document.getElementById('formGetStudent');
    const pre = document.getElementById('getStudentResult');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        pre.textContent = "";
        const id = form.elements['getStudentId'].value.trim();
        if (!id) return pre.textContent="ID inválido";
        try {
            const s = await getStudentService(id);
            pre.innerHTML = `
<div class="result-card">
  <h4>Estudiante</h4>
  <p><strong>ID:</strong> ${s.id}</p>
  <p><strong>Nombre:</strong> ${s.name}</p>
  <p><strong>Carrera:</strong> ${s.career}</p>
</div>`;
        } catch(err) {
            pre.textContent = err.message;
        }
    });
}

function setupDeleteStudent() {
    const form = document.getElementById('formDeleteStudent');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const id = form.elements['deleteStudentId'].value.trim();
        if (!id) return Swal.fire('Error','ID inválido','error');
        const ok = await Swal.fire({
            title:'¿Eliminar?',
            text:`Estudiante ID: ${id}`,
            icon:'warning',
            showCancelButton:true,
            confirmButtonText:'Sí'
        });
        if (!ok.isConfirmed) return;
        try {
            await deleteStudentService(id);
            Swal.fire('Hecho','Estudiante eliminado','success');
            form.reset();
            // refrescar tabla si hay filtro activo
            const career = document.getElementById('filterCareerSelect').value;
            if (career) loadAndRenderStudentsTable(career);
        } catch(err) {
            Swal.fire('Error', err.message,'error');
        }
    });
}

async function loadCareersDropdownForStudents() {
    const sel1 = document.getElementById('studentCareerSelect');
    const sel2 = document.getElementById('filterCareerSelect');
    [sel1, sel2].forEach(sel => {
        sel.innerHTML = `<option value="">Selecciona una carrera</option>`;
    });
    const careers = await listCareersService();
    careers.forEach(c => {
        const opt = `<option value="${c.name}">${c.name}</option>`;
        sel1.innerHTML += opt;
        sel2.innerHTML += opt;
    });
}

async function loadAndRenderStudentsTable(career) {
    try {
        const list = await getStudentsByCareerService(career);
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';
        list.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.career}</td>
                <td>
                  <button class="btn btn-danger btn-sm btn-del-stu" data-id="${s.id}">
                    Eliminar
                  </button>
                </td>`;
            tbody.appendChild(tr);
        });
        document.querySelectorAll('.btn-del-stu').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const ok = await Swal.fire({
                    title:'¿Eliminar?',
                    text:`ID ${id}`,
                    icon:'warning',
                    showCancelButton:true,
                    confirmButtonText:'Sí'
                });
                if (!ok.isConfirmed) return;
                await deleteStudentService(id);
                Swal.fire('Hecho','Estudiante eliminado','success');
                loadAndRenderStudentsTable(career);
            };
        });
    } catch (err) {
        console.error(err);
    }
}

function setupFilterStudents() {
    document.getElementById('formFilterStudents').addEventListener('submit', async e => {
        e.preventDefault();
        const career = document.getElementById('filterCareerSelect').value;
        if (!career) return Swal.fire('Error','Selecciona una carrera','error');
        loadAndRenderStudentsTable(career);
    });
}

// ============================
// Inicialización al cargar la página
// ============================
document.addEventListener('DOMContentLoaded', () => {
    // Categorías
    if (document.getElementById('formCreateCategory')) {
        setupCreateCategory();
        setupGetCategory();
        setupDeleteCategory();
        loadAndRenderCategoriesTable();
    }

    // Carreras
    if (document.getElementById('formCreateCareer')) {
        setupCreateCareer();
        setupGetCareer();
        setupDeleteCareer();
        loadCategoriesDropdownForCareer();
        loadAndRenderCareersTable();
    }

    // Estudiantes
    if (document.getElementById('formCreateStudent')) {
        setupCreateStudent();
        setupGetStudent();
        setupDeleteStudent();
        setupFilterStudents();
        loadCareersDropdownForStudents();
    }
});

// ============================
// Resumen general de flujos
// - Categorías: POST/GET/DELETE /api/categories
// - Carreras:   POST/GET/DELETE /api/careers
// - Estudiantes:POST/GET/DELETE /api/students + filtro por carrera
// ============================
