<p align="center">
  <img src="marca/icon-512.png" width="96" alt="Logo de Alex Arce">
</p>

<h1 align="center">alexarce.dev</h1>

<p align="center">
  Portafolio de <strong>Alex Arce Suarez</strong> · Ingeniero de Software · Full Stack &amp; Inteligencia Artificial<br>
  <a href="https://alexarce.dev">alexarce.dev</a> · <a href="https://alexarce.dev/?lang=en">English version</a>
</p>

---

## Qué incluye

- **Servicios**: desarrollo web a medida, AgTech, IA generativa y automatización de procesos.
- **Experiencia** en línea de tiempo, con acceso directo al detalle de cada proyecto.
- **Referencias** de jefaturas; con dos o más, los testimonios se desplazan en bucle.
- **Proyectos** con filtros y una ventana animada con galería de capturas y videos.
- **Habilidades, formación y contacto**, con el CV descargable en español e inglés.
- **Sitio bilingüe** (español / inglés) con selector ES | EN y enlace directo `?lang=en`.

## Tecnología

Sitio estático en HTML, CSS y JavaScript, sin frameworks ni dependencias. Se publica con **GitHub Pages** y el dominio `alexarce.dev` está registrado en **Cloudflare**.

## Estructura

```
index.html          Página principal (todo el contenido, en español y en inglés)
404.html            Página para direcciones que no existen
css/style.css       Estilos
js/main.js          Menú, idioma, filtros, ventana de proyectos y animaciones
marca/              Marca personal: favicon, íconos, imagen para redes y manifest
cv/                 CV en PDF (español e inglés)
img/                Capturas de proyectos (originales) y miniaturas livianas
img-marca/          Ilustración de la portada
CNAME               Dominio personalizado para GitHub Pages
```

## Ver el sitio en tu computador

Desde la carpeta del proyecto, levanta un servidor local (el sitio no funciona abriendo `index.html` con doble clic):

```bash
python -m http.server 8000
```

y abre <http://localhost:8000>.

## Editar textos

El español va escrito directamente en el HTML y el inglés en atributos `data-en`:

```html
<h2 data-en="How I can help you">Cómo puedo ayudarte</h2>
```

| Atributo | Para qué sirve |
|---|---|
| `data-en="..."` | Texto en inglés del elemento |
| `data-en-html="..."` | Inglés con etiquetas HTML (por ejemplo `<strong>`) |
| `data-en-alt`, `data-en-href`, `data-en-aria-label`, `data-en-content` | Atributos en inglés (texto alternativo, enlaces, etc.) |

Al agregar o cambiar un texto, actualiza siempre las dos versiones.

## Agregar un proyecto

1. Guarda las capturas en `img/Proyectos personales/<proyecto>/`.
2. Crea su miniatura de 800 px de ancho en `img/miniaturas/` con la misma ruta.
3. Copia un bloque `<article class="project-card">` en `index.html` y ajusta textos, etiquetas (`data-tags`) e imágenes.

---

© Alex Arce Suarez · Santiago, Chile
