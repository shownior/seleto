/**
 * SELETO — Lógica de la Vitrina (Catálogo)
 * Archivo: assets/js/vitrine.js
 *
 * Responsabilidades:
 *  - Verificar autenticación
 *  - Renderizar el grid de películas
 *  - Gestionar búsqueda/filtro local
 *  - Controlar el botón de Salir
 */

'use strict';

// ─── Mock Data — Catálogo de Películas ────────────────────────────────────────
const MOVIES_DB = [
  {
    id:          1,
    titulo:      'Aventura Sombria',
    genero:      'Acción',
    ano:         2024,
    avaliacao:   8.4,
    duracao:     '2h 18m',
    capa:        'https://picsum.photos/300/450?random=101',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Un viaje épico por tierras desconocidas donde cada sombra esconde un secreto mortal.',
  },
  {
    id:          2,
    titulo:      'El Último Nexus',
    genero:      'Ficción Científica',
    ano:         2023,
    avaliacao:   9.1,
    duracao:     '2h 34m',
    capa:        'https://picsum.photos/300/450?random=202',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Cuando la última conexión entre mundos paralelos está amenazada, un solo hombre debe salvar el multiverso.',
  },
  {
    id:          3,
    titulo:      'Ciudad de los Sueños',
    genero:      'Drama',
    ano:         2024,
    avaliacao:   7.8,
    duracao:     '1h 58m',
    capa:        'https://picsum.photos/300/450?random=303',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'En las calles luminosas de Neo-Lisboa, una artista busca su identidad en un mundo que olvidó soñar.',
  },
  {
    id:          4,
    titulo:      'Proyecto Aurora',
    genero:      'Suspense',
    ano:         2023,
    avaliacao:   8.7,
    duracao:     '2h 05m',
    capa:        'https://picsum.photos/300/450?random=404',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Un experimento secreto del gobierno amenaza desbordarse a la realidad. El tiempo se está acabando.',
  },
  {
    id:          5,
    titulo:      'Fragmentos del Pasado',
    genero:      'Drama',
    ano:         2022,
    avaliacao:   8.2,
    duracao:     '1h 47m',
    capa:        'https://picsum.photos/300/450?random=505',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Recuerdos fragmentados de toda una vida revelan una verdad que nadie estaba preparado para escuchar.',
  },
  {
    id:          6,
    titulo:      'El Código Rojo',
    genero:      'Thriller',
    ano:         2024,
    avaliacao:   8.9,
    duracao:     '2h 12m',
    capa:        'https://picsum.photos/300/450?random=606',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Un mensaje cifrado lleva a un detective al centro de una conspiración global implacable.',
  },
  {
    id:          7,
    titulo:      'Más Allá del Horizonte',
    genero:      'Aventura',
    ano:         2023,
    avaliacao:   7.6,
    duracao:     '2h 01m',
    capa:        'https://picsum.photos/300/450?random=707',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Una expedición audaz al corazón de la Amazonia esconde revelaciones que cambiarán la historia de la humanidad.',
  },
  {
    id:          8,
    titulo:      'Noche Eterna',
    genero:      'Terror',
    ano:         2024,
    avaliacao:   8.5,
    duracao:     '1h 53m',
    capa:        'https://picsum.photos/300/450?random=808',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Cuando el sol se puso por última vez, los sobrevivientes descubrieron que la oscuridad trajo consigo algo ancestral.',
  },
  {
    id:          9,
    titulo:      'Vértice Cero',
    genero:      'Acción',
    ano:         2023,
    avaliacao:   8.0,
    duracao:     '2h 20m',
    capa:        'https://picsum.photos/300/450?random=909',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'En un mundo donde la gravedad colapsa en zonas aleatorias, un piloto debe cruzar el caos para salvar a su hija.',
  },
  {
    id:          10,
    titulo:      'La Última Profecía',
    genero:      'Fantasía',
    ano:         2022,
    avaliacao:   9.3,
    duracao:     '2h 48m',
    capa:        'https://picsum.photos/300/450?random=110',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Escrita hace mil años, la profecía nunca fue comprendida — hasta que una joven vidente nace con el don de leerla.',
  },
  {
    id:          11,
    titulo:      'Pulsar',
    genero:      'Ficción Científica',
    ano:         2024,
    avaliacao:   7.9,
    duracao:     '1h 44m',
    capa:        'https://picsum.photos/300/450?random=211',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'En 2087, una anomalía electromagnética comienza a reescribir los recuerdos de toda la población de una metrópolis.',
  },
  {
    id:          12,
    titulo:      'Sangre y Corona',
    genero:      'Drama Histórico',
    ano:         2023,
    avaliacao:   8.6,
    duracao:     '2h 30m',
    capa:        'https://picsum.photos/300/450?random=312',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Traición, amor y poder se entrelazan en la corte más peligrosa de la Europa medieval. Solo uno sobrevivirá.',
  },
  {
    id:          13,
    titulo:      'Matrix',
    genero:      'Acción',
    ano:         1999,
    avaliacao:   8.7,
    duracao:     '2h 16m',
    capa:        'CAPAS DOS FILMES/matrix.jpg',
    url:         'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    descricao:   'Un hacker descubre que la realidad es una simulación creada por máquinas para subyugar a la humanidad.',
  },
  {
    id:          14,
    titulo:      'El Origen',
    genero:      'Ficción Científica',
    ano:         2010,
    avaliacao:   8.8,
    duracao:     '2h 28m',
    capa:        'CAPAS DOS FILMES/a origem.jpg',
    url:         'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',
    descricao:   'Un ladrón especializado en extraer secretos del subconsciente recibe una misión imposible: plantar una idea en la mente de alguien.',
  },
  {
    id:          15,
    titulo:      'La Lista de Schindler',
    genero:      'Drama Histórico',
    ano:         1993,
    avaliacao:   9.0,
    duracao:     '3h 15m',
    capa:        'CAPAS DOS FILMES/A Lista de Schindler.jpg',
    url:         'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    descricao:   'El empresario alemán Oskar Schindler salva la vida de más de mil judíos polacos durante el Holocausto.',
  },
  {
    id:          16,
    titulo:      'Interstellar',
    genero:      'Ficción Científica',
    ano:         2014,
    avaliacao:   8.6,
    duracao:     '2h 49m',
    capa:        'CAPAS DOS FILMES/interestelar.jpg',
    url:         'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',
    descricao:   'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.',
  },
];

