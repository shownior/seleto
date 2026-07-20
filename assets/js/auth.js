/**
 * SELETO — Autenticación con Firebase
 * Archivo: assets/js/auth.js
 *
 * Responsabilidades:
 *  - Gestionar login / logout con Firebase Auth
 *  - Verificar estado de autenticación
 *  - Redirigir usuarios no autenticados
 *  - Exportar helpers de auth usados por otros scripts
 */

'use strict';

// ─── Constantes ────────────────────────────────────────────────────────────────
const AUTH = {
  PAGES: {
    login:   'index.html',
    vitrine: 'vitrine.html',
    player:  'player.html',
  },
};

// ─── Verificar si hay usuario conectado ──────────────────────────────────────

/**
 * Verifica si hay un usuario autenticado en Firebase.
 * @returns {boolean}
 */
function isAuthenticated() {
  return typeof auth !== 'undefined' && auth.currentUser !== null;
}

// ─── Obtener datos del usuario ───────────────────────────────────────────────

/**
 * Retorna el objeto del usuario conectado o null.
 * @returns {{ email: string, name: string, uid: string } | null}
 */
function getUser() {
  if (typeof auth === 'undefined' || !auth.currentUser) return null;
  const u = auth.currentUser;
  return {
    email: u.email,
    name:  u.displayName || u.email.split('@')[0],
    uid:   u.uid,
  };
}

// ─── Guards ──────────────────────────────────────────────────────────────────

/**
 * Debe llamarse en páginas PROTEGIDAS (vitrine, player).
 * Si el usuario no está conectado, redirige al login.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    sessionStorage.setItem('seleto_redirect', window.location.href);
    window.location.replace(AUTH.PAGES.login);
    return false;
  }
  return true;
}

/**
 * Debe llamarse en la página de LOGIN.
 * Si el usuario ya está conectado, redirige a la vitrina.
 */
function redirectIfLoggedIn() {
  if (isAuthenticated()) {
    window.location.replace(AUTH.PAGES.vitrine);
  }
}

// ─── Login con Firebase ──────────────────────────────────────────────────────

/**
 * Inicia sesión con correo y contraseña usando Firebase Auth.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.auth.UserCredential>}
 */
async function loginWithEmail(email, password) {
  return await auth.signInWithEmailAndPassword(email, password);
}

/**
 * Registra un nuevo usuario con correo y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.auth.UserCredential>}
 */
async function registerWithEmail(email, password) {
  return await auth.createUserWithEmailAndPassword(email, password);
}

// ─── Logout ──────────────────────────────────────────────────────────────────

/**
 * Cierra sesión en Firebase y redirige al login.
 */
async function logout() {
  await auth.signOut();
  window.location.replace(AUTH.PAGES.login);
}

// ─── Listener de estado de autenticación ─────────────────────────────────────

/**
 * Registra un callback que se ejecuta cada vez que cambia el estado de auth.
 * @param {Function} callback
 */
function onAuthStateChanged(callback) {
  auth.onAuthStateChanged(callback);
}

// ─── Lógica de la Página de Login ────────────────────────────────────────────

/**
 * Inicializa todos los comportamientos de la pantalla de login.
 */
function initLoginPage() {
  const form       = document.getElementById('login-form');
  const emailEl    = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const btn        = document.getElementById('btn-login');
  const errorEl    = document.getElementById('login-error');
  const registerBtn= document.getElementById('btn-register');

  if (!form) return;

  // ── Validación en tiempo real ──
  [emailEl, passwordEl].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      hideError();
    });
  });

  // ── Login ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email    = emailEl.value.trim();
    const password = passwordEl.value;

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
      showError('Completa todos los campos.');
      return;
    }

    setLoading(btn, true);

    try {
      await loginWithEmail(email, password);

      const redirect = sessionStorage.getItem('seleto_redirect');
      sessionStorage.removeItem('seleto_redirect');
      window.location.replace(
        redirect && !redirect.includes('index') ? redirect : AUTH.PAGES.vitrine
      );

    } catch (error) {
      setLoading(btn, false);
      showError(getFirebaseError(error.code));
      emailEl.classList.add('error');
      passwordEl.classList.add('error');
      shake(document.querySelector('.login-card'));
    }
  });

  // ── Registro (si existe el botón) ──
  if (registerBtn) {
    registerBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      hideError();

      const email    = emailEl.value.trim();
      const password = passwordEl.value;

      let hasError = false;
      if (!email) {
        emailEl.classList.add('error');
        hasError = true;
      }
      if (!password || password.length < 6) {
        passwordEl.classList.add('error');
        hasError = true;
      }
      if (hasError) {
        showError('Correo válido y contraseña mínimo 6 caracteres.');
        return;
      }

      setLoading(registerBtn, true);

      try {
        await registerWithEmail(email, password);
        showError('¡Cuenta creada! Ahora puedes iniciar sesión.');
        hideError();
      } catch (error) {
        setLoading(registerBtn, false);
        showError(getFirebaseError(error.code));
      }
    });
  }

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

// ─── Mapear errores de Firebase ──────────────────────────────────────────────

function getFirebaseError(code) {
  const errors = {
    'auth/user-not-found':         'No existe una cuenta con este correo.',
    'auth/wrong-password':         'Contraseña incorrecta.',
    'auth/invalid-email':          'El correo electrónico no es válido.',
    'auth/user-disabled':          'Esta cuenta ha sido deshabilitada.',
    'auth/too-many-requests':      'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
    'auth/invalid-credential':     'Correo o contraseña incorrectos.',
    'auth/email-already-in-use':   'Este correo ya está registrado.',
    'auth/weak-password':          'La contraseña debe tener al menos 6 caracteres.',
    'auth/operation-not-allowed':  'Este método de inicio de sesión no está habilitado.',
  };
  return errors[code] || 'Error al iniciar sesión. Inténtalo de nuevo.';
}

// ─── Helpers Generales ───────────────────────────────────────────────────────

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

function shake(el) {
  if (!el) return;
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

// ─── Exporta al scope global ─────────────────────────────────────────────────

window.AUTH_UTILS = {
  isAuthenticated,
  requireAuth,
  redirectIfLoggedIn,
  getUser,
  logout,
  initLoginPage,
  onAuthStateChanged,
  loginWithEmail,
  registerWithEmail,
};

// ─── Auto-inicialización ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('login-form')) {
    initLoginPage();
  }
});
