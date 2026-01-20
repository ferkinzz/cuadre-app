import React, { useState, useEffect } from 'react';
import { getDailyData } from '../api/firebase';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';

function SummaryPage() {
  const [dailySales, setDailySales] = useState(0);
  const [dailyPurchases, setDailyPurchases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const estimatedProfit = dailySales - dailyPurchases;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resumen del Día
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Ventas Totales</Typography>
              <Typography variant="h4" component="p" color="primary">${dailySales.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Compras Totales</Typography>
              <Typography variant="h4" component="p" color="error">${dailyPurchases.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Ganancia Estimada</Typography>
              <Typography variant="h4" component="p" color={estimatedProfit >= 0 ? 'success.main' : 'error.main'}>${estimatedProfit.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SummaryPage;
