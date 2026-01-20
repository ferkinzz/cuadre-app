import React, { useState } from 'react';
import { saveOrder } from '../api/firebase';

// Estilos para priorizar UX en móvil
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: 'auto' },
  button: { padding: '20px', fontSize: '1.5rem', cursor: 'pointer' },
  paymentButtons: { display: 'flex', gap: '1rem' },
};

const PRODUCT_PRICES = {
  verdes: 80,
  rojos: 80,
  especiales: 100,
};

function SalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSale = async (type, price, payment) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const orderData = {
      type,
      price,
      payment,
      extras: [], // MVP simple, sin extras por ahora
    };

    try {
      await saveOrder(orderData);
      alert(`Venta de ${type} (${payment}) registrada por $${price}`);
    } catch (error) {
      console.error("Error al guardar la venta: ", error);
      alert("Hubo un error al registrar la venta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Registrar Venta</h1>
      
      {/* Venta de Chilaquiles Verdes */}
      <div style={styles.paymentButtons}>
        <button style={styles.button} onClick={() => handleSale('verdes', PRODUCT_PRICES.verdes, 'efectivo')}>Verdes (Efectivo)</button>
        <button style={styles.button} onClick={() => handleSale('verdes', PRODUCT_PRICES.verdes, 'transferencia')}>Verdes (Transf.)</button>
      </div>

      {/* Venta de Chilaquiles Rojos */}
      <div style={styles.paymentButtons}>
        <button style={styles.button} onClick={() => handleSale('rojos', PRODUCT_PRICES.rojos, 'efectivo')}>Rojos (Efectivo)</button>
        <button style={styles.button} onClick={() => handleSale('rojos', PRODUCT_PRICES.rojos, 'transferencia')}>Rojos (Transf.)</button>
      </div>

      {/* Venta de Especiales */}
      <div style={styles.paymentButtons}>
        <button style={styles.button} onClick={() => handleSale('especiales', PRODUCT_PRICES.especiales, 'efectivo')}>Especial (Efectivo)</button>
        <button style={styles.button} onClick={() => handleSale('especiales', PRODUCT_PRICES.especiales, 'transferencia')}>Especial (Transf.)</button>
      </div>
    </div>
  );
}

export default SalesPage;
