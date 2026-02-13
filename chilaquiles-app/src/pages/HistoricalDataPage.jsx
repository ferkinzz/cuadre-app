import React, { useState, useEffect } from 'react';
import { getHistoricalData } from '../api/firebase';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function HistoricalDataPage() {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState({ orders: [], purchases: [] });
  const [totals, setTotals] = useState({ sales: 0, purchases: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const historicalData = await getHistoricalData(period);
        setData(historicalData);

        const totalSales = historicalData.orders.reduce((sum, order) => sum + order.price, 0);
        const totalPurchases = historicalData.purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
        setTotals({ sales: totalSales, purchases: totalPurchases });
      } catch (error) {
        console.error(`Error obteniendo datos para ${period}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const estimatedProfit = totals.sales - totals.purchases;
  const totalOrders = data.orders.length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Análisis de Datos
      </Typography>

      <ToggleButtonGroup color="primary" value={period} exclusive onChange={handlePeriodChange} sx={{ mb: 3 }}>
        <ToggleButton value="day">Día</ToggleButton>
        <ToggleButton value="week">Semana</ToggleButton>
        <ToggleButton value="month">Mes</ToggleButton>
        <ToggleButton value="year">Año</ToggleButton>
        <ToggleButton value="total">Total</ToggleButton>
      </ToggleButtonGroup>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Tarjetas de Resumen */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">Ventas</Typography>
                <Typography variant="h4" component="p" color="primary">${totals.sales.toFixed(2)}</Typography>
                <Typography color="text.secondary">{totalOrders} órdenes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">Compras</Typography>
                <Typography variant="h4" component="p" color="error">${totals.purchases.toFixed(2)}</Typography>
                <Typography color="text.secondary">{totalOrders} órdenes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary">Ganancia</Typography>
                <Typography variant="h4" component="p" color={estimatedProfit >= 0 ? 'success.main' : 'error.main'}>${estimatedProfit.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Lista de Gastos */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Detalle de Gastos</Typography>
                <List>
                  {data.purchases.length > 0 ? (
                    data.purchases.map((purchase, index) => (
                      <React.Fragment key={purchase.id}>
                        <ListItem>
                          <ListItemText
                            primary={purchase.item}
                            secondary={`${purchase.category} - ${purchase.date.toDate().toLocaleDateString()}`}
                          />
                          <Typography variant="body1" color="error.main">${purchase.amount.toFixed(2)}</Typography>
                        </ListItem>
                        {index < data.purchases.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, textAlign: 'center' }}>No hay gastos registrados para este período.</Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default HistoricalDataPage;