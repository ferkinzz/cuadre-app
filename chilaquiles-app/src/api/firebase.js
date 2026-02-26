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
  throw new Error("Falta API KEY Firebase");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* =======================
   HELPER FECHA SEGURA
======================= */
const parseLocalDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

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

    // FIX timezone
    date: Timestamp.fromDate(parseLocalDate(purchaseData.date)),
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
   EXPORTS
======================= */

export {
  auth,
  db,
  login,
  onAuthChange,
  saveOrder,
  savePurchase,
};