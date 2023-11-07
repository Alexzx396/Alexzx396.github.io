document.addEventListener("DOMContentLoaded", function () {
  // Función para manejar la respuesta del fetch.
  function handleResponse(id, data) {
    document.getElementById(id).innerHTML = data;
    if (id === "contacto-placeholder") {
      AOS.init();
    }
  }

  // Función para manejar los errores.
  function handleError(id, error) {
    console.error(`Error loading ${id}:`, error);
  }

  // Función para cargar el contenido.
  function loadContent(id, filePath) {
    fetch(filePath)
      .then((response) => response.text())
      .then((data) => handleResponse(id, data))
      .catch((error) => handleError(id, error));
  }

  // Carga todo el contenido en paralelo.
  const placeholders = [
    { id: "footer-placeholder", filePath: "footer.html" },
    { id: "contacto-placeholder", filePath: "contacto.html" },
    { id: "skills-placeholder", filePath: "skills.html" },
    { id: "phrase-placeholder", filePath: "phrase.html" },
    { id: "project-placeholder", filePath: "project.html" },
    { id: "generalProjects-placeholder", filePath: "generalProjects.html" },
  ];

  // Inicia todas las solicitudes de fetch simultáneamente.
  placeholders.forEach((placeholder) =>
    loadContent(placeholder.id, placeholder.filePath)
  );
});
