document.addEventListener("DOMContentLoaded", function () {
  // Función para manejar la respuesta del fetch.
  function handleResponse(id, data) {
    // Aquí se establece el contenido del placeholder específico con el HTML obtenido.
    document.getElementById(id).innerHTML = data;

    // Si se carga el contenido de contacto, entonces se inicializa AOS (Animate On Scroll).
    if (id === "contacto-placeholder") {
      AOS.init();
    }
  }

  // Función para manejar los errores.
  function handleError(id, error) {
    // Si hay un error durante el fetch, se muestra en la consola.
    console.error(`Error loading ${id}:`, error);
  }

  // Función para cargar el contenido de un archivo externo.
  function loadContent(id, filePath) {
    // Se hace un fetch al archivo.
    fetch(filePath)
      .then((response) => response.text()) // Se convierte la respuesta a texto.
      .then((data) => handleResponse(id, data)) // Se maneja la respuesta.
      .catch((error) => handleError(id, error)); // Se maneja el error.
  }

  // Lista de los placeholders y los archivos correspondientes a cargar.
  const placeholders = [
    { id: "footer-placeholder", filePath: "footer.html" },
    { id: "contacto-placeholder", filePath: "contacto.html" },
    { id: "skills-placeholder", filePath: "skills.html" },
    { id: "phrase-placeholder", filePath: "phrase.html" },
    { id: "project-placeholder", filePath: "project.html" },
    { id: "generalProjects-placeholder", filePath: "generalProjects.html" },
  ];

  // Se inicia un fetch para cada placeholder de manera simultánea.
  placeholders.forEach((placeholder) => {
    loadContent(placeholder.id, placeholder.filePath);
  });
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const currentUrl = window.location.pathname; // Obtiene la ruta actual

  navLinks.forEach(link => {
      if (link.href.includes(currentUrl)) {
          link.classList.add('active'); // Añade 'active' al enlace que coincide con la URL
      } else {
          link.classList.remove('active'); // Asegura remover 'active' donde no se necesita
      }
  });
});
