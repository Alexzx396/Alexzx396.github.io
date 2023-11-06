document.addEventListener('DOMContentLoaded', function() {
    function loadContent(id, filePath) {
      fetch(filePath)
        .then(response => response.text())
        .then(data => {
          document.getElementById(id).innerHTML = data;
          if (id === 'contacto-placeholder') {
            AOS.init();
          }
        })
        .catch(error => console.error(`Error loading ${id}:`, error));
    }
    loadContent('footer-placeholder', 'footer.html');
    loadContent('contacto-placeholder', 'contacto.html');
    loadContent('skills-placeholder', 'skills.html');
    loadContent('phrase-placeholder', 'phrase.html');
    loadContent('project-placeholder', 'project.html');
    loadContent('generalProjects-placeholder', 'generalProjects.html');
    loadContent('aboutMe-placeholder', 'aboutMe.html');
    
  });
  