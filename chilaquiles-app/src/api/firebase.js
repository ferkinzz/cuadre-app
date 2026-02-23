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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "VITE_FIREBASE_API_KEY no está definida. Revisa tus variables de entorno (.env.local o la configuración de despliegue)."
  );
}

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
 */
const saveOrder = (orderData) => {
  return addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

/**
 * Guarda una nueva compra en la colección 'purchases'
 */
const savePurchase = (purchaseData) => {
  return addDoc(collection(db, "purchases"), {
    ...purchaseData,
    date: Timestamp.fromDate(new Date(purchaseData.date)),
  });
};

/**
 * Obtiene las ventas y compras del día de hoy.
 */
const getDailyData = async () => {
  const { startDate, endDate } = getDateRange("day", new Date());

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(query(collection(db, "orders"), where("createdAt", ">=", startDate), where("createdAt", "<=", endDate))),
    getDocs(query(collection(db, "purchases"), where("date", ">=", startDate), where("date", "<=", endDate))),
  ]);

  return {
    orders: ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    purchases: purchasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
};

/**
 * Helper: calcula el rango de fechas según el período.
 * @param {string} period - 'day', 'week', 'month', 'year', o 'total'
 * @param {Date} [date] - Fecha de referencia (solo relevante para 'day')
 * @returns {{ startDate: Date|null, endDate: Date|null }}
 */
const getDateRange = (period, date = new Date()) => {
  if (period === "total") {
    return { startDate: null, endDate: null };
  }

  if (period === "day") {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  const now = new Date();
  let startDate;

  if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  return { startDate, endDate: null };
};

/**
 * Obtiene datos históricos para un período dado.
 * @param {string} period - 'day', 'week', 'month', 'year', o 'total'
 * @param {Date} [date] - Fecha de referencia (solo se usa cuando period === 'day')
 */
export const getHistoricalData = async (period, date) => {
  const { startDate, endDate } = getDateRange(period, date);

  let ordersQuery;
  let purchasesQuery;

  if (!startDate) {
    // 'total': sin filtro de fecha
    ordersQuery = query(collection(db, "orders"));
    purchasesQuery = query(collection(db, "purchases"));
  } else if (endDate) {
    // 'day': rango cerrado
    ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate)
    );
    purchasesQuery = query(
      collection(db, "purchases"),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
  } else {
    // 'week', 'month', 'year': desde startDate hasta ahora
    ordersQuery = query(collection(db, "orders"), where("createdAt", ">=", startDate));
    purchasesQuery = query(collection(db, "purchases"), where("date", ">=", startDate));
  }

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(ordersQuery),
    getDocs(purchasesQuery),
  ]);

  const orders = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const purchases = purchasesSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.date.toDate() - a.date.toDate());

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
