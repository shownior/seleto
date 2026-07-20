/**
 * SELETO — Lógica de Autenticação
 * Arquivo: assets/js/auth.js
 *
 * Responsabilidades:
 *  - Gerenciar login / logout
 *  - Guardar / ler token do localStorage
 *  - Redirecionar usuários não autenticados
 *  - Exportar helpers de auth usados por outros scripts
 */

'use strict';

// ─── Constantes ────────────────────────────────────────────────────────────────
const AUTH = {
  TOKEN_KEY:   'seleto_auth_token',
  USER_KEY:    'seleto_user',
  CREDENTIAL: {
    email:    'admin@seleto.com',
    password: '123456',
  },
  PAGES: {
    login:    'index.html',
    vitrine:  'vitrine.html',
    player:   'player.html',
  },
};

// ─── Token Helpers ──────────────────────────────────────────────────────────────

/**
 * Verifica se há token válido no localStorage.
 * @returns {boolean}
 */
function isAuthenticated() {
  const token = localStorage.getItem(AUTH.TOKEN_KEY);
  return !!token && token.startsWith('seleto_');
}

/**
 * Salva token de sessão e dados do usuário.
 * @param {string} email
 */
function saveSession(email) {
  const token = `seleto_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const user  = { email, name: email.split('@')[0] };
  localStorage.setItem(AUTH.TOKEN_KEY, token);
  localStorage.setItem(AUTH.USER_KEY,  JSON.stringify(user));
}

/**
 * Remove token e dados do usuário (logout).
 */
function clearSession() {
  localStorage.removeItem(AUTH.TOKEN_KEY);
  localStorage.removeItem(AUTH.USER_KEY);
}

/**
 * Retorna o objeto do usuário logado ou null.
 * @returns {{ email: string, name: string } | null}
 */
function getUser() {
  try {
    const raw = localStorage.getItem(AUTH.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Guards ─────────────────────────────────────────────────────────────────────

/**
 * Deve ser chamado em páginas PROTEGIDAS (vitrine, player).
 * Se o usuário não estiver logado, redireciona ao login.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    // Salva a URL atual para redirecionar após o login (UX bonus)
    sessionStorage.setItem('seleto_redirect', window.location.href);
    window.location.replace(AUTH.PAGES.login);
    return false;
  }
  return true;
}

/**
 * Deve ser chamado na página de LOGIN.
 * Se o usuário já estiver logado, redireciona à vitrine.
 */
function redirectIfLoggedIn() {
  if (isAuthenticated()) {
    window.location.replace(AUTH.PAGES.vitrine);
  }
}

// ─── Logout ─────────────────────────────────────────────────────────────────────

/**
 * Executa logout: limpa sessão e redireciona ao login.
 */
function logout() {
  clearSession();
  window.location.replace(AUTH.PAGES.login);
}

// ─── Lógica da Página de Login ──────────────────────────────────────────────────

/**
 * Inicializa todos os comportamentos da tela de login.
 * Deve ser chamado quando o DOM estiver pronto.
 */
function initLoginPage() {
  // Se já logado, vai para a vitrine
  redirectIfLoggedIn();

  const form      = document.getElementById('login-form');
  const emailEl   = document.getElementById('email');
  const passwordEl= document.getElementById('password');
  const btn       = document.getElementById('btn-login');
  const errorEl   = document.getElementById('login-error');

  if (!form) return; // Segurança: não está na página de login

  // ── Validação em tempo real ──
  [emailEl, passwordEl].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      hideError();
    });
  });

  // ── Submit ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email    = emailEl.value.trim();
    const password = passwordEl.value;

    // Validação de campos vazios
    let hasError = false;
    if (!email) {
      emailEl.classList.add('error');
      hasError = true;
    }
    if (!password) {
      passwordEl.classList.add('error');
      hasError = true;
    }
    if (hasError) {
      showError('Preencha todos os campos.');
      return;
    }

    // Loading state
    setLoading(btn, true);

    // Simula latência de rede (200–600ms)
    await delay(200 + Math.random() * 400);

    // Validação das credenciais
    if (
      email    === AUTH.CREDENTIAL.email &&
      password === AUTH.CREDENTIAL.password
    ) {
      saveSession(email);
      // Redireciona (com possível URL salva)
      const redirect = sessionStorage.getItem('seleto_redirect');
      sessionStorage.removeItem('seleto_redirect');
      window.location.replace(redirect && !redirect.includes('index') ? redirect : AUTH.PAGES.vitrine);
    } else {
      setLoading(btn, false);
      emailEl.classList.add('error');
      passwordEl.classList.add('error');
      showError('E-mail ou senha incorretos. Tente novamente.');
      // Shake animado no card
      const card = document.querySelector('.login-card');
      if (card) shake(card);
    }
  });

  // ── Helpers da UI ──
  function showError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('show');
    }
  }
  function hideError() {
    if (errorEl) errorEl.classList.remove('show');
  }
}

// ─── Helpers Gerais ─────────────────────────────────────────────────────────────

/** Simula delay assíncrono */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Alterna o estado de loading de um botão */
function setLoading(btn, isLoading) {
  if (!btn) return;
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/** Animação de shake para erros */
function shake(el) {
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 400, easing: 'ease-in-out' }
  );
}

// ─── Exporta para o escopo global ───────────────────────────────────────────────
// (sem módulos ES — compatibilidade estática / GitHub Pages)
window.AUTH_UTILS = {
  isAuthenticated,
  requireAuth,
  redirectIfLoggedIn,
  getUser,
  logout,
  initLoginPage,
};

// ─── Auto-inicialização ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Se estivermos na página de login, inicializa
  if (document.getElementById('login-form')) {
    initLoginPage();
  }
});
