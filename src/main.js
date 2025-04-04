document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/libros')
        .then(response => response.json())
        .then(libros => {
            const lista = document.getElementById('lista-libros');
            libros.forEach(libro => {
                const li = document.createElement('li');
                li.textContent = `${libro.Titulo} - ${libro.Autor.Nombre} ${libro.Autor.Apellidos}`;
                lista.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});
