import React, { useState, useEffect } from 'react';
import { getDailyData } from '../api/firebase';

const styles = {
  summary: { maxWidth: '600px', margin: 'auto', textAlign: 'center' },
  card: { border: '1px solid #ccc', padding: '20px', margin: '10px 0', borderRadius: '8px' },
  total: { fontSize: '2rem', fontWeight: 'bold' },
  profit: { color: 'green' },
  loss: { color: 'red' },
};

function SummaryPage() {
  const [dailySales, setDailySales] = useState(0);
  const [dailyPurchases, setDailyPurchases] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { orders, purchases } = await getDailyData();
        const totalSales = orders.reduce((sum, order) => sum + order.price, 0);
        const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
        
        setDailySales(totalSales);
        setDailyPurchases(totalPurchases);
      } catch (error) {
        console.error("Error obteniendo datos del día:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando resumen del día...</p>;
  }

  const estimatedProfit = dailySales - dailyPurchases;

  return (
    <div style={styles.summary}>
      <h1>Resumen del Día</h1>
      <div style={styles.card}>
        <h2>Ventas Totales</h2>
        <p style={{ ...styles.total, color: '#007bff' }}>${dailySales.toFixed(2)}</p>
      </div>
      <div style={styles.card}>
        <h2>Compras Totales</h2>
        <p style={{ ...styles.total, color: '#dc3545' }}>${dailyPurchases.toFixed(2)}</p>
      </div>
      <div style={styles.card}>
        <h2>Ganancia Estimada</h2>
        <p style={{ ...styles.total, ...(estimatedProfit >= 0 ? styles.profit : styles.loss) }}>
          ${estimatedProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default SummaryPage;
