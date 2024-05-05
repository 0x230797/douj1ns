document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const resultsList = document.getElementById('results');
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    let posts = [];
    let currentPage = 0;
    const postsPerPage = 20;

    // Función para mostrar las publicaciones en la página actual
    function displayCurrentPage() {
        const startIndex = currentPage * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const currentPosts = posts.slice(startIndex, endIndex);
        displayPosts(currentPosts);
        togglePaginationButtons(); // Llamar a esta función para mostrar u ocultar los botones de paginación
    }

    // Función para mostrar u ocultar los botones de página anterior y siguiente
    function togglePaginationButtons() {
        if (posts.length >= 21) {
            prevPageBtn.style.display = currentPage > 0 ? 'block' : 'none';
            nextPageBtn.style.display = currentPage < Math.ceil(posts.length / postsPerPage) - 1 ? 'block' : 'none';
        } else {
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'none';
        }
    }

    // Event listener para el botón de página anterior
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            displayCurrentPage();
        }
    });

    // Event listener para el botón de página siguiente
    nextPageBtn.addEventListener('click', function() {
        const maxPage = Math.ceil(posts.length / postsPerPage) - 1;
        if (currentPage < maxPage) {
            currentPage++;
            displayCurrentPage();
        }
    });

    // Función para mostrar las publicaciones
    function displayPosts(posts) {
        resultsList.innerHTML = '';
        posts.forEach(post => {
            const li = document.createElement('li');
            const genres = post.generos.join(', ');
            li.innerHTML = `
                <h2>${post.titulo}</h2>
                <img src="${post.imagen}" alt="${post.titulo}">
                <p><strong>Géneros:</strong> ${genres}</p>
                <button class="btn" data-title="${post.titulo}">Leer publicación</button>
            `;
            resultsList.appendChild(li);
        });
    }

    // Función para mostrar los detalles de la publicación en el modal
    function showPublicationDetail(title) {
        const publication = posts.find(post => post.titulo === title);
        if (publication) {
            const genres = publication.generos.join(', ');
            modalContent.innerHTML = `
                <h2>${publication.titulo}</h2>
                <img src="${publication.imagen}" alt="${publication.titulo}">
                <p><strong>Géneros:</strong> ${genres}</p>
                <p>${publication.contenido}</p>
            `;
            modal.style.display = 'block';
        }
    }

    // Cerrar el modal cuando se hace clic en el botón de cierre
    modal.addEventListener('click', function(event) {
        if (event.target === modal || event.target.classList.contains('close')) {
            modal.style.display = 'none';
        }
    });
    
    // Event listener para el campo de búsqueda
    searchInput.addEventListener('input', filterPosts);

    // Event listener para el filtro de género
    genreFilter.addEventListener('change', filterPosts);

    // Event listener para mostrar detalles de la publicación al hacer clic en el botón
    resultsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn')) {
            const title = event.target.dataset.title;
            showPublicationDetail(title);
        }
    });

    // Función para poblar las opciones del menú desplegable de géneros
    function populateGenreFilter(posts) {
        const allGenres = posts.reduce((acc, post) => {
            post.generos.forEach(genre => {
                if (!acc.includes(genre)) {
                    acc.push(genre);
                }
            });
            return acc;
        }, []);
        
        // Agregar opciones al menú desplegable de géneros
        allGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    // Función para filtrar las publicaciones según el término de búsqueda y el género seleccionado
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const filteredPosts = posts.filter(post => 
            (post.titulo.toLowerCase().includes(searchTerm) ||
            post.contenido.toLowerCase().includes(searchTerm)) &&
            (selectedGenre === "" || post.generos.includes(selectedGenre))
        );
        displayPosts(filteredPosts);
    }

    // Cargar los datos del archivo JSON desde la URL proporcionada
    fetch('https://raw.githubusercontent.com/0x230797/douj1ns/main/publicaciones.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
            displayCurrentPage(); // Mostrar la primera página de publicaciones
            populateGenreFilter(posts); // Llamar a esta función para poblar las opciones del menú desplegable de géneros
        })
        .catch(error => console.error('Error al cargar los datos:', error));

});