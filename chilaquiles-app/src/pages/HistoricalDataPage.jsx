import React, { useState, useEffect, useMemo } from 'react';
import { getHistoricalData } from '../api/firebase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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
  Alert,
  TextField,
} from '@mui/material';

/**
 * ✅ PARSER LOCAL SEGURO
 * Convierte "YYYY-MM-DD" → Date local real
 * (evita bug UTC de JS)
 */
const parseLocalDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Agrupa las órdenes por fecha y devuelve los datos formateados para el gráfico.
 * - Para 'day', 'week', 'month' → agrupa por día.
 * - Para 'year' y 'total' → agrupa por mes.
 */
const processDataForChart = (orders, period) => {
  if (!orders || orders.length === 0) return [];

  const groupByDay = period === 'day' || period === 'week' || period === 'month';
  const salesByDate = new Map();

  orders.forEach((order) => {
    const date = order.createdAt.toDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const key = groupByDay
      ? `${year}-${month}-${day}`
      : `${year}-${month}-01`;

    salesByDate.set(key, (salesByDate.get(key) || 0) + order.price);
  });

  return Array.from(salesByDate.entries())
    // ✅ FIX SORT (antes usaba new Date(string))
    .sort(([a], [b]) => parseLocalDate(a) - parseLocalDate(b))
    .map(([dateStr, ventas]) => {

      // ✅ FIX parse fecha
      const date = parseLocalDate(dateStr);

      const formattedDate = groupByDay
        ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

      return { date: formattedDate, ventas };
    });
};

function HistoricalDataPage() {
  const [period, setPeriod] = useState('week');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [data, setData] = useState({ orders: [], purchases: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {

        // ✅ FIX principal
        const dateObj =
          period === 'day'
            ? parseLocalDate(selectedDate)
            : undefined;

        const historicalData = await getHistoricalData(period, dateObj);
        setData(historicalData);

      } catch (err) {
        console.error(`Error obteniendo datos para ${period}:`, err);
        setError('No se pudieron cargar los datos. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, selectedDate]);

  // Datos derivados
  const totalSales = useMemo(
    () => data.orders.reduce((sum, order) => sum + order.price, 0),
    [data.orders]
  );

  const totalPurchases = useMemo(
    () => data.purchases.reduce((sum, purchase) => sum + purchase.amount, 0),
    [data.purchases]
  );

  const estimatedProfit = totalSales - totalPurchases;

  const chartData = useMemo(
    () => processDataForChart(data.orders, period),
    [data.orders, period]
  );

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) setPeriod(newPeriod);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Análisis de Datos
      </Typography>

      {/* Controles */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButtonGroup color="primary" value={period} exclusive onChange={handlePeriodChange}>
          <ToggleButton value="day">Día</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
          <ToggleButton value="month">Mes</ToggleButton>
          <ToggleButton value="year">Año</ToggleButton>
          <ToggleButton value="total">Total</ToggleButton>
        </ToggleButtonGroup>

        {period === 'day' && (
          <TextField
            type="date"
            size="small"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />
        )}
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!isLoading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Contenido */}
      {!isLoading && !error && (
        <Box>

          {/* Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Ventas</Typography>
                  <Typography variant="h4" color="primary">
                    ${totalSales.toFixed(2)}
                  </Typography>
                  <Typography color="text.secondary">
                    {data.orders.length} órdenes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Compras</Typography>
                  <Typography variant="h4" color="error">
                    ${totalPurchases.toFixed(2)}
                  </Typography>
                  <Typography color="text.secondary">
                    {data.purchases.length} compras
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">Ganancia estimada</Typography>
                  <Typography
                    variant="h4"
                    color={estimatedProfit >= 0 ? 'success.main' : 'error.main'}
                  >
                    ${estimatedProfit.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart */}
          {chartData.length > 0 ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Ventas
                </Typography>

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
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No hay ventas registradas para este período.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Gastos */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalle de Gastos
              </Typography>

              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {data.purchases.length > 0 ? (
                    data.purchases.map((purchase, index) => (
                      <React.Fragment key={purchase.id}>
                        <ListItem>
                          <ListItemText
                            primary={purchase.item}
                            secondary={`${purchase.category} — ${purchase.date.toDate().toLocaleDateString('es-ES')}`}
                          />
                          <Typography variant="body1" color="error.main">
                            ${purchase.amount.toFixed(2)}
                          </Typography>
                        </ListItem>
                        {index < data.purchases.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                      No hay gastos registrados para este período.
                    </Typography>
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