// ─── Estado Local ───────────────────────────────────────────────────────────────
let currentFilter = 'Todos';
let searchQuery   = '';

// ─── Inicialización ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Guard: verificar autenticación (auth.js debe cargarse antes)
  if (typeof window.AUTH_UTILS === 'undefined') {
    console.error('[SELETO] auth.js no cargado.');
    return;
  }

  let initialized = false;

  // Aguarda o Firebase verificar o estado de auth antes de prosseguir
  window.AUTH_UTILS.onAuthStateChanged((user) => {
    if (initialized) return; // Evita execução múltipla

    if (!user) {
      // Pequeno delay para dar tempo ao Firebase restaurar sessão
      setTimeout(() => {
        if (!initialized) {
          initialized = true;
          sessionStorage.setItem('seleto_redirect', window.location.href);
          window.location.replace('index.html');
        }
      }, 1000); // Aguarda 1s para o Firebase restaurar a sessão
      return;
    }

    initialized = true;
    loadMoviesFromFile().then(() => initVitrine());
  });
});

// ─── Cargar películas del archivo filmes.txt ──────────────────────────────────────

/**
 * Busca el archivo filmes.txt y añade las películas al catálogo.
 * Formato esperado por línea: nombre de la película | enlace de Google Drive
 */
async function loadMoviesFromFile() {
  try {
    const response = await fetch('filmes.txt');
    if (!response.ok) throw new Error('Archivo no encontrado');

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let nextId = MOVIES_DB.length + 1;

    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) return;

      const titulo = parts[0];
      const url = parts[1];

      // Verificar si ya existe película con mismo título
      const exists = MOVIES_DB.some(m => m.titulo.toLowerCase() === titulo.toLowerCase());
      if (exists) return;

      // Intentar encontrar portada local por nombre
      const capa = findCoverByTitle(titulo);

      MOVIES_DB.push({
        id:          nextId++,
        titulo:      titulo,
        genero:      'Drama',
        ano:         new Date().getFullYear(),
        avaliacao:   8.0,
        duracao:     '—',
        capa:        capa,
        url:         url,
        descricao:   'Película añadida vía filmes.txt.',
      });

      console.log(`[SELETO] Película añadida del txt: "${titulo}"`);
    });

  } catch (err) {
    console.warn('[SELETO] No se pudo cargar filmes.txt:', err.message);
  }
}

/**
 * Intenta encontrar una portada local basada en el título de la película.
 * Busca en la carpeta CAPAS DOS FILMES por archivo con nombre similar.
 * @param {string} titulo
 * @returns {string} ruta de la portada o placeholder
 */
function findCoverByTitle(titulo) {
  // Mapeo de títulos a archivos de portada
  const coverMap = {
    'matrix':                       'CAPAS DOS FILMES/matrix.jpg',
    'el origen':                    'CAPAS DOS FILMES/a origem.jpg',
    'origen':                       'CAPAS DOS FILMES/a origem.jpg',
    'interstellar':                 'CAPAS DOS FILMES/interestelar.jpg',
    'la lista de schindler':        'CAPAS DOS FILMES/A Lista de Schindler.jpg',
    'lista de schindler':           'CAPAS DOS FILMES/A Lista de Schindler.jpg',
  };

  const lower = titulo.toLowerCase().trim();

  // Búsqueda directa
  if (coverMap[lower]) return coverMap[lower];

  // Búsqueda parcial (si el título contiene una clave)
  for (const [key, path] of Object.entries(coverMap)) {
    if (lower.includes(key) || key.includes(lower)) return path;
  }

  // Placeholder genérico
  return 'https://picsum.photos/300/450?random=' + Date.now();
}

