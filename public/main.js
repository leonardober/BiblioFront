const API_URL = 'http://localhost:3000/libros'; // 👈 correcto para pruebas locales
// const API_URL = 'https://api-libros-2023.onrender.com/libros'; // 👈 correcto para producción
let modoEdicion = false;
let isbnActual = '';

document.addEventListener('DOMContentLoaded', () => {
    obtenerLibros(); // carga inicial
});


document.getElementById('formLibro').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📤 Enviando libro...'); // 👈 prueba básica

  const nuevoLibro = {
    Isbn: document.getElementById('isbn').value,
    Titulo: document.getElementById('titulo').value,
    fechEdicion: document.getElementById('fechEdicion').value,
    numPaginas: parseInt(document.getElementById('numPaginas').value),
    cantEjemplares: parseInt(document.getElementById('cantEjemplares').value),
    cantEjemplaresDisponibles: parseInt(document.getElementById('cantEjemplaresDisponibles').value),
    Sinopsis: document.getElementById('sinopsis').value,
    tipoPresentacion: document.getElementById('tipoPresentacion').value,
    tipoLiteratura: document.getElementById('tipoLiteratura').value,
    Autor: {
      Nombre: document.getElementById('autorNombre').value,
      Apellidos: document.getElementById('autorApellidos').value,
      fechPub: document.getElementById('autorFechaPub').value,
      Premios: document.getElementById('autorPremios').value.split(',').map(p => p.trim()),
      fecFall: document.getElementById('autorFechaFallecimiento').value
    }
  };

  console.log('📤 Enviando libro...');
  console.log('📦 Datos a enviar:', nuevoLibro); // 👈 Agrega esta línea
  
  
  try {
    let res;
    if (modoEdicion) {
      res = await fetch(`${API_URL}/${isbnActual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLibro)
      });
      if (res.ok) alert('✏️ Libro actualizado');
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLibro)
      });
      if (res.ok) alert('✅ Libro agregado');
    }

    obtenerLibros();
    e.target.reset();
    modoEdicion = false;
    isbnActual = '';
    document.getElementById('modo').textContent = '➕ Agregar nuevo libro';
  } catch (err) {
    console.error(err);
    alert('❌ Error al guardar el libro');
  }
});

async function obtenerLibros() {
  try {
    const res = await fetch(API_URL);
    const libros = await res.json();
    mostrarLibros(libros);
  } catch (err) {
    console.error('Error al cargar libros:', err);
  }
}

function mostrarLibros(libros) {
  const lista = document.getElementById('listaLibros');
  lista.innerHTML = '';
  libros.forEach(libro => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${libro.Titulo}</strong> - ${libro.Autor?.Nombre || 'Autor desconocido'} (${libro.Isbn})<br>
      <button onclick="eliminarLibro('${libro.Isbn}')">❌ Eliminar</button>
      <button onclick="editarLibro('${libro.Isbn}')">✏️ Editar</button>
    `;
    lista.appendChild(li);
  });
}

async function buscarPorAutor() {
  const nombre = document.getElementById('busquedaAutor').value.trim();
  if (!nombre) return;

  try {
    const res = await fetch(`${API_URL}/autor/${nombre}`);
    const libros = await res.json();
    mostrarLibros(libros);
  } catch (err) {
    console.error('Error en la búsqueda:', err);
  }
}

async function eliminarLibro(isbn) {
  if (!confirm('¿Estás seguro de eliminar este libro?')) return;

  try {
    const res = await fetch(`${API_URL}/${isbn}`, { method: 'DELETE' });
    if (res.ok) {
      alert('🗑️ Libro eliminado');
      obtenerLibros();
    } else {
      alert('❌ No se pudo eliminar');
    }
  } catch (err) {
    console.error(err);
  }
}

async function editarLibro(isbn) {
  try {
    const res = await fetch(`${API_URL}/${isbn}`);
    const libro = await res.json();

    document.getElementById('isbn').value = libro.Isbn;
    document.getElementById('titulo').value = libro.Titulo;
    document.getElementById('fechEdicion').value = libro.fechEdicion;
    document.getElementById('numPaginas').value = libro.numPaginas;
    document.getElementById('cantEjemplares').value = libro.cantEjemplares;
    document.getElementById('cantEjemplaresDisponibles').value = libro.cantEjemplaresDisponibles;
    document.getElementById('sinopsis').value = libro.Sinopsis;
    document.getElementById('tipoPresentacion').value = libro.tipoPresentacion;
    document.getElementById('tipoLiteratura').value = libro.tipoLiteratura;

    document.getElementById('autorNombre').value = libro.Autor?.Nombre || '';
    document.getElementById('autorApellidos').value = libro.Autor?.Apellidos || '';
    document.getElementById('autorFechaPub').value = libro.Autor?.fechPub || '';
    document.getElementById('autorPremios').value = libro.Autor?.Premios?.join(', ') || '';
    document.getElementById('autorFechaFallecimiento').value = libro.Autor?.fecFall || '';

    modoEdicion = true;
    isbnActual = isbn;
    document.getElementById('modo').textContent = '✏️ Editando libro';
  } catch (err) {
    console.error('Error al editar:', err);
  }
}





/*  Prueba cargando la página y revisa
Abre el navegador y visita:
http://127.0.0.1:5500/public/index.html


http://localhost:3000/libros


Para probar rápidamente, puedes añadir este snippet al final de tu main.js solo para test:
✅ Muestra en consola
✅ Y también en pantalla en la lista <ul id="lista-libros">.
const API_URL = 'http://localhost:3000/libros';

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        console.log('📚 Libros recibidos:', data);
        const lista = document.getElementById('lista-libros');
        lista.innerHTML = '';

        data.forEach(libro => {
            const li = document.createElement('li');
            li.textContent = `${libro.Titulo} - ${libro.Autor.Nombre} ${libro.Autor.Apellidos}`;
            lista.appendChild(li);
        });
    })
    .catch(err => {
        console.error('❌ Error al obtener libros:', err);
    });



    Así verificamos que el frontend se puede comunicar con el backend.

Abre la consola del navegador (F12 → pestaña "Console")

Verifica si se muestran libros o aparece algún error como:

CORS policy ❌

Failed to fetch ❌

Unexpected token ❌*/