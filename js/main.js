document.addEventListener("DOMContentLoaded", function () {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Textos generados desde JavaScript, en ambos idiomas.
  const STRINGS = {
    es: {
      menuOpen: "Abrir menú",
      menuClose: "Cerrar menú",
      showing: (n) => `Mostrando ${n} ${n === 1 ? "proyecto" : "proyectos"}`,
      viewVideo: "Ver video",
      viewImage: (n) => `Ver imagen ${n}`,
      play: "Reproducir",
      formSending: "Enviando…",
      formSuccess: "¡Mensaje enviado! Te responderé a la brevedad.",
      formInvalid: "Revisa los campos marcados: todos son obligatorios y el email debe ser válido.",
      formError: "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme a arcealex257@gmail.com.",
      formNotReady: "El formulario aún no está configurado. Escríbeme a arcealex257@gmail.com.",
    },
    en: {
      menuOpen: "Open menu",
      menuClose: "Close menu",
      showing: (n) => `Showing ${n} ${n === 1 ? "project" : "projects"}`,
      viewVideo: "Watch video",
      viewImage: (n) => `View image ${n}`,
      play: "Play",
      formSending: "Sending…",
      formSuccess: "Message sent! I'll get back to you shortly.",
      formInvalid: "Please check the highlighted fields: all are required and the email must be valid.",
      formError: "The message could not be sent. Please try again or email me at arcealex257@gmail.com.",
      formNotReady: "The form is not set up yet. Please email me at arcealex257@gmail.com.",
    },
  };

  // Referencias: con dos o más se desplazan en bucle. Se duplica la lista (copia oculta para
  // lectores de pantalla) antes de preparar la traducción, para que la copia también cambie de idioma.
  const testimonials = $(".testimonials");
  const testimonialTrack = testimonials && $(".testimonial-track", testimonials);
  if (testimonialTrack && testimonialTrack.children.length > 1 && !reduceMotion) {
    const copy = testimonialTrack.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    testimonials.append(copy);
    testimonials.style.setProperty("--marquee-duration", `${testimonialTrack.children.length * 12}s`);
    testimonials.classList.add("is-moving");
  }

  // Traducción: el español está escrito en el HTML y el inglés en atributos data-en.
  //   data-en="..."          reemplaza el texto
  //   data-en-html="..."     reemplaza el contenido HTML
  //   data-en-<atributo>     reemplaza ese atributo (aria-label, alt, href, content...)
  // El español original se guarda en data-es* para poder volver.
  const translatable = $$("*").filter((el) => [...el.attributes].some((a) => a.name.startsWith("data-en")));
  let lang = "es";
  const t = (key, ...args) => {
    const value = STRINGS[lang][key];
    return typeof value === "function" ? value(...args) : value;
  };

  function swap(el, enName, esName, read, write) {
    if (!el.hasAttribute(esName)) el.setAttribute(esName, read());
    write(lang === "en" ? el.getAttribute(enName) : el.getAttribute(esName));
  }

  function applyLanguage(next, { save = true } = {}) {
    lang = next;
    translatable.forEach((el) => {
      [...el.attributes].forEach(({ name }) => {
        if (name === "data-en") {
          swap(el, name, "data-es", () => el.textContent, (v) => (el.textContent = v));
        } else if (name === "data-en-html") {
          swap(el, name, "data-es-html", () => el.innerHTML, (v) => (el.innerHTML = v));
        } else if (name.startsWith("data-en-")) {
          const attr = name.slice("data-en-".length);
          swap(el, name, `data-es-${attr}`, () => el.getAttribute(attr) ?? "", (v) => el.setAttribute(attr, v));
        }
      });
    });
    document.documentElement.lang = lang;
    $$(".lang-switch button").forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang))
    );
    refreshDynamicText();
    if (!save) return;
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    const url = new URL(window.location.href);
    if (lang === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    history.replaceState(null, "", url);
  }

  // Idioma inicial: ?lang= en la URL, luego la última elección, luego el idioma del navegador.
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  let saved = null;
  try {
    saved = localStorage.getItem("lang");
  } catch {}
  const initial = [fromUrl, saved].find((value) => value === "es" || value === "en")
    || (navigator.language || "").toLowerCase().startsWith("en") && "en"
    || "es";
  $$(".lang-switch button").forEach((button) =>
    button.addEventListener("click", () => applyLanguage(button.dataset.lang))
  );

  // Logo animado: al hacer clic la hoja gira, la A se redibuja y saltan chispas;
  // en reposo, la hoja se mece cada cierto tiempo como con brisa.
  const brand = $(".brand");
  const leafSpin = $(".logo-leaf-spin");
  const leafSway = $(".logo-leaf-sway");
  const logoA = $(".logo-a");

  function sparkBurst() {
    for (let i = 0; i < 7; i++) {
      const spark = document.createElement("span");
      spark.className = "logo-spark";
      brand.append(spark);
      const angle = (-150 + i * 30 + Math.random() * 14) * (Math.PI / 180);
      const distance = 22 + Math.random() * 14;
      spark
        .animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.2)`, opacity: 0 },
          ],
          { duration: 650 + Math.random() * 250, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" }
        )
        .finished.then(() => spark.remove());
    }
  }

  if (!reduceMotion) {
    brand.addEventListener("click", () => {
      leafSpin.animate([{ transform: "rotate(0)" }, { transform: "rotate(-1turn)" }], {
        duration: 900,
        easing: "cubic-bezier(0.5, 0, 0.2, 1)",
      });
      logoA.animate([{ strokeDashoffset: 84 }, { strokeDashoffset: 0 }], {
        duration: 700,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      });
      sparkBurst();
    });

    // Brisa ocasional mientras nadie interactúa con el logo.
    setInterval(() => {
      if (document.hidden || brand.matches(":hover")) return;
      leafSway.animate(
        [
          { transform: "none" },
          { transform: "rotate(-10deg)", offset: 0.3 },
          { transform: "rotate(6deg)", offset: 0.6 },
          { transform: "none" },
        ],
        { duration: 1600, easing: "ease-in-out" }
      );
    }, 9000);
  }

  // Año del footer.
  $("#year").textContent = new Date().getFullYear();

  // Header con fondo al hacer scroll.
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menú móvil.
  const navToggle = $(".nav-toggle");
  const navMenu = $("#nav-menu");

  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", t(open ? "menuClose" : "menuOpen"));
    document.body.classList.toggle("nav-open", open);
  }

  navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("is-open")));
  $$("a", navMenu).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) setMenu(false);
  });

  // Enlaces internos sin "#" en la barra de direcciones: se desplaza a la sección
  // y la URL queda limpia (se conserva ?lang=en). Un enlace compartido con #seccion
  // sigue funcionando al entrar: baja a esa sección y después limpia la dirección.
  const cleanUrl = () => history.replaceState(null, "", window.location.pathname + window.location.search);

  function goToSection(id) {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // Mueve el foco a la sección para lectores de pantalla y navegación con teclado.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    return true;
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (goToSection(link.getAttribute("href").slice(1))) {
      event.preventDefault();
      cleanUrl();
    }
  });

  if (window.location.hash) {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    cleanUrl();
    if (target) {
      target.scrollIntoView({ block: "start" });
      // Si fuentes o imágenes cambian el alto de la página, reajusta al terminar de cargar,
      // salvo que el visitante ya se haya movido por su cuenta.
      let userMoved = false;
      const markMoved = () => (userMoved = true);
      ["wheel", "touchstart", "keydown"].forEach((type) => window.addEventListener(type, markMoved, { once: true, passive: true }));
      window.addEventListener("load", () => {
        if (!userMoved) target.scrollIntoView({ block: "start" });
      });
    }
  }

  // Cambio de #seccion sin recargar (por ejemplo, al pegar un enlace en la misma pestaña).
  window.addEventListener("hashchange", () => {
    goToSection(decodeURIComponent(window.location.hash.slice(1)));
    cleanUrl();
  });

  // Marca en el menú la sección visible.
  const navLinks = $$('.nav-menu a[href^="#"]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((section) => sectionObserver.observe(section));

  // Aparición de elementos al hacer scroll.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((element) => {
    // Escalona las tarjetas que aparecen juntas.
    const siblings = $$(":scope > .reveal", element.parentElement);
    if (siblings.length > 1) element.style.transitionDelay = `${(siblings.indexOf(element) % 3) * 90}ms`;
    revealObserver.observe(element);
  });

  // Capturas completas en las tarjetas: agrega detrás una copia difuminada que rellena el espacio.
  $$(".thumb-fit > img").forEach((img) => {
    const backdrop = document.createElement("img");
    backdrop.className = "thumb-backdrop";
    backdrop.src = img.getAttribute("src");
    backdrop.alt = "";
    backdrop.loading = "lazy";
    backdrop.setAttribute("aria-hidden", "true");
    img.before(backdrop);
  });

  // Filtros de proyectos.
  const filters = $$(".filter");
  const cards = $$(".project-card");
  const filterStatus = $(".filter-status");
  let filteredCount = null; // null = mostrando todos

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filters.forEach((other) => {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });

      let visible = 0;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.tags.split(" ").includes(filter);
        card.hidden = !show;
        if (!show) return;
        visible++;
        card.classList.add("is-visible");
        card.classList.remove("pop");
        void card.offsetWidth; // reinicia la animación
        card.classList.add("pop");
      });
      filteredCount = filter === "all" ? null : visible;
      filterStatus.textContent = filteredCount === null ? "" : t("showing", filteredCount);
    });
  });

  // Ventana de proyecto con galería.
  const modal = $("#project-modal");
  const panel = $(".modal-panel", modal);
  const galleryMain = $(".gallery-main", modal);
  const galleryThumbs = $(".gallery-thumbs", modal);
  const prevButton = $(".gallery-prev", modal);
  const nextButton = $(".gallery-next", modal);
  const modalContent = $(".modal-content", modal);
  let activeCard = null;
  let activeOrigin = null; // elemento desde donde crece la ventana (tarjeta de proyecto o de experiencia)
  let activeTrigger = null; // botón que recibe el foco al cerrar
  let slides = [];
  let current = 0;
  let closing = false;

  const youtubeThumb = (id, quality) => `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

  function readSlides(detail) {
    return $$(".detail-media > *", detail).map((item) =>
      item.dataset.video
        ? { type: "video", id: item.dataset.video, title: item.dataset.title || "Video del proyecto" }
        : { type: "image", src: item.getAttribute("src"), thumb: item.dataset.thumb || item.getAttribute("src"), alt: item.alt }
    );
  }

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    galleryMain.replaceChildren();

    if (slide.type === "image") {
      // La miniatura difuminada aparece al instante mientras carga la imagen grande.
      const backdrop = document.createElement("img");
      backdrop.className = "gallery-backdrop";
      backdrop.src = slide.thumb;
      backdrop.alt = "";
      backdrop.setAttribute("aria-hidden", "true");
      const img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt;
      img.decoding = "async";
      galleryMain.append(backdrop, img);
    } else {
      // El video se carga solo cuando el visitante lo pide.
      const poster = document.createElement("button");
      poster.type = "button";
      poster.className = "video-poster";
      poster.setAttribute("aria-label", `${t("play")}: ${slide.title}`);
      poster.innerHTML = `<img src="${youtubeThumb(slide.id, "maxresdefault")}" alt=""><span class="play"><svg class="icon"><use href="#i-play"/></svg></span>`;
      poster.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${slide.id}?autoplay=1&rel=0`;
        iframe.title = slide.title;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        galleryMain.replaceChildren(iframe);
      });
      galleryMain.append(poster);
    }

    $$("button", galleryThumbs).forEach((thumb, i) =>
      thumb.setAttribute("aria-current", String(i === current))
    );
  }

  function buildGallery(detail) {
    slides = readSlides(detail);
    galleryThumbs.replaceChildren();
    const multiple = slides.length > 1;
    prevButton.hidden = !multiple;
    nextButton.hidden = !multiple;
    galleryThumbs.hidden = !multiple;

    if (!slides.length) {
      const media = $(".detail-media", detail);
      const title = $(".project-title", activeCard).textContent;
      galleryMain.innerHTML = `<div class="gallery-placeholder"><div><strong></strong><p></p></div></div>`;
      $("strong", galleryMain).textContent = title;
      $("p", galleryMain).textContent = media.dataset.placeholder || "";
      return;
    }

    slides.forEach((slide, i) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.setAttribute("aria-label", slide.type === "video" ? t("viewVideo") : t("viewImage", i + 1));
      const src = slide.type === "video" ? youtubeThumb(slide.id, "mqdefault") : slide.thumb;
      thumb.innerHTML = `<img src="${src}" alt="" loading="lazy">${
        slide.type === "video" ? '<svg class="icon"><use href="#i-play"/></svg>' : ""
      }`;
      thumb.addEventListener("click", () => showSlide(i));
      galleryThumbs.append(thumb);
    });
    showSlide(0);
  }

  // Calcula la transformación que lleva el panel al tamaño y posición del elemento de origen.
  function cardTransform() {
    const from = activeOrigin.getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  }

  function openProject(card, origin, trigger = origin) {
    if (closing) return;
    activeCard = card;
    activeOrigin = origin;
    activeTrigger = trigger;
    const detail = $(".project-detail", card);
    modalContent.innerHTML = $(".detail-body", detail).innerHTML;
    const heading = $("h3", modalContent);
    if (heading) heading.id = "modal-title";
    buildGallery(detail);

    modal.showModal();
    document.body.classList.add("modal-open");
    modalContent.scrollTop = 0;
    panel.scrollTop = 0;

    if (reduceMotion) return;
    panel.animate(
      [
        { transformOrigin: "top left", transform: cardTransform(), opacity: 0.5, borderRadius: "16px" },
        { transformOrigin: "top left", transform: "none", opacity: 1, borderRadius: "20px" },
      ],
      { duration: 560, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" }
    );
    $$(".modal-inner", panel).forEach((inner) =>
      inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 220, fill: "backwards" })
    );
  }

  function finishClose() {
    modal.close();
    modal.classList.remove("is-closing");
    document.body.classList.remove("modal-open");
    galleryMain.replaceChildren(); // detiene el video si estaba sonando
    closing = false;
    activeTrigger.focus({ preventScroll: true });
  }

  function closeProject() {
    if (!modal.open || closing) return;
    closing = true;
    if (reduceMotion) return finishClose();
    modal.classList.add("is-closing");
    $$(".modal-inner", panel).forEach((inner) =>
      inner.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" })
    );
    const animation = panel.animate(
      [
        { transformOrigin: "top left", transform: "none", opacity: 1 },
        { transformOrigin: "top left", transform: cardTransform(), opacity: 0 },
      ],
      { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
    );
    animation.onfinish = () => {
      $$(".modal-inner", panel).forEach((inner) => inner.getAnimations().forEach((a) => a.cancel()));
      finishClose();
    };
  }

  cards.forEach((card) => {
    const button = $(".project-open", card);
    button.addEventListener("click", () => openProject(card, button));
  });
  // Desde la línea de tiempo: abre el proyecto correspondiente creciendo desde esa tarjeta.
  $$(".timeline-link").forEach((button) =>
    button.addEventListener("click", () =>
      openProject(document.getElementById(button.dataset.project), button.closest(".timeline-card"), button)
    )
  );
  $(".modal-close", modal).addEventListener("click", closeProject);
  prevButton.addEventListener("click", () => showSlide(current - 1));
  nextButton.addEventListener("click", () => showSlide(current + 1));

  // Esc y clic fuera del panel cierran con animación.
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProject();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeProject();
  });
  modal.addEventListener("keydown", (event) => {
    if (slides.length < 2) return;
    if (event.key === "ArrowLeft") showSlide(current - 1);
    if (event.key === "ArrowRight") showSlide(current + 1);
  });

  // Formulario de contacto: se envía a Web3Forms sin recargar la página.
  const contactForm = $("#contact-form");
  const formStatus = $(".form-status", contactForm);
  const submitButton = $(".form-submit", contactForm);
  let formState = null; // clave del último mensaje mostrado, para traducirlo al cambiar de idioma

  function showFormStatus(key, type) {
    formState = key ? { key, type } : null;
    formStatus.textContent = key ? t(key) : "";
    formStatus.className = "form-status" + (type ? ` is-${type}` : "");
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    contactForm.classList.add("was-validated");
    if (!contactForm.checkValidity()) {
      showFormStatus("formInvalid", "error");
      $(":invalid", contactForm)?.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(contactForm));
    if (!data.access_key || data.access_key === "WEB3FORMS_ACCESS_KEY") {
      showFormStatus("formNotReady", "error");
      return;
    }
    data.idioma = lang === "en" ? "Inglés" : "Español"; // se lee en el correo que recibe Alex

    submitButton.disabled = true;
    showFormStatus("formSending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || response.status);
      contactForm.reset();
      contactForm.classList.remove("was-validated");
      showFormStatus("formSuccess", "success");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      showFormStatus("formError", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  // Actualiza los textos generados por JavaScript al cambiar de idioma.
  function refreshDynamicText() {
    setMenu(navMenu.classList.contains("is-open"));
    filterStatus.textContent = filteredCount === null ? "" : t("showing", filteredCount);
    if (formState) showFormStatus(formState.key, formState.type);
  }

  if (initial === "en") applyLanguage("en", { save: false });
});
