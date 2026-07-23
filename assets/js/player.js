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
];

// ─── Inicialización ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Guard: verificar auth.js cargado
  if (typeof window.AUTH_UTILS === 'undefined') {
    console.error('[SELETO] auth.js no cargado antes de player.js');
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
    loadMoviesFromFilePlayer().then(() => initPlayer());
  });
});

// ─── Cargar películas del archivo filmes.txt ──────────────────────────────────────

/**
 * Parsea el archivo filmes.txt con el nuevo formato:
 *   Titulo - Año ⭐ Nota
 *
 *   Sinopsis: Descripción... | URL Drive
 */
async function loadMoviesFromFilePlayer() {
  try {
    const response = await fetch('filmes.txt?' + Date.now());
    if (!response.ok) throw new Error('Archivo no encontrado');

    const text = await response.text();

    // Divide o texto em blocos de filmes
    const movieBlocks = text.split(/(?=^\S.+\s-\s\d{4}\s[^\d])/m).filter(b => b.trim());

    let nextId = PLAYER_MOVIES_DB.length + 1;

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

      const capa = findCoverByTitlePlayer(titulo);

      // Verifica duplicados
      const exists = PLAYER_MOVIES_DB.some(m => m.titulo.toLowerCase() === titulo.toLowerCase());
      if (exists) continue;

      PLAYER_MOVIES_DB.push({
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

      console.log(`[SELETO Player] ✓ "${titulo}" — ${ano} — ⭐${avaliacao} — URL: ${url ? 'OK' : 'MISSING'} — Desc: ${descricao ? 'OK' : 'MISSING'}`);
    }

    console.log(`[SELETO Player] Total: ${PLAYER_MOVIES_DB.length} películas`);

  } catch (err) {
    console.warn('[SELETO Player] Error cargando filmes.txt:', err.message);
  }
}

/**
 * Intenta encontrar una portada local basada en el título de la película.
 * @param {string} titulo
 * @returns {string} ruta de la portada o placeholder
 */
function findCoverByTitlePlayer(titulo) {
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
    'up, una aventura de altura':   'capasmovies/Up una aventura de altura.jpg',
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
    'relay, el intermediario':      'capasmovies/Relay El Intermediario.jpg',
    'like minds':                   'capasmovies/Like Minds.jpg',
    'contratiempo':                 'capasmovies/Contratiempo.jpg',
    'dia d':                        'capasmovies/Dia D.jpg',
    'nada mas que la verdad':       'capasmovies/Nada mas que la Verdad.jpg',
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
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
}

function initVideoElement(movie) {
  const videoEl = document.getElementById('main-video');
  const iframeWrap = document.getElementById('video-iframe-wrap');
  const iframeEl = document.getElementById('main-iframe');

  if (!videoEl || !iframeWrap || !iframeEl) return;

  const isGoogleDrive = movie.url.includes('drive.google.com');
  const isMega = movie.url.includes('mega.nz');

  if (isGoogleDrive || isMega) {
    let embedUrl = movie.url;

    if (isGoogleDrive) {
      embedUrl = convertToDrivePreview(movie.url);
    }

    // Mega.nz em mobile: iframe é bloqueado — mostra overlay com botão
    if (isMega && isMobileDevice()) {
      videoEl.style.display = 'none';
      iframeWrap.style.display = 'none';

      const megaOverlay = document.createElement('div');
      megaOverlay.id = 'mega-mobile-overlay';
      megaOverlay.style.cssText = `
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        width:100%; aspect-ratio:16/9; background:#000; gap:20px; padding:24px;
      `;
      megaOverlay.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(179,27,27,0.7)" stroke-width="1.5">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
          <line x1="17" y1="17" x2="22" y2="17"/>
        </svg>
        <p style="color:var(--text-secondary);font-size:0.9rem;text-align:center;max-width:280px;">
          Para melhor experiência, abra o vídeo no navegador.
        </p>
        <a href="${movie.url}" target="_blank" rel="noopener" id="mega-open-btn"
           style="
             display:inline-flex;align-items:center;gap:8px;
             padding:14px 32px;border-radius:12px;
             background:linear-gradient(135deg,var(--accent-primary),#8b0000);
             color:#fff;font-weight:600;font-size:0.9rem;text-decoration:none;
             box-shadow:0 0 20px rgba(179,27,27,0.4);
             transition:transform 0.2s,box-shadow 0.2s;
           ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Assistir no Mega
        </a>
      `;
      iframeWrap.parentElement.insertBefore(megaOverlay, iframeWrap);

      console.info(`[SELETO Player] "${movie.titulo}" — Mega em mobile → overlay com botão externo`);
    } else {
      // Desktop ou Google Drive: usa iframe normalmente
      videoEl.style.display = 'none';
      iframeWrap.style.display = 'block';
      iframeEl.src = embedUrl;

      console.info(`[SELETO Player] "${movie.titulo}" — usando iframe ${isGoogleDrive ? 'Google Drive' : 'Mega.nz'}`);
    }
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
  // Limpa a URL (remove espaços, quebras de linha, etc.)
  url = url.trim().replace(/[\r\n\t]/g, '').replace(/\s+/g, '');

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

  // Si no pudo extraer, retorna original limpia
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
