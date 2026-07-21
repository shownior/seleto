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
const MOVIES_DB = [];

// ─── Próximamente — Películas sin enlace (solo capa) ──────────────────────────
// Agrega aquí las películas que quieras mostrar como "Próximamente"
const COMING_SOON = [
  // Ejemplo (descomenta y edita):
  // { titulo: 'nombre-de-la-pelicula.jpg', nome: 'Nombre de la Película' },
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
    if (initialized) return;

    if (!user) {
      setTimeout(() => {
        if (!initialized) {
          initialized = true;
          sessionStorage.setItem('seleto_redirect', window.location.href);
          window.location.replace('index.html');
        }
      }, 1000);
      return;
    }

    initialized = true;
    loadMoviesFromFile().then(() => initVitrine());
  });
});

// ─── Cargar películas del archivo filmes.txt ──────────────────────────────────────

/**
 * Parsea el archivo filmes.txt con el nuevo formato:
 *   Titulo - Año ⭐ Nota
 *
 *   Sinopsis: Descripción... | URL Drive
 */
async function loadMoviesFromFile() {
  try {
    const response = await fetch('filmes.txt?' + Date.now());
    if (!response.ok) throw new Error('Archivo no encontrado');

    const text = await response.text();

    // Divide o texto em blocos de filmes
    // Padrão: linha que começa com texto, depois " - ", 4 dígitos, espaço e estrela
    const movieBlocks = text.split(/(?=^\S.+\s-\s\d{4}\s[^\d])/m).filter(b => b.trim());

    let nextId = MOVIES_DB.length + 1;

    for (const block of movieBlocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);

      if (lines.length === 0) continue;

      // Linha 1: Cabeçalho "Nome - Ano ⭐ Nota"
      const headerMatch = lines[0].match(/^(.+?)\s*-\s*(\d{4})\s+\S\s+([\d.]+)/);
      if (!headerMatch) continue;

      const titulo = headerMatch[1].trim();
      const ano = parseInt(headerMatch[2], 10);
      const avaliacao = parseFloat(headerMatch[3]);

      // Procura sinopse e URL em todas as outras linhas
      let descricao = '';
      let url = '';

      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];

        // Linha de sinopse
        if (line.toLowerCase().startsWith('sinopsis:')) {
          let sinopsisText = line.replace(/^Sinopsis:\s*/i, '').trim();

          // Verifica se tem pipe na mesma linha
          const pipeIdx = sinopsisText.indexOf('|');
          if (pipeIdx !== -1) {
            descricao = sinopsisText.substring(0, pipeIdx).trim();
            const maybeUrl = sinopsisText.substring(pipeIdx + 1).trim();
            if (maybeUrl.startsWith('http')) {
              url = maybeUrl;
            }
          } else {
            descricao = sinopsisText;
          }
          continue;
        }

        // Linha só com pipe + URL
        const pipeMatch = line.match(/^\|?\s*(https?:\/\/\S+)/);
        if (pipeMatch && !url) {
          url = pipeMatch[1];
          continue;
        }

        // Linha só com URL
        if (line.startsWith('http') && !url) {
          url = line.split(/\s+/)[0];
          continue;
        }
      }

      // URL fallback: procura em qualquer lugar do bloco
      if (!url) {
        const urlFallback = block.match(/https?:\/\/drive\.google\.com[^\s|]*/);
        if (urlFallback) {
          url = urlFallback[0];
        }
      }

      const capa = findCoverByTitle(titulo);

      // Verifica duplicados
      const exists = MOVIES_DB.some(m => m.titulo.toLowerCase() === titulo.toLowerCase());
      if (exists) continue;

      MOVIES_DB.push({
        id:          nextId++,
        titulo:      titulo,
        genero:      'Drama',
        ano:         ano,
        avaliacao:   avaliacao,
        duracao:     '—',
        capa:        capa,
        url:         url,
        descricao:   descricao || 'Sinopsis no disponible.',
      });

      console.log(`[SELETO] ✓ "${titulo}" — ${ano} — ⭐${avaliacao} — URL: ${url ? 'OK' : 'MISSING'} — Desc: ${descricao ? 'OK' : 'MISSING'}`);
    }

    console.log(`[SELETO] Total: ${MOVIES_DB.length} películas`);

  } catch (err) {
    console.warn('[SELETO] Error cargando filmes.txt:', err.message);
  }
}

/**
 * Intenta encontrar una portada local basada en el título de la película.
 * Busca en la carpeta CAPAS DOS FILMES por archivo con nombre similar.
 * @param {string} titulo
 * @returns {string} ruta de la portada o placeholder
 */
