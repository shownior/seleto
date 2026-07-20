// Configuración de Firebase — SELETO
const firebaseConfig = {
  apiKey:            "AIzaSyCLiCy9dycUSORxwMr-JDsB5ZwXSKwRh8k",
  authDomain:        "seletomovies.firebaseapp.com",
  projectId:         "seletomovies",
  storageBucket:     "seletomovies.firebasestorage.app",
  messagingSenderId: "43516622185",
  appId:             "1:43516622185:web:46fc6b3db7b3af3d5eb9f8",
  measurementId:     "G-NWRBHGGRF3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia de autenticación
const auth = firebase.auth();
