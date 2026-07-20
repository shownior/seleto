/**
 * SELETO — Lógica da Vitrine (Catálogo)
 * Arquivo: assets/js/vitrine.js
 *
 * Responsabilidades:
 *  - Verificar autenticação
 *  - Renderizar o grid de filmes
 *  - Gerenciar busca/filtro local
 *  - Controlar o botão de Sair
 */

'use strict';

// ─── Mock Data — Catálogo de Filmes ────────────────────────────────────────────
const MOVIES_DB = [
  {
    id:          1,
    titulo:      'Aventura Sombria',
    genero:      'Ação',
    ano:         2024,
    avaliacao:   8.4,
    duracao:     '2h 18m',
    capa:        'https://picsum.photos/300/450?random=101',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Uma jornada épica por terras desconhecidas onde cada sombra esconde um segredo mortal.',
  },
  {
    id:          2,
    titulo:      'O Último Nexus',
    genero:      'Ficção Científica',
    ano:         2023,
    avaliacao:   9.1,
    duracao:     '2h 34m',
    capa:        'https://picsum.photos/300/450?random=202',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Quando a última conexão entre mundos paralelos é ameaçada, um único homem deve salvar o multiverso.',
  },
  {
    id:          3,
    titulo:      'Cidade dos Sonhos',
    genero:      'Drama',
    ano:         2024,
    avaliacao:   7.8,
    duracao:     '1h 58m',
    capa:        'https://picsum.photos/300/450?random=303',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Nas ruas luminosas de Neo-Lisboa, uma artista busca sua identidade em um mundo que esqueceu de sonhar.',
  },
  {
    id:          4,
    titulo:      'Projeto Aurora',
    genero:      'Suspense',
    ano:         2023,
    avaliacao:   8.7,
    duracao:     '2h 05m',
    capa:        'https://picsum.photos/300/450?random=404',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Um experimento secreto do governo ameaça transbordar para a realidade. O tempo está acabando.',
  },
  {
    id:          5,
    titulo:      'Fragmentos do Passado',
    genero:      'Drama',
    ano:         2022,
    avaliacao:   8.2,
    duracao:     '1h 47m',
    capa:        'https://picsum.photos/300/450?random=505',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Memórias fragmentadas de uma vida inteira revelam uma verdade que ninguém estava pronto para ouvir.',
  },
  {
    id:          6,
    titulo:      'O Código Vermelho',
    genero:      'Thriller',
    ano:         2024,
    avaliacao:   8.9,
    duracao:     '2h 12m',
    capa:        'https://picsum.photos/300/450?random=606',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Uma mensagem criptografada leva um detetive ao centro de uma conspiração global implacável.',
  },
  {
    id:          7,
    titulo:      'Além do Horizonte',
    genero:      'Aventura',
    ano:         2023,
    avaliacao:   7.6,
    duracao:     '2h 01m',
    capa:        'https://picsum.photos/300/450?random=707',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Uma expedição audaciosa ao coração da Amazônia esconde revelações que mudarão a história da humanidade.',
  },
  {
    id:          8,
    titulo:      'Noite Eterna',
    genero:      'Terror',
    ano:         2024,
    avaliacao:   8.5,
    duracao:     '1h 53m',
    capa:        'https://picsum.photos/300/450?random=808',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Quando o sol se pôs pela última vez, os sobreviventes perceberam que a escuridão trouxe consigo algo ancestral.',
  },
  {
    id:          9,
    titulo:      'Vértice Zero',
    genero:      'Ação',
    ano:         2023,
    avaliacao:   8.0,
    duracao:     '2h 20m',
    capa:        'https://picsum.photos/300/450?random=909',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Em um mundo onde a gravidade colapsa em zonas aleatórias, um piloto deve cruzar o caos para salvar sua filha.',
  },
  {
    id:          10,
    titulo:      'A Última Profecia',
    genero:      'Fantasia',
    ano:         2022,
    avaliacao:   9.3,
    duracao:     '2h 48m',
    capa:        'https://picsum.photos/300/450?random=110',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Escrita há mil anos, a profecia nunca foi compreendida — até que uma jovem vidente nasce com o dom de lê-la.',
  },
  {
    id:          11,
    titulo:      'Pulsar',
    genero:      'Ficção Científica',
    ano:         2024,
    avaliacao:   7.9,
    duracao:     '1h 44m',
    capa:        'https://picsum.photos/300/450?random=211',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Em 2087, uma anomalia eletromagnética começa a reescrever as memórias de toda a população de uma metrópole.',
  },
  {
    id:          12,
    titulo:      'Sangue e Coroa',
    genero:      'Drama Histórico',
    ano:         2023,
    avaliacao:   8.6,
    duracao:     '2h 30m',
    capa:        'https://picsum.photos/300/450?random=312',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Traição, amor e poder se entrelaçam na corte mais perigosa da Europa medieval. Apenas um sobreviverá.',
  },
  {
    id:          13,
    titulo:      'Matrix',
    genero:      'Ação',
    ano:         1999,
    avaliacao:   8.7,
    duracao:     '2h 16m',
    capa:        'assets/CAPAS DOS FILMES/matrix.jpg',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'Um hacker descobre que a realidade é uma simulação criada por máquinas para subjugar a humanidade.',
  },
  {
    id:          14,
    titulo:      'A Origem',
    genero:      'Ficção Científica',
    ano:         2010,
    avaliacao:   8.8,
    duracao:     '2h 28m',
    capa:        'assets/CAPAS DOS FILMES/a origem.jpg',
    url:         'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',
    descricao:   'Um ladrão especializado em extrair segredos do subconsciente recebe uma missão impossível: plantar uma ideia na mente de alguém.',
  },
  {
    id:          15,
    titulo:      'A Lista de Schindler',
    genero:      'Drama Histórico',
    ano:         1993,
    avaliacao:   9.0,
    duracao:     '3h 15m',
    capa:        'assets/CAPAS DOS FILMES/A Lista de Schindler.jpg',
    url:         'https://www.w3schools.com/html/mov_bbb.mp4',
    descricao:   'O empresário alemão Oskar Schindler salva a vida de mais de mil judeus polonesos durante o Holocausto.',
  },
  {
    id:          16,
    titulo:      'Interestelar',
    genero:      'Ficção Científica',
    ano:         2014,
    avaliacao:   8.6,
    duracao:     '2h 49m',
    capa:        'assets/CAPAS DOS FILMES/interestelar.jpg',
    url:         'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',
    descricao:   'Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
  },
];

