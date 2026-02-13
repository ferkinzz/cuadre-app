import React, { useState } from 'react';
import { saveOrder } from '../api/firebase';
import { Button, Box, Typography, Snackbar, Alert, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PRODUCT_PRICES = {
  verdes: 50,
  rojos: 50,
  especiales: 100,
};

function SalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const handleSale = async (type, price, payment) => {
    if (isSubmitting || quantity <= 0) return;
    setIsSubmitting(true);
    
    const orderData = {
      type,
      price,
      payment,
      extras: [], // MVP simple, sin extras por ahora
    };

    try {
      const salePromises = [];
      for (let i = 0; i < quantity; i++) {
        salePromises.push(saveOrder(orderData));
      }
      await Promise.all(salePromises);

      const message = quantity > 1 ? `${quantity} ventas de ${type} (${payment}) registradas!` : `Venta de ${type} (${payment}) registrada!`;
      setFeedback({ open: true, message, severity: 'success' });
      setQuantity(1); // Reset quantity after successful sale
    } catch (error) {
      console.error("Error al guardar la venta: ", error);
      setFeedback({ open: true, message: 'Error al registrar la venta.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setFeedback({ ...feedback, open: false });
  };

  const renderSaleButtons = (type, price) => (
    <Box sx={{ mb: 2, p: 2, border: '1px solid grey', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom textTransform="capitalize">{type}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" color="primary" onClick={() => handleSale(type, price, 'efectivo')} disabled={isSubmitting} sx={{ p: 2, fontSize: '1.1rem' }}>Efectivo</Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" color="primary" onClick={() => handleSale(type, price, 'transferencia')} disabled={isSubmitting} sx={{ p: 2, fontSize: '1.1rem' }}>Transf.</Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Venta
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="quantity-select-label">Cantidad</InputLabel>
        <Select
          labelId="quantity-select-label"
          value={quantity}
          label="Cantidad"
          onChange={(e) => setQuantity(e.target.value)}
        >
          {[...Array(10).keys()].map(i => <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)}
        </Select>
      </FormControl>

      {renderSaleButtons('verdes', PRODUCT_PRICES.verdes)}
      {renderSaleButtons('rojos', PRODUCT_PRICES.rojos)}
      {renderSaleButtons('especiales', PRODUCT_PRICES.especiales)}

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SalesPage;