function findCoverByTitle(titulo) {
  const coverMap = {
    'la lista de schindler':        'capasmovies/La lista de Schindler.jpg',
    'el origen':                    'capasmovies/El Origen.jpg',
    'el club de la pelea':          'capasmovies/El club de la pelea.jpg',
    'matrix':                       'capasmovies/Matrix.jpg',
    'gladiador':                    'capasmovies/Gladiador.jpg',
    'whiplash':                     'capasmovies/Whiplash.jpg',
    'parásitos':                    'capasmovies/Parásitos.jpg',
    'los infiltrados':              'capasmovies/Los Infiltrados.jpg',
    'django sin cadenas':           'capasmovies/Django sin cadenas.jpg',
    'el gran truco':                'capasmovies/El Gran Truco.jpg',
    'intocable':                    'capasmovies/Intocable.jpg',
    'wall·e':                       'capasmovies/WALL·E.jpg',
    'wall-e':                       'capasmovies/WALL·E.jpg',
    'bastardos sin gloria':         'capasmovies/Bastardos sin gloria.jpg',
    'up una aventura de altura':    'capasmovies/Up una aventura de altura.jpg',
    'el rey león':                  'capasmovies/El rey león.jpg',
    'duro de matar':                'capasmovies/Duro de matar.jpg',
    'proyecto fin del mundo':       'capasmovies/Proyecto Fin del mundo.jpg',
    'interestelar':                 'capasmovies/Interestelar.jpg',
    '1917':                         'capasmovies/1917.jpg',
    'indiana jones y la última cruzada': 'capasmovies/Indiana jones y la última cruzada.jpg',
    'la isla siniestra':            'capasmovies/La isla siniestra.jpg',
    'sin lugar para los débiles':   'capasmovies/Sin lugar para los débiles.jpg',
    'petróleo sangriento':          'capasmovies/Petróleo sangriento.jpg',
    'top gun maverick':             'capasmovies/Top Gun Maverick.jpg',
    'los horrores de caddo lake':   'capasmovies/Los Horrores de Caddo Lake.jpg',
    'relay el intermediario':       'capasmovies/Relay El Intermediario.jpg',
    'like minds':                   'capasmovies/Like Minds.jpg',
  };

  const lower = titulo.toLowerCase().trim();

  if (coverMap[lower]) return coverMap[lower];

  for (const [key, path] of Object.entries(coverMap)) {
    if (lower.includes(key) || key.includes(lower)) return path;
  }

  return 'https://picsum.photos/300/450?random=' + Date.now();
}

function initVitrine() {
  renderUserBadge();

  // Adiciona filmes "em breve" ao catálogo
  const comingSoonMovies = COMING_SOON.map((item, idx) => ({
    id:          1000 + idx,
    titulo:      item.nome || item.titulo,
    genero:      'Drama',
    ano:         2026,
    avaliacao:   0,
    duracao:     '—',
    capa:        'capasmovies/' + item.titulo,
    url:         '',
    descricao:   'Próximamente en SELETO.',
    comingSoon:  true,
  }));

  const allMovies = [...MOVIES_DB, ...comingSoonMovies];

  renderMovies(allMovies);
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

  grid.innerHTML = '';

  if (movies.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  // Ordena por ano (más recientes primero)
  const sorted = [...movies].sort((a, b) => {
    // Próximamente sempre vão para o final
    if (a.comingSoon && !b.comingSoon) return 1;
    if (!a.comingSoon && b.comingSoon) return -1;
    return b.ano - a.ano;
  });

  sorted.forEach((movie, index) => {
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
  const isComingSoon = movie.comingSoon === true;

  let card;
  if (isComingSoon) {
    card = document.createElement('div');
    card.className = 'movie-card coming-soon';
    card.setAttribute('aria-label', `${movie.titulo} — Próximamente`);
  } else {
    card = document.createElement('a');
    card.className = 'movie-card';
    card.href = `player.html?filme=${movie.id}`;
    card.setAttribute('aria-label', `Ver ${movie.titulo}`);
  }
  card.style.animationDelay = `${index * 0.06}s`;

  const content = document.createElement('div');
  content.innerHTML = `
    <div class="movie-thumb">
      <img
        src="${movie.capa}"
        alt="Portada de ${movie.titulo}"
        loading="lazy"
        onerror="this.src='https://picsum.photos/300/450?random=${movie.id + 50}'"
      />
      <div class="movie-thumb-overlay"></div>
      ${isComingSoon ? '<div class="coming-soon-badge">Próximamente</div>' : ''}
      ${!isComingSoon ? `
      <div class="play-overlay" aria-hidden="true">
        <div class="play-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
      </div>` : ''}
    </div>
    <div class="movie-info">
      <div class="movie-title">${movie.titulo}</div>
      ${!isComingSoon ? `
      <div class="movie-meta">
        <span class="rating" title="Valoración ${movie.avaliacao}/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          ${movie.avaliacao.toFixed(1)}
        </span>
        <span class="year">${movie.ano}</span>
        <span>${movie.duracao}</span>
      </div>` : ''}
    </div>
  `;

  while (content.firstChild) {
    card.appendChild(content.firstChild);
  }

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