// ─── Estado Local ───────────────────────────────────────────────────────────────
let currentFilter = 'Todos';
let searchQuery   = '';

// ─── Inicialização ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Guard: verificar autenticação (auth.js deve ser carregado antes)
  if (typeof window.AUTH_UTILS === 'undefined') {
    console.error('[SELETO] auth.js não carregado.');
    return;
  }
  if (!window.AUTH_UTILS.requireAuth()) return;

  initVitrine();
});

function initVitrine() {
  renderUserBadge();
  renderMovies(MOVIES_DB);
  bindLogout();
  bindSearch();
  bindFilters();
  bindScrollHeader();
}

// ─── Renderização ───────────────────────────────────────────────────────────────

/** Exibe o badge do usuário logado no header */
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
 * Renderiza os cards de filmes no grid.
 * @param {Array} movies
 */
function renderMovies(movies) {
  const grid    = document.getElementById('movies-grid');
  const emptyEl = document.getElementById('empty-state');

  if (!grid) return;

  // Limpa o grid
  grid.innerHTML = '';

  if (movies.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  // Cria os cards
  movies.forEach((movie, index) => {
    const card = createMovieCard(movie, index);
    grid.appendChild(card);
  });
}

/**
 * Cria o elemento HTML de um card de filme.
 * @param {Object} movie
 * @param {number} index
 * @returns {HTMLElement}
 */
function createMovieCard(movie, index) {
  const card = document.createElement('a');
  card.className   = 'movie-card';
  card.href        = `player.html?filme=${movie.id}`;
  card.setAttribute('aria-label', `Assistir ${movie.titulo}`);
  // Atraso escalonado para animação de entrada
  card.style.animationDelay = `${index * 0.06}s`;

  // Estrelas — converte avaliação para string visual
  const stars = getStarsHTML(movie.avaliacao);

  card.innerHTML = `
    <div class="movie-thumb">
      <img
        src="${movie.capa}"
        alt="Capa de ${movie.titulo}"
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
        <span class="rating" title="Avaliação ${movie.avaliacao}/10">
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

/** Gera HTML de estrelas baseado na avaliação */
function getStarsHTML(rating) {
  const full = Math.floor(rating / 2);
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += `<span style="color:${i < full ? '#f0a500' : '#444'}"">★</span>`;
  }
  return html;
}

// ─── Filtros ────────────────────────────────────────────────────────────────────

/** Inicializa os botões de filtro de gênero */
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

/** Aplica busca + filtro de gênero */
function applyFilters() {
  let filtered = MOVIES_DB;

  // Filtro de gênero
  if (currentFilter !== 'Todos') {
    filtered = filtered.filter(m => m.genero === currentFilter);
  }

  // Busca por título
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(m =>
      m.titulo.toLowerCase().includes(q) ||
      m.genero.toLowerCase().includes(q)
    );
  }

  renderMovies(filtered);
}

// ─── Busca ──────────────────────────────────────────────────────────────────────

function bindSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  // Debounce simples para evitar re-render excessivo
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
    showToast('Até logo! Sessão encerrada.', 'info');
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
 * Exibe um toast de notificação temporário.
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

  // Mostra
  requestAnimationFrame(() => toast.classList.add('show'));

  // Esconde após 3s
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Exporta para escopo global (uso em player.js e outros)
window.SELETO_VITRINE = { MOVIES_DB, showToast };
