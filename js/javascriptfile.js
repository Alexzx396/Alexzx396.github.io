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
    { id: "acerca-placeholder", filePath: "perfil.html" },
    { id: "generalProjects-placeholder", filePath: "generalProjects.html" },
    { id: "webProjects-placeholder", filePath: "webProjects.html" },
    { id: "contacto-placeholder", filePath: "contacto.html" },
    { id: "trabajos-placeholder", filePath: "trabajos.html" },
    { id: "skills-placeholder", filePath: "skills.html" },
    { id: "phrase-placeholder", filePath: "phrase.html" },
    { id: "footer-placeholder", filePath: "footer.html" },
  ];

  // Se inicia un fetch para cada placeholder de manera simultánea.
  placeholders.forEach((placeholder) => {
    loadContent(placeholder.id, placeholder.filePath);
  });
});
