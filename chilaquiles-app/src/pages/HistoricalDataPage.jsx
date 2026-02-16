import React, { useState, useEffect } from 'react';
import { getHistoricalData } from '../api/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const processDataForChart = (orders, period) => {
  if (!orders || orders.length === 0) return [];

  const salesByDate = new Map();

  orders.forEach(order => {
    const date = order.createdAt.toDate();
    let key;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (period === 'day' || period === 'week' || period === 'month') {
      // Agrupar por día para la vista semanal o diaria
      key = `${year}-${month}-${day}`;
    } else if (period === 'year' || period === 'total') {
      // Agrupar por mes
      key = `${year}-${month}-01`;
    } else {
      // Para 'total', agrupar por mes también puede ser una opción razonable
      key = `${year}-${month}-01`;
    }

    salesByDate.set(key, (salesByDate.get(key) || 0) + order.price);
  });

  const sortedData = Array.from(salesByDate.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));

  return sortedData.map(([dateStr, ventas]) => {
    const date = new Date(dateStr);
    let formattedDate;
    if (period === 'year' || period === 'total') {
      formattedDate = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    } else {
      formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
    return {
      date: formattedDate,
      ventas,
    };
  });
};

function HistoricalDataPage() {
  const [period, setPeriod] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState({ orders: [], purchases: [] });
  const [totals, setTotals] = useState({ sales: 0, purchases: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const historicalData = await getHistoricalData(period, selectedDate);
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
  }, [period, selectedDate]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };
  
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const estimatedProfit = totals.sales - totals.purchases;
  const totalOrders = data.orders.length;
  const totalPurchasesCount = data.purchases.length;
  const chartData = processDataForChart(data.orders, period);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Análisis de Datos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <ToggleButtonGroup color="primary" value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="day">Día</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
          <ToggleButton value="month">Mes</ToggleButton>
          <ToggleButton value="year">Año</ToggleButton>
          <ToggleButton value="total">Total</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
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
                  <Typography color="text.secondary">{totalPurchasesCount} compras</Typography>
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
          </Grid>

          {/* Gráfico de Tendencia de Ventas */}
          {chartData.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Tendencia de Ventas</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Ventas']} />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Lista de Gastos */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Detalle de Gastos</Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {data.purchases.length > 0 ? (
                    data.purchases.map((purchase, index) => (
                      <React.Fragment key={purchase.id}>
                        <ListItem>
                          <ListItemText primary={purchase.item} secondary={`${purchase.category} - ${purchase.date.toDate().toLocaleDateString()}`} />
                          <Typography variant="body1" color="error.main">${purchase.amount.toFixed(2)}</Typography>
                        </ListItem>
                        {index < data.purchases.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, textAlign: 'center' }}>No hay gastos registrados para este período.</Typography>
                  )}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default HistoricalDataPage;