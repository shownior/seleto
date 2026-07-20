/**
 * SELETO — Lógica del Player de Vídeo
 * Archivo: assets/js/player.js
 *
 * Responsabilidades:
 *  - Verificar autenticación
 *  - Leer parámetro ?filme= de la URL
 *  - Cargar datos de la película desde la base local
 *  - Inicializar el elemento <video> o <iframe>
 *  - Renderizar películas relacionadas
 *  - Controlar el botón Volver
 */

'use strict';

// ─── Base local (espejo de vitrine.js) ────────────────────────────────────────
// Nota: En producción real, esto vendría de una API. Aquí compartimos
// el array definido en vitrine.js vía window.SELETO_VITRINE.MOVIES_DB,
// pero como player.html puede cargarse sin vitrine.js, lo definimos aquí también.
const PLAYER_MOVIES_DB = [
  { id: 1,  titulo: 'Aventura Sombria',        genero: 'Acción',             ano: 2024, avaliacao: 8.4, duracao: '2h 18m', capa: 'https://picsum.photos/300/450?random=101', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Un viaje épico por tierras desconocidas donde cada sombra esconde un secreto mortal.' },
  { id: 2,  titulo: 'El Último Nexus',           genero: 'Ficción Científica', ano: 2023, avaliacao: 9.1, duracao: '2h 34m', capa: 'https://picsum.photos/300/450?random=202', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Cuando la última conexión entre mundos paralelos está amenazada, un solo hombre debe salvar el multiverso.' },
  { id: 3,  titulo: 'Ciudad de los Sueños',     genero: 'Drama',              ano: 2024, avaliacao: 7.8, duracao: '1h 58m', capa: 'https://picsum.photos/300/450?random=303', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'En las calles luminosas de Neo-Lisboa, una artista busca su identidad en un mundo que olvidó soñar.' },
  { id: 4,  titulo: 'Proyecto Aurora',          genero: 'Suspense',           ano: 2023, avaliacao: 8.7, duracao: '2h 05m', capa: 'https://picsum.photos/300/450?random=404', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Un experimento secreto del gobierno amenaza desbordarse a la realidad. El tiempo se está acabando.' },
  { id: 5,  titulo: 'Fragmentos del Pasado',    genero: 'Drama',              ano: 2022, avaliacao: 8.2, duracao: '1h 47m', capa: 'https://picsum.photos/300/450?random=505', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Recuerdos fragmentados de toda una vida revelan una verdad que nadie estaba preparado para escuchar.' },
  { id: 6,  titulo: 'El Código Rojo',           genero: 'Thriller',           ano: 2024, avaliacao: 8.9, duracao: '2h 12m', capa: 'https://picsum.photos/300/450?random=606', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Un mensaje cifrado lleva a un detective al centro de una conspiración global implacable.' },
  { id: 7,  titulo: 'Más Allá del Horizonte',   genero: 'Aventura',           ano: 2023, avaliacao: 7.6, duracao: '2h 01m', capa: 'https://picsum.photos/300/450?random=707', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Una expedición audaz al corazón de la Amazonia esconde revelaciones que cambiarán la historia de la humanidad.' },
  { id: 8,  titulo: 'Noche Eterna',             genero: 'Terror',             ano: 2024, avaliacao: 8.5, duracao: '1h 53m', capa: 'https://picsum.photos/300/450?random=808', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Cuando el sol se puso por última vez, los sobrevivientes descubrieron que la oscuridad trajo consigo algo ancestral.' },
  { id: 9,  titulo: 'Vértice Cero',             genero: 'Acción',             ano: 2023, avaliacao: 8.0, duracao: '2h 20m', capa: 'https://picsum.photos/300/450?random=909', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'En un mundo donde la gravedad colapsa en zonas aleatorias, un piloto debe cruzar el caos para salvar a su hija.' },
  { id: 10, titulo: 'La Última Profecía',       genero: 'Fantasía',           ano: 2022, avaliacao: 9.3, duracao: '2h 48m', capa: 'https://picsum.photos/300/450?random=110', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Escrita hace mil años, la profecía nunca fue comprendida — hasta que una joven vidente nace con el don de leerla.' },
  { id: 11, titulo: 'Pulsar',                   genero: 'Ficción Científica', ano: 2024, avaliacao: 7.9, duracao: '1h 44m', capa: 'https://picsum.photos/300/450?random=211', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'En 2087, una anomalía electromagnética comienza a reescribir los recuerdos de toda la población de una metrópolis.' },
  { id: 12, titulo: 'Sangre y Corona',          genero: 'Drama Histórico',    ano: 2023, avaliacao: 8.6, duracao: '2h 30m', capa: 'https://picsum.photos/300/450?random=312', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Traición, amor y poder se entrelazan en la corte más peligrosa de la Europa medieval. Solo uno sobrevivirá.' },
  { id: 13, titulo: 'Matrix',                   genero: 'Acción',             ano: 1999, avaliacao: 8.7, duracao: '2h 16m', capa: 'CAPAS DOS FILMES/matrix.jpg',        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',  descricao: 'Un hacker descubre que la realidad es una simulación creada por máquinas para subyugar a la humanidad.' },
  { id: 14, titulo: 'El Origen',                genero: 'Ficción Científica', ano: 2010, avaliacao: 8.8, duracao: '2h 28m', capa: 'CAPAS DOS FILMES/a origem.jpg',      url: 'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',  descricao: 'Un ladrón especializado en extraer secretos del subconsciente recibe una misión imposible: plantar una idea en la mente de alguien.' },
  { id: 15, titulo: 'La Lista de Schindler',    genero: 'Drama Histórico',    ano: 1993, avaliacao: 9.0, duracao: '3h 15m', capa: 'CAPAS DOS FILMES/A Lista de Schindler.jpg', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', descricao: 'El empresario alemán Oskar Schindler salva la vida de más de mil judíos polacos durante el Holocausto.' },
  { id: 16, titulo: 'Interstellar',             genero: 'Ficción Científica', ano: 2014, avaliacao: 8.6, duracao: '2h 49m', capa: 'CAPAS DOS FILMES/interestelar.jpg',  url: 'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',  descricao: 'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.' },
];

// ─── Inicialización ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Guard: verificar auth.js cargado
  if (typeof window.AUTH_UTILS === 'undefined') {
    console.error('[SELETO] auth.js no cargado antes de player.js');
    return;
  }

  // Guard: autenticación
  if (!window.AUTH_UTILS.requireAuth()) return;

  // Carga películas del archivo filmes.txt
  await loadMoviesFromFilePlayer();

  initPlayer();
});

// ─── Cargar películas del archivo filmes.txt ──────────────────────────────────────

/**
 * Busca el archivo filmes.txt y añade las películas a la base del player.
 * Formato esperado por línea: nombre de la película | enlace de Google Drive
 */
async function loadMoviesFromFilePlayer() {
  try {
    const response = await fetch('../filmes.txt');
    if (!response.ok) throw new Error('Archivo no encontrado');

    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let nextId = PLAYER_MOVIES_DB.length + 1;

    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) return;

      const titulo = parts[0];
      const url = parts[1];

      // Verificar si ya existe película con mismo título
      const exists = PLAYER_MOVIES_DB.some(m => m.titulo.toLowerCase() === titulo.toLowerCase());
      if (exists) return;

      // Intentar encontrar portada local por nombre
      const capa = findCoverByTitlePlayer(titulo);

      PLAYER_MOVIES_DB.push({
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

      console.log(`[SELETO Player] Película añadida del txt: "${titulo}"`);
    });

  } catch (err) {
    console.warn('[SELETO Player] No se pudo cargar filmes.txt:', err.message);
  }
}

/**
 * Intenta encontrar una portada local basada en el título de la película.
 * @param {string} titulo
 * @returns {string} ruta de la portada o placeholder
 */
function findCoverByTitlePlayer(titulo) {
  const coverMap = {
    'matrix':                       'CAPAS DOS FILMES/matrix.jpg',
    'el origen':                    'CAPAS DOS FILMES/a origem.jpg',
    'origen':                       'CAPAS DOS FILMES/a origem.jpg',
    'interstellar':                 'CAPAS DOS FILMES/interestelar.jpg',
    'la lista de schindler':        'CAPAS DOS FILMES/A Lista de Schindler.jpg',
    'lista de schindler':           'CAPAS DOS FILMES/A Lista de Schindler.jpg',
  };

  const lower = titulo.toLowerCase().trim();

  if (coverMap[lower]) return coverMap[lower];

  for (const [key, path] of Object.entries(coverMap)) {
    if (lower.includes(key) || key.includes(lower)) return path;
  }

  return 'https://picsum.photos/300/450?random=' + Date.now();
}

function initPlayer() {
  const movieId = getMovieIdFromURL();

  if (!movieId) {
    showPlayerError('Ninguna película especificada.');
    return;
  }

  const movie = findMovie(movieId);

  if (!movie) {
    showPlayerError(`Película con ID "${movieId}" no encontrada.`);
    return;
  }

  renderPlayerInfo(movie);
  initVideoElement(movie);
  renderRelatedMovies(movie);
  bindBackButton();
  updatePageTitle(movie.titulo);
}

// ─── URL Helpers ────────────────────────────────────────────────────────────────

/**
 * Lee el parámetro `?filme=` de la URL actual.
 * @returns {number|null}
 */
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('filme');
  const id     = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

/**
 * Busca una película por ID en la base local.
 * @param {number} id
 * @returns {Object|undefined}
 */
function findMovie(id) {
  return PLAYER_MOVIES_DB.find(m => m.id === id);
}

// ─── Renderización ───────────────────────────────────────────────────────────────

/**
 * Rellena el panel de información de la película.
 * @param {Object} movie
 */
function renderPlayerInfo(movie) {
  setTextContent('player-title',       movie.titulo);
  setTextContent('player-description', movie.descricao);
  setTextContent('player-genero',      movie.genero);
  setTextContent('player-ano',         movie.ano);
  setTextContent('player-duracao',     movie.duracao);
  setTextContent('player-avaliacao',   movie.avaliacao.toFixed(1));
  setTextContent('breadcrumb-title',   movie.titulo);
}

/**
 * Inicializa el elemento <video> o <iframe> con la URL de la película.
 * Detecta automáticamente URLs de Google Drive y usa iframe.
 * @param {Object} movie
 */
function initVideoElement(movie) {
  const videoEl = document.getElementById('main-video');
  const iframeWrap = document.getElementById('video-iframe-wrap');
  const iframeEl = document.getElementById('main-iframe');

  if (!videoEl || !iframeWrap || !iframeEl) return;

  const isGoogleDrive = movie.url.includes('drive.google.com');

  if (isGoogleDrive) {
    // Convertir a URL de preview de Google Drive
    const driveUrl = convertToDrivePreview(movie.url);

    // Ocultar vídeo nativo, mostrar iframe
    videoEl.style.display = 'none';
    iframeWrap.style.display = 'block';
    iframeEl.src = driveUrl;

    console.info(`[SELETO Player] "${movie.titulo}" — usando iframe Google Drive`);
  } else {
    // Usar vídeo nativo
    videoEl.src = movie.url;

    // Manejo de errores del vídeo
    videoEl.addEventListener('error', () => {
      console.warn('[SELETO Player] Error al cargar vídeo:', movie.url);
      showVideoError(videoEl);
    });

    // Al cargar metadatos, log de duración real
    videoEl.addEventListener('loadedmetadata', () => {
      console.info(`[SELETO Player] "${movie.titulo}" cargado — duración: ${videoEl.duration.toFixed(1)}s`);
    });

    // Guarda progreso en localStorage (feature extra)
    videoEl.addEventListener('timeupdate', () => {
      if (videoEl.duration && videoEl.currentTime > 5) {
        const key = `seleto_progress_${movie.id}`;
        localStorage.setItem(key, videoEl.currentTime.toFixed(1));
      }
    });

    // Retoma del punto guardado (si existe)
    const savedProgress = parseFloat(localStorage.getItem(`seleto_progress_${movie.id}`));
    if (savedProgress > 5) {
      videoEl.currentTime = savedProgress;
    }
  }
}

/**
 * Convierte URL de Google Drive a formato de preview/embed.
 * Acepta formatos como:
 *   - https://drive.google.com/file/d/ID/preview
 *   - https://drive.google.com/uc?export=download&id=ID
 *   - https://drive.google.com/open?id=ID
 * @param {string} url
 * @returns {string} URL de preview
 */
function convertToDrivePreview(url) {
  // Extraer ID del archivo de varios formatos
  let fileId = null;

  // Formato: /file/d/ID/
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Formato: ?id=ID o &id=ID
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) fileId = idMatch[1];
  }

  // Formato: /open?id=ID
  if (!fileId) {
    const openMatch = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
    if (openMatch) fileId = openMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Si no pudo extraer, retorna original
  return url;
}

/**
 * Renderiza la sección "También Te Puede Gustar".
 * @param {Object} currentMovie
 */
function renderRelatedMovies(currentMovie) {
  const container = document.getElementById('related-grid');
  if (!container) return;

  // Filtra: mismo género O aleatorios — excluye el actual — máx 4
  const related = PLAYER_MOVIES_DB
    .filter(m => m.id !== currentMovie.id)
    .sort((a, b) => {
      // Prioriza mismo género
      const aScore = a.genero === currentMovie.genero ? 1 : 0;
      const bScore = b.genero === currentMovie.genero ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, 4);

  container.innerHTML = '';

  related.forEach((movie, index) => {
    const card = document.createElement('a');
    card.className = 'movie-card';
    card.href      = `player.html?filme=${movie.id}`;
    card.setAttribute('aria-label', `Ver ${movie.titulo}`);
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="movie-thumb">
        <img
          src="${movie.capa}"
          alt="${movie.titulo}"
          loading="lazy"
          onerror="this.src='https://picsum.photos/300/450?random=${movie.id + 80}'"
        />
        <div class="movie-thumb-overlay"></div>
        <div class="movie-badge">${movie.genero}</div>
        <div class="play-overlay" aria-hidden="true">
          <div class="play-icon">
            <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
      </div>
      <div class="movie-info">
        <div class="movie-title">${movie.titulo}</div>
        <div class="movie-meta">
          <span class="rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            ${movie.avaliacao.toFixed(1)}
          </span>
          <span class="year">${movie.ano}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ─── Botón Volver ───────────────────────────────────────────────────────────────

function bindBackButton() {
  const btnVoltar = document.getElementById('btn-voltar');
  if (!btnVoltar) return;

  btnVoltar.addEventListener('click', (e) => {
    e.preventDefault();
    // Pausa el vídeo antes de salir
    const videoEl = document.getElementById('main-video');
    if (videoEl) videoEl.pause();
    window.location.href = 'vitrine.html';
  });
}

// ─── Errores ──────────────────────────────────────────────────────────────────────

function showPlayerError(msg) {
  const stage = document.getElementById('player-stage');
  if (stage) {
    stage.innerHTML = `
      <div class="empty-state" style="display:flex;flex-direction:column;align-items:center;padding:80px 24px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(200,40,40,0.5)" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style="margin-top:16px;color:var(--text-muted);">${msg}</p>
        <a href="vitrine.html" class="btn btn-primary" style="margin-top:24px;">← Volver al Catálogo</a>
      </div>
    `;
  }
}

function showVideoError(videoEl) {
  const wrapper = videoEl.parentElement;
  if (!wrapper) return;
  const errDiv = document.createElement('div');
  errDiv.style.cssText = `
    position:absolute; inset:0; display:flex;
    align-items:center; justify-content:center;
    background:rgba(10,2,2,0.9); color:var(--text-muted);
    font-size:0.9rem; flex-direction:column; gap:12px;
  `;
  errDiv.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(200,40,40,0.5)" stroke-width="1.5">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
    <span>No fue posible cargar el vídeo.</span>
  `;
  wrapper.style.position = 'relative';
  wrapper.appendChild(errDiv);
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function setTextContent(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updatePageTitle(titulo) {
  document.title = `${titulo} — SELETO`;
}
