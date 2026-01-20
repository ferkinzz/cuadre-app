import React, { useState } from 'react';
import { savePurchase } from '../api/firebase';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Snackbar, Alert } from '@mui/material';

function PurchasesPage() {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('otros');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

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
      setFeedback({ open: true, message: 'Compra registrada con éxito!', severity: 'success' });
      // Limpiar formulario
      setItem('');
      setCategory('otros');
      setAmount('');
    } catch (error) {
      console.error("Error al guardar la compra: ", error);
      setFeedback({ open: true, message: 'Error al registrar la compra.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback({ ...feedback, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Compra
      </Typography>
      <TextField label="Insumo (ej. 1kg de pollo)" variant="outlined" value={item} onChange={(e) => setItem(e.target.value)} required />
      <TextField label="Monto Gastado" variant="outlined" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <FormControl fullWidth>
        <InputLabel id="category-select-label">Categoría</InputLabel>
        <Select labelId="category-select-label" id="category-select" value={category} label="Categoría" onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="tortilla">Tortilla</MenuItem>
          <MenuItem value="salsa">Salsa</MenuItem>
          <MenuItem value="proteina">Proteína</MenuItem>
          <MenuItem value="gas">Gas</MenuItem>
          <MenuItem value="desechables">Desechables</MenuItem>
          <MenuItem value="otros">Otros</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ p: 1.5 }}>
        {isSubmitting ? 'Guardando...' : 'Guardar Compra'}
      </Button>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PurchasesPage;
