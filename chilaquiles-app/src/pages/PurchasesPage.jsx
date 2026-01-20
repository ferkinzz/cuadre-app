import React, { useState } from 'react';
import { savePurchase } from '../api/firebase';

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: 'auto' },
  input: { padding: '10px', fontSize: '1rem' },
  button: { padding: '15px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none' },
};

function PurchasesPage() {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('otros');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !amount || isSubmitting) return;

    setIsSubmitting(true);
    const purchaseData = {
      item,
      category,
      amount: parseFloat(amount),
      date: new Date(), // Enviar el objeto Date completo
    };

    try {
      await savePurchase(purchaseData);
      alert('Compra registrada con éxito!');
      // Limpiar formulario
      setItem('');
      setCategory('otros');
      setAmount('');
    } catch (error) {
      console.error("Error al guardar la compra: ", error);
      alert('Error al registrar la compra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h1>Registrar Compra</h1>
      <input type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Insumo (ej. 1kg de pollo)" required style={styles.input} />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Monto Gastado" required style={styles.input} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
        <option value="tortilla">Tortilla</option>
        <option value="salsa">Salsa</option>
        <option value="proteina">Proteína</option>
        <option value="gas">Gas</option>
        <option value="desechables">Desechables</option>
        <option value="otros">Otros</option>
      </select>
      <button type="submit" disabled={isSubmitting} style={styles.button}>
        {isSubmitting ? 'Guardando...' : 'Guardar Compra'}
      </button>
    </form>
  );
}

export default PurchasesPage;
