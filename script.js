document.addEventListener('DOMContentLoaded', () => {
//ejemplo de addEventListener para el evento DOMContentLoaded, que se ejecuta cuando el documento HTML ha sido completamente cargado y parseado, sin esperar a que las hojas de estilo, imágenes y subframes terminen de cargarse.
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  let activeLink = null;

  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    const isCurrentPage = href === currentPage;
    link.classList.toggle('active', isCurrentPage);
//usamos un selector para seleccionar todos los elementos con la clase 'nav-link' y luego iteramos sobre ellos. Para cada enlace, obtenemos su atributo 'href' y verificamos si coincide con la página actual. Si es así, agregamos la clase 'active' al enlace; de lo contrario, la eliminamos.
    if (isCurrentPage) {
      link.setAttribute('aria-current', 'page');
      if (link.hasAttribute('target')) {
        link.removeAttribute('target');
      }
      activeLink = link;
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const brand = document.querySelector('.brand');
  if (activeLink && brand) {
    document.title = `${activeLink.innerText} | ${brand.innerText}`;
    activeLink.style.color = '#fff';
    activeLink.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    activeLink.outerHTML = activeLink.outerHTML
      .replace(
        '</a>',
        '<span class="nav-indicator" aria-hidden="true"></span></a>'
      );

    const activeIndicator = document.querySelector(
      '.site-nav [aria-current="page"] .nav-indicator'
    );
    const currentPageLink = document.querySelector(
      '.site-nav [aria-current="page"]'
    );
    if (activeIndicator && currentPageLink) {
      activeIndicator.classList.add('is-current-page');
      activeIndicator.classList.replace(
        'nav-indicator',
        'current-page-indicator'
      );
      const estilos = getComputedStyle(currentPageLink);
      activeIndicator.style.cssText =
        `background-color: var(--panel-alt); border: 1px solid ${estilos.color}; border-radius: 50%; width: 6px; height: 6px;`;
    }
  }

  const downloadCvButton = document.getElementById('download-cv');
  if (downloadCvButton) {
    const cvContent = `LAURA GÓMEZ LÓPEZ
DISEÑADORA DE PROYECTOS
Madrid, España | +34 612 345 678 | laura.gomez@correo.com
Disponibilidad: jornada completa / remoto

PERFIL PROFESIONAL
Consultora y coordinadora de proyectos con más de 8 años de experiencia.
Especialista en innovación, mejora continua y experiencia del cliente en
sectores de servicios, retail y tecnología.

EXPERIENCIA LABORAL
2021 - Actualidad | Gerente de Proyectos | NovaConsulting
Liderazgo de proyectos de transformación digital; mejora del 28% en la
experiencia del cliente.

2017 - 2021 | Coordinadora de Operaciones | BrightService
Coordinación de equipos y mejora de indicadores de operación, calidad y
cumplimiento.

2014 - 2017 | Analista de Procesos | Soluciones Mx
Documentación de procesos e implementación de mejoras para reducir tiempos
de respuesta y costos operativos.

FORMACIÓN ACADÉMICA
2022 | Certificación en Scrum Master
2018 | Máster en Dirección de Proyectos | Universidad Complutense de Madrid
2014 | Licenciatura en Administración y Dirección de Empresas
      | Universidad Autónoma de Madrid

COMPETENCIAS
Gestión de proyectos · Liderazgo de equipos · Análisis estratégico
Comunicación · Mejora continua · Planificación`;

    downloadCvButton.onclick = function () {
      const cvFile = new Blob([`\uFEFF${cvContent}`], {
        type: 'text/plain;charset=utf-8',
      });
      const fileUrl = URL.createObjectURL(cvFile);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = 'CV_Laura_Gomez.txt';
      downloadLink.hidden = true;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);

      const downloadStatus = document.getElementById('cv-download-status');
      if (downloadStatus) {
        downloadStatus.textContent = 'CV descargado · listo para compartir';
      }
    };

    downloadCvButton.disabled = false;
    const downloadStatus = document.getElementById('cv-download-status');
    if (downloadStatus) {
      downloadStatus.textContent = 'Descarga directa · documento de texto';
    }
  }

  const printProfileButton = document.getElementById('print-profile');
  const printProfileHint = document.getElementById('print-profile-hint');
  if (printProfileButton && printProfileHint) {
    printProfileButton.onclick = function () {
      window.print();
    };

    printProfileButton.onmouseover = function () {
      printProfileHint.hidden = false;
    };
    printProfileButton.onmouseout = function () {
      printProfileHint.hidden = true;
    };
    printProfileButton.onfocus = function () {
      printProfileHint.hidden = false;
    };
    printProfileButton.onblur = function () {
      printProfileHint.hidden = true;
    };
  }
 
  const projectButtons = document.querySelectorAll('.project-toggle');
  const projectActivityStatus = document.getElementById(
    'project-activity-status'
  );
  const trackingToggle = document.getElementById('toggle-project-tracking');

  if (projectButtons.length > 0 && projectActivityStatus && trackingToggle) {
    let trackedInteractions = 0;
    let trackingEnabled = true;

    function toggleProjectDetails(event) {
      const button = event.currentTarget;
      const detail = document.getElementById(
        button.getAttribute('aria-controls')
      );

      if (!detail) {
        return;
      }

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      detail.hidden = isExpanded;
      button.innerHTML = isExpanded
        ? 'Ver detalles <span aria-hidden="true">+</span>'
        : 'Ocultar detalles <span aria-hidden="true">−</span>';
    }

    function recordProjectInteraction(event) {
      trackedInteractions += 1;
      const projectName = event.currentTarget.dataset.project;
      projectActivityStatus.textContent =
        `${projectName}: ${trackedInteractions} interacciones registradas.`;
    }

    projectButtons.forEach((button) => {
      button.addEventListener('click', toggleProjectDetails);
      button.addEventListener('click', recordProjectInteraction);
    });

    trackingToggle.addEventListener('click', () => {
      trackingEnabled = !trackingEnabled;

      projectButtons.forEach((button) => {
        if (trackingEnabled) {
          button.addEventListener('click', recordProjectInteraction);
        } else {
          button.removeEventListener('click', recordProjectInteraction);
        }
      });

      trackingToggle.textContent = trackingEnabled
        ? 'Pausar contador'
        : 'Reanudar contador';
      projectActivityStatus.textContent = trackingEnabled
        ? 'Contador de interacciones activado.'
        : 'Contador pausado; los detalles siguen disponibles.';
    });
  }

  const footer = document.querySelector('.footer .container');
  if (footer) {
    footer.innerHTML =
      '© <time id="year"></time> Laura Gómez. Todos los derechos reservados.';

    const yearNode = document.getElementById('year');
    if (yearNode) {
      const currentYear = new Date().getFullYear();
      yearNode.textContent = currentYear;
      yearNode.setAttribute('datetime', currentYear);
    }

    footer.insertAdjacentHTML(
      'beforeend',
      '<span class="footer-ornament" aria-hidden="true"></span>'
    );
  }
});
