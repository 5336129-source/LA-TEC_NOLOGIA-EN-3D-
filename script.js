document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("videoProyecto");
  const videoPlaceholder = document.getElementById("videoPlaceholder");

  // Oculta el aviso visual cuando el archivo de video puede cargarse.
  video.addEventListener("loadedmetadata", () => {
    videoPlaceholder.hidden = true;
  });

  video.addEventListener("error", () => {
    videoPlaceholder.hidden = false;
  });

  const form = document.getElementById("formularioOpinion");
  const nombreInput = document.getElementById("nombre");
  const comentarioInput = document.getElementById("comentario");
  const listaOpiniones = document.getElementById("listaOpiniones");
  const sinOpiniones = document.getElementById("sinOpiniones");
  const contadorOpiniones = document.getElementById("contadorOpiniones");
  const estadoFormulario = document.getElementById("estadoFormulario");
  const textoCalificacion = document.getElementById("textoCalificacion");

  const errorNombre = document.getElementById("errorNombre");
  const errorComentario = document.getElementById("errorComentario");
  const errorCalificacion = document.getElementById("errorCalificacion");

  const estrellas = [...document.querySelectorAll('input[name="calificacion"]')];
  let totalOpiniones = 0;

  estrellas.forEach((estrella) => {
    estrella.addEventListener("change", () => {
      textoCalificacion.textContent = `Seleccionaste ${estrella.value} de 5 estrellas.`;
      errorCalificacion.textContent = "";
    });
  });

  function limpiarErrores() {
    errorNombre.textContent = "";
    errorComentario.textContent = "";
    errorCalificacion.textContent = "";
    nombreInput.removeAttribute("aria-invalid");
    comentarioInput.removeAttribute("aria-invalid");
    estadoFormulario.textContent = "";
    estadoFormulario.className = "form-status";
  }

  function crearOpinion(nombre, comentario, calificacion) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "opinion-card";

    const encabezado = document.createElement("div");
    encabezado.className = "opinion-card-header";

    const nombreElemento = document.createElement("h4");
    nombreElemento.textContent = nombre;

    const estrellasElemento = document.createElement("span");
    estrellasElemento.className = "opinion-stars";
    estrellasElemento.setAttribute("aria-label", `${calificacion} de 5 estrellas`);
    estrellasElemento.textContent = "★".repeat(calificacion) + "☆".repeat(5 - calificacion);

    const comentarioElemento = document.createElement("p");
    comentarioElemento.textContent = comentario;

    const fechaElemento = document.createElement("small");
    fechaElemento.className = "opinion-date";
    fechaElemento.textContent = "Publicado en esta sesión";

    encabezado.append(nombreElemento, estrellasElemento);
    tarjeta.append(encabezado, comentarioElemento, fechaElemento);
    listaOpiniones.prepend(tarjeta);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    limpiarErrores();

    const nombre = nombreInput.value.trim();
    const comentario = comentarioInput.value.trim();
    const seleccion = document.querySelector('input[name="calificacion"]:checked');
    const calificacion = seleccion ? Number(seleccion.value) : 0;
    let valido = true;

    if (nombre.length < 2) {
      errorNombre.textContent = "Escribe tu nombre (al menos 2 caracteres).";
      nombreInput.setAttribute("aria-invalid", "true");
      valido = false;
    }

    if (comentario.length < 3) {
      errorComentario.textContent = "Escribe un comentario de al menos 3 caracteres.";
      comentarioInput.setAttribute("aria-invalid", "true");
      valido = false;
    }

    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      errorCalificacion.textContent = "Selecciona una calificación de 1 a 5 estrellas.";
      valido = false;
    }

    if (!valido) {
      estadoFormulario.textContent = "Revisa los campos indicados antes de enviar.";
      estadoFormulario.className = "form-status error";
      return;
    }

    crearOpinion(nombre, comentario, calificacion);
    totalOpiniones += 1;
    contadorOpiniones.textContent = String(totalOpiniones);
    sinOpiniones.hidden = true;

    estadoFormulario.textContent = "¡Gracias! Tu opinión se agregó a la página.";
    estadoFormulario.className = "form-status success";
    form.reset();
    textoCalificacion.textContent = "Selecciona de 1 a 5 estrellas.";
    nombreInput.focus();
  });

  nombreInput.addEventListener("input", () => {
    errorNombre.textContent = "";
    nombreInput.removeAttribute("aria-invalid");
  });

  comentarioInput.addEventListener("input", () => {
    errorComentario.textContent = "";
    comentarioInput.removeAttribute("aria-invalid");
  });
});


// Navegación profesional por secciones independientes (sin tener que deslizar toda la página).
(() => {
  const views = [...document.querySelectorAll('[data-page]')];
  const navLinks = [...document.querySelectorAll('[data-view]')];
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');

  function showView(viewName, updateHash = true) {
    const valid = views.some(view => view.dataset.page === viewName);
    const target = valid ? viewName : 'inicio';
    views.forEach(view => { view.hidden = view.dataset.page !== target; });
    document.querySelectorAll('.nav-link').forEach(link => {
      const active = link.dataset.view === target;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (updateHash) history.replaceState(null, '', '#' + (target === 'explorar' ? 'explorar' : target));
    if (nav) nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    showView(link.dataset.view || 'inicio');
  }));
  if (menuToggle && nav) menuToggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });
  const hash = location.hash.replace('#', '');
  showView(hash === 'reflexion' ? 'explorar' : hash, false);
})();