function initVitrine() {
  renderUserBadge();
  renderMovies(MOVIES_DB);
  bindLogout();
  bindSearch();
  bindFilters();
  bindScrollHeader();
}

// ─── Renderización ───────────────────────────────────────────────────────────────

/** Muestra el badge del usuario conectado en el header */
function renderUserBadge() {
  const user       = window.AUTH_UTILS.getUser();
  const badgeEl    = document.getElementById('user-name');
  const avatarEl   = document.getElementById('user-avatar');

  if (!user) return;

  const displayName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  if (badgeEl)  badgeEl.textContent  = displayName;
  if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
}

/**
 * Renderiza las tarjetas de películas en el grid.
 * @param {Array} movies
 */
function renderMovies(movies) {
  const grid    = document.getElementById('movies-grid');
  const emptyEl = document.getElementById('empty-state');

  if (!grid) return;

  // Limpia el grid
  grid.innerHTML = '';

  if (movies.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  // Crea las tarjetas
  movies.forEach((movie, index) => {
    const card = createMovieCard(movie, index);
    grid.appendChild(card);
  });
}

/**
 * Crea el elemento HTML de una tarjeta de película.
 * @param {Object} movie
 * @param {number} index
 * @returns {HTMLElement}
 */
function createMovieCard(movie, index) {
  const card = document.createElement('a');
  card.className   = 'movie-card';
  card.href        = `player.html?filme=${movie.id}`;
  card.setAttribute('aria-label', `Ver ${movie.titulo}`);
  // Retraso escalonado para animación de entrada
  card.style.animationDelay = `${index * 0.06}s`;

  // Estrellas — convierte valoración a string visual
  const stars = getStarsHTML(movie.avaliacao);

  card.innerHTML = `
    <div class="movie-thumb">
      <img
        src="${movie.capa}"
        alt="Portada de ${movie.titulo}"
        loading="lazy"
        onerror="this.src='https://picsum.photos/300/450?random=${movie.id + 50}'"
      />
      <div class="movie-thumb-overlay"></div>
      <div class="movie-badge">${movie.genero}</div>
      <div class="play-overlay" aria-hidden="true">
        <div class="play-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="movie-info">
      <div class="movie-title">${movie.titulo}</div>
      <div class="movie-meta">
        <span class="rating" title="Valoración ${movie.avaliacao}/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          ${movie.avaliacao.toFixed(1)}
        </span>
        <span class="year">${movie.ano}</span>
        <span>${movie.duracao}</span>
      </div>
    </div>
  `;

  return card;
}

/** Genera HTML de estrellas basado en la valoración */
function getStarsHTML(rating) {
  const full = Math.floor(rating / 2);
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += `<span style="color:${i < full ? '#f0a500' : '#444'}"">★</span>`;
  }
  return html;
}

// ─── Filtros ────────────────────────────────────────────────────────────────────

/** Inicializa los botones de filtro de género */
function bindFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

/** Aplica búsqueda + filtro de género */
function applyFilters() {
  let filtered = MOVIES_DB;

  // Filtro de género
  if (currentFilter !== 'Todos') {
    filtered = filtered.filter(m => m.genero === currentFilter);
  }

  // Búsqueda por título
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(m =>
      m.titulo.toLowerCase().includes(q) ||
      m.genero.toLowerCase().includes(q)
    );
  }

  renderMovies(filtered);
}

// ─── Búsqueda ──────────────────────────────────────────────────────────────────

function bindSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  // Debounce simple para evitar re-render excesivo
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
      applyFilters();
    }, 250);
  });
}

// ─── Logout ─────────────────────────────────────────────────────────────────────

function bindLogout() {
  const btnSair = document.getElementById('btn-sair');
  if (!btnSair) return;

  btnSair.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('¡Hasta pronto! Sesión cerrada.', 'info');
    setTimeout(() => window.AUTH_UTILS.logout(), 800);
  });
}

// ─── Header scroll ──────────────────────────────────────────────────────────────

function bindScrollHeader() {
  const header = document.querySelector('.vitrine-header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.style.boxShadow = '0 4px 40px rgba(0,0,0,0.7), 0 0 20px rgba(179,27,27,0.1)';
    } else {
      header.style.boxShadow = '';
    }
    lastScroll = current;
  }, { passive: true });
}

// ─── Toast Helper ───────────────────────────────────────────────────────────────

/**
 * Muestra un toast de notificación temporal.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#e63946" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#b8a6a6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;

  // Muestra
  requestAnimationFrame(() => toast.classList.add('show'));

  // Oculta tras 3s
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Exporta al scope global (uso en player.js y otros)
window.SELETO_VITRINE = { MOVIES_DB, showToast };
