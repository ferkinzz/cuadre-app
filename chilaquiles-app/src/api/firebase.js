import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
  setDoc,
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
  throw new Error("Falta API KEY Firebase");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* =======================
   AUTH
======================= */

const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);

/* =======================
   GUARDAR DATA
======================= */

const saveOrder = (orderData) => {
  return addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: Timestamp.fromDate(new Date()),
  });
};

const savePurchase = (purchaseData) => {
  return addDoc(collection(db, "purchases"), {
    ...purchaseData,

    date: Timestamp.fromDate(purchaseData.date),
  });
};

/* =======================
   RANGO FECHAS
======================= */

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
  }
  else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  else if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  // FIX importante
  startDate.setHours(0,0,0,0);

  return { startDate, endDate: null };
};
const getDailyData = async () => {
  const { startDate, endDate } = getDateRange("day", new Date());

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(db, "orders"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate)
      )
    ),
    getDocs(
      query(
        collection(db, "purchases"),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      )
    ),
  ]);

  return {
    orders: ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })),
    purchases: purchasesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })),
  };
};
/* =======================
   FETCH HISTÓRICO
======================= */

export const getHistoricalData = async (period, date) => {
  const { startDate, endDate } = getDateRange(period, date);

  let ordersQuery;
  let purchasesQuery;

  if (!startDate) {
    ordersQuery = query(collection(db, "orders"));
    purchasesQuery = query(collection(db, "purchases"));
  }
  else if (endDate) {
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
  }
  else {
    ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", startDate)
    );

    purchasesQuery = query(
      collection(db, "purchases"),
      where("date", ">=", startDate)
    );
  }

  const [ordersSnapshot, purchasesSnapshot] = await Promise.all([
    getDocs(ordersQuery),
    getDocs(purchasesQuery),
  ]);

  const orders = ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const purchases = purchasesSnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort((a,b)=> b.date.toDate() - a.date.toDate());

  return { orders, purchases };
};

/* =======================
   CONFIG DE LA APP
======================= */

const CONFIG_DOC = doc(db, "config", "app");

const DEFAULT_CONFIG = {
  appName: "Cuadre",
  backgroundImage: "",
  products: [
    { id: "producto_1", name: "Producto 1", price: 50 },
    { id: "producto_2", name: "Producto 2", price: 100 },
  ],
  categories: ["materia prima", "renta", "servicios", "transporte", "otros"],
};

const getAppConfig = async () => {
  const snap = await getDoc(CONFIG_DOC);
  if (!snap.exists()) return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...snap.data() };
};

const saveAppConfig = (config) => setDoc(CONFIG_DOC, config);

/* =======================
   EXPORTS
======================= */

export {
  auth,
  db,
  login,
  onAuthChange,
  saveOrder,
  savePurchase,
  getDailyData,
  getAppConfig,
  saveAppConfig,
  DEFAULT_CONFIG,
};