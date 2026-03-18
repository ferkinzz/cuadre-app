import React, { useState } from 'react';
import { savePurchase } from '../api/firebase';
import { useConfig } from '../ConfigContext';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, Snackbar, Alert } from '@mui/material';

function PurchasesPage() {
  const { config } = useConfig();
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  // Si la categoría actual ya no existe en config, usar la primera disponible
  const currentCategory = config.categories.includes(category) ? category : (config.categories[0] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !amount || isSubmitting) return;

    setIsSubmitting(true);
    const purchaseData = {
      item,
      category: currentCategory,
      amount: parseFloat(amount),
      date: new Date(),
    };

    try {
      await savePurchase(purchaseData);
      setFeedback({ open: true, message: 'Compra registrada con éxito!', severity: 'success' });
      setItem('');
      setCategory('');
      setAmount('');
    } catch (error) {
      console.error("Error al guardar la compra: ", error);
      setFeedback({ open: true, message: 'Error al registrar la compra.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
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
        <Select
          labelId="category-select-label"
          value={currentCategory}
          label="Categoría"
          onChange={(e) => setCategory(e.target.value)}
        >
          {config.categories.map(cat => (
            <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ p: 1.5 }}>
        {isSubmitting ? 'Guardando...' : 'Guardar Compra'}
      </Button>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback(f => ({ ...f, open: false }))}>
        <Alert severity={feedback.severity} sx={{ width: '100%' }}>{feedback.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default PurchasesPage;
