import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// Tu configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verificación para desarrolladores: Lanza un error si las variables de entorno no están configuradas.
if (!firebaseConfig.apiKey) {
  throw new Error(
    "VITE_FIREBASE_API_KEY no está definida. Revisa tus variables de entorno (.env.local o la configuración de despliegue)."
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Funciones de Autenticación ---
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// --- Funciones de la Base de Datos ---

/**
 * Guarda una nueva venta en la colección 'orders'
 * @param {object} orderData - Datos de la venta
 */
const saveOrder = (orderData) => {
  const orderWithTimestamp = {
    ...orderData,
    createdAt: Timestamp.fromDate(new Date()),
  };
  return addDoc(collection(db, "orders"), orderWithTimestamp);
};

/**
 * Guarda una nueva compra en la colección 'purchases'
 * @param {object} purchaseData - Datos de la compra
 */
const savePurchase = (purchaseData) => {
  const purchaseWithTimestamp = {
    ...purchaseData,
    date: Timestamp.fromDate(new Date(purchaseData.date)), // Asegurarse que la fecha es un Timestamp
  };
  return addDoc(collection(db, "purchases"), purchaseWithTimestamp);
};

/**
 * Obtiene las ventas y compras para una fecha específica (hoy)
 */
const getDailyData = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Query para ventas del día
  const ordersQuery = query(
    collection(db, "orders"),
    where("createdAt", ">=", startOfDay),
    where("createdAt", "<=", endOfDay)
  );

  // Query para compras del día
  const purchasesQuery = query(
    collection(db, "purchases"),
    where("date", ">=", startOfDay),
    where("date", "<=", endOfDay)
  );

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(ordersQuery),
    getDocs(purchasesQuery),
  ]);

  const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const purchases = purchasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return { orders, purchases };
};

/**
 * Obtiene datos de un período de tiempo (semana, mes, año) o todos los datos.
 * @param {string} period - 'week', 'month', 'year', o 'total'
 */
export const getHistoricalData = async (period) => {
  const now = new Date();
  let startDate;

  // Definir la fecha de inicio según el período
  if (period === 'week') {
    const firstDayOfWeek = now.getDate() - now.getDay();
    startDate = new Date(now.setDate(firstDayOfWeek));
    startDate.setHours(0, 0, 0, 0);
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  // Construir las queries
  let ordersQuery;
  let purchasesQuery;

  if (period === 'total') {
    ordersQuery = query(collection(db, 'orders'));
    purchasesQuery = query(collection(db, 'purchases'));
  } else {
    ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate)
    );
    purchasesQuery = query(
      collection(db, 'purchases'),
      where('date', '>=', startDate)
    );
  }

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(ordersQuery),
    getDocs(purchasesQuery),
  ]);

  const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const purchases = purchasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Ordenar compras por fecha para una mejor visualización
  purchases.sort((a, b) => b.date.toDate() - a.date.toDate());

  return { orders, purchases };
};

export {
  auth,
  db,
  login,
  onAuthChange,
  saveOrder,
  savePurchase,
  getDailyData,
};
