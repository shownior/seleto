/**
 * SELETO — Lógica do Player de Vídeo
 * Arquivo: assets/js/player.js
 *
 * Responsabilidades:
 *  - Verificar autenticação
 *  - Ler parâmetro ?filme= da URL
 *  - Carregar dados do filme a partir do banco local
 *  - Inicializar o elemento <video>
 *  - Renderizar filmes relacionados
 *  - Controlar o botão Voltar
 */

'use strict';

// ─── Banco local (espelho de vitrine.js) ────────────────────────────────────────
// Nota: Em produção real, isso viria de uma API. Aqui compartilhamos
// o array definido em vitrine.js via window.SELETO_VITRINE.MOVIES_DB,
// mas como player.html pode carregar sem vitrine.js, definimos aqui também.
const PLAYER_MOVIES_DB = [
  { id: 1,  titulo: 'Aventura Sombria',        genero: 'Ação',             ano: 2024, avaliacao: 8.4, duracao: '2h 18m', capa: 'https://picsum.photos/300/450?random=101', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Uma jornada épica por terras desconhecidas onde cada sombra esconde um segredo mortal.' },
  { id: 2,  titulo: 'O Último Nexus',           genero: 'Ficção Científica', ano: 2023, avaliacao: 9.1, duracao: '2h 34m', capa: 'https://picsum.photos/300/450?random=202', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Quando a última conexão entre mundos paralelos é ameaçada, um único homem deve salvar o multiverso.' },
  { id: 3,  titulo: 'Cidade dos Sonhos',        genero: 'Drama',            ano: 2024, avaliacao: 7.8, duracao: '1h 58m', capa: 'https://picsum.photos/300/450?random=303', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Nas ruas luminosas de Neo-Lisboa, uma artista busca sua identidade em um mundo que esqueceu de sonhar.' },
  { id: 4,  titulo: 'Projeto Aurora',           genero: 'Suspense',         ano: 2023, avaliacao: 8.7, duracao: '2h 05m', capa: 'https://picsum.photos/300/450?random=404', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Um experimento secreto do governo ameaça transbordar para a realidade. O tempo está acabando.' },
  { id: 5,  titulo: 'Fragmentos do Passado',    genero: 'Drama',            ano: 2022, avaliacao: 8.2, duracao: '1h 47m', capa: 'https://picsum.photos/300/450?random=505', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Memórias fragmentadas de uma vida inteira revelam uma verdade que ninguém estava pronto para ouvir.' },
  { id: 6,  titulo: 'O Código Vermelho',        genero: 'Thriller',         ano: 2024, avaliacao: 8.9, duracao: '2h 12m', capa: 'https://picsum.photos/300/450?random=606', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Uma mensagem criptografada leva um detetive ao centro de uma conspiração global implacável.' },
  { id: 7,  titulo: 'Além do Horizonte',        genero: 'Aventura',         ano: 2023, avaliacao: 7.6, duracao: '2h 01m', capa: 'https://picsum.photos/300/450?random=707', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Uma expedição audaciosa ao coração da Amazônia esconde revelações que mudarão a história da humanidade.' },
  { id: 8,  titulo: 'Noite Eterna',             genero: 'Terror',           ano: 2024, avaliacao: 8.5, duracao: '1h 53m', capa: 'https://picsum.photos/300/450?random=808', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Quando o sol se pôs pela última vez, os sobreviventes perceberam que a escuridão trouxe consigo algo ancestral.' },
  { id: 9,  titulo: 'Vértice Zero',             genero: 'Ação',             ano: 2023, avaliacao: 8.0, duracao: '2h 20m', capa: 'https://picsum.photos/300/450?random=909', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Em um mundo onde a gravidade colapsa em zonas aleatórias, um piloto deve cruzar o caos para salvar sua filha.' },
  { id: 10, titulo: 'A Última Profecia',        genero: 'Fantasia',         ano: 2022, avaliacao: 9.3, duracao: '2h 48m', capa: 'https://picsum.photos/300/450?random=110', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Escrita há mil anos, a profecia nunca foi compreendida — até que uma jovem vidente nasce com o dom de lê-la.' },
  { id: 11, titulo: 'Pulsar',                   genero: 'Ficção Científica', ano: 2024, avaliacao: 7.9, duracao: '1h 44m', capa: 'https://picsum.photos/300/450?random=211', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Em 2087, uma anomalia eletromagnética começa a reescrever as memórias de toda a população de uma metrópole.' },
  { id: 12, titulo: 'Sangue e Coroa',           genero: 'Drama Histórico',  ano: 2023, avaliacao: 8.6, duracao: '2h 30m', capa: 'https://picsum.photos/300/450?random=312', url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Traição, amor e poder se entrelaçam na corte mais perigosa da Europa medieval. Apenas um sobreviverá.' },
  { id: 13, titulo: 'Matrix',                   genero: 'Ação',             ano: 1999, avaliacao: 8.7, duracao: '2h 16m', capa: 'assets/CAPAS DOS FILMES/matrix.jpg',        url: 'https://www.w3schools.com/html/mov_bbb.mp4',  descricao: 'Um hacker descobre que a realidade é uma simulação criada por máquinas para subjugar a humanidade.' },
  { id: 14, titulo: 'A Origem',                 genero: 'Ficção Científica',ano: 2010, avaliacao: 8.8, duracao: '2h 28m', capa: 'assets/CAPAS DOS FILMES/a origem.jpg',      url: 'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',  descricao: 'Um ladrão especializado em extrair segredos do subconsciente recebe uma missão impossível: plantar uma ideia na mente de alguém.' },
  { id: 15, titulo: 'A Lista de Schindler',     genero: 'Drama Histórico',  ano: 1993, avaliacao: 9.0, duracao: '3h 15m', capa: 'assets/CAPAS DOS FILMES/A Lista de Schindler.jpg', url: 'https://www.w3schools.com/html/mov_bbb.mp4', descricao: 'O empresário alemão Oskar Schindler salva a vida de mais de mil judeus polonesos durante o Holocausto.' },
  { id: 16, titulo: 'Interestelar',             genero: 'Ficção Científica',ano: 2014, avaliacao: 8.6, duracao: '2h 49m', capa: 'assets/CAPAS DOS FILMES/interestelar.jpg',  url: 'https://drive.google.com/file/d/1XW5guEn38LX8qPcBFA_611tfxuM6dU80/preview',  descricao: 'Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.' },
];

// ─── Inicialização ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Guard: checar auth.js carregado
  if (typeof window.AUTH_UTILS === 'undefined') {
    console.error('[SELETO] auth.js não carregado antes de player.js');
    return;
  }

  // Guard: autenticação
  if (!window.AUTH_UTILS.requireAuth()) return;

  initPlayer();
});

function initPlayer() {
  const movieId = getMovieIdFromURL();

  if (!movieId) {
    showPlayerError('Nenhum filme especificado.');
    return;
  }

  const movie = findMovie(movieId);

  if (!movie) {
    showPlayerError(`Filme com ID "${movieId}" não encontrado.`);
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
 * Lê o parâmetro `?filme=` da URL atual.
 * @returns {number|null}
 */
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('filme');
  const id     = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

/**
 * Busca um filme pelo ID no banco local.
 * @param {number} id
 * @returns {Object|undefined}
 */
function findMovie(id) {
  return PLAYER_MOVIES_DB.find(m => m.id === id);
}

// ─── Renderização ───────────────────────────────────────────────────────────────

/**
 * Preenche o painel de informações do filme.
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
 * Inicializa o elemento <video> com a URL do filme.
 * @param {Object} movie
 */
function initVideoElement(movie) {
  const videoEl = document.getElementById('main-video');
  if (!videoEl) return;

  videoEl.src = movie.url;

  // Tratamento de erros do vídeo
  videoEl.addEventListener('error', () => {
    console.warn('[SELETO Player] Erro ao carregar vídeo:', movie.url);
    showVideoError(videoEl);
  });

  // Ao carregar metadados, log de duração real
  videoEl.addEventListener('loadedmetadata', () => {
    console.info(`[SELETO Player] "${movie.titulo}" carregado — duração: ${videoEl.duration.toFixed(1)}s`);
  });

  // Salva progresso no localStorage (feature bônus)
  videoEl.addEventListener('timeupdate', () => {
    if (videoEl.duration && videoEl.currentTime > 5) {
      const key = `seleto_progress_${movie.id}`;
      localStorage.setItem(key, videoEl.currentTime.toFixed(1));
    }
  });

  // Retoma do ponto salvo (se houver)
  const savedProgress = parseFloat(localStorage.getItem(`seleto_progress_${movie.id}`));
  if (savedProgress > 5) {
    videoEl.currentTime = savedProgress;
  }
}

/**
 * Renderiza a seção "Você Também Pode Gostar".
 * @param {Object} currentMovie
 */
function renderRelatedMovies(currentMovie) {
  const container = document.getElementById('related-grid');
  if (!container) return;

  // Filtra: mesmo gênero OU aleatórios — exclui o atual — max 4
  const related = PLAYER_MOVIES_DB
    .filter(m => m.id !== currentMovie.id)
    .sort((a, b) => {
      // Prioriza mesmo gênero
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
    card.setAttribute('aria-label', `Assistir ${movie.titulo}`);
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

// ─── Botão Voltar ───────────────────────────────────────────────────────────────

function bindBackButton() {
  const btnVoltar = document.getElementById('btn-voltar');
  if (!btnVoltar) return;

  btnVoltar.addEventListener('click', (e) => {
    e.preventDefault();
    // Pausa o vídeo antes de sair
    const videoEl = document.getElementById('main-video');
    if (videoEl) videoEl.pause();
    window.location.href = 'vitrine.html';
  });
}

// ─── Erros ──────────────────────────────────────────────────────────────────────

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
        <a href="vitrine.html" class="btn btn-primary" style="margin-top:24px;">← Voltar ao Catálogo</a>
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
    <span>Não foi possível carregar o vídeo.</span>
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
