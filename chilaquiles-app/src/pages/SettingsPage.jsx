import React, { useState } from 'react';
import { useConfig } from '../ConfigContext';
import {
  Box, Typography, TextField, Button, Divider,
  List, ListItem, ListItemText, IconButton, Snackbar, Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';

function SettingsPage() {
  const { config, updateConfig } = useConfig();
  const [form, setForm] = useState({ ...config, products: [...config.products], categories: [...config.categories] });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [newCategory, setNewCategory] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(form);
      setFeedback({ open: true, message: 'Configuración guardada', severity: 'success' });
    } catch {
      setFeedback({ open: true, message: 'Error al guardar', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '_');
    setForm(f => ({ ...f, products: [...f.products, { id, name: newProduct.name, price: parseFloat(newProduct.price) }] }));
    setNewProduct({ name: '', price: '' });
  };

  const removeProduct = (id) => {
    setForm(f => ({ ...f, products: f.products.filter(p => p.id !== id) }));
  };

  const updateProduct = (id, field, value) => {
    setForm(f => ({
      ...f,
      products: f.products.map(p => p.id === id ? { ...p, [field]: field === 'price' ? parseFloat(value) || 0 : value } : p),
    }));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setForm(f => ({ ...f, categories: [...f.categories, newCategory.trim().toLowerCase()] }));
    setNewCategory('');
  };

  const removeCategory = (cat) => {
    setForm(f => ({ ...f, categories: f.categories.filter(c => c !== cat) }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" component="h1">Configuración</Typography>

      {/* Nombre de la app */}
      <Box>
        <Typography variant="h6" gutterBottom>Nombre de la app</Typography>
        <TextField
          fullWidth
          label="Nombre"
          value={form.appName}
          onChange={(e) => setForm(f => ({ ...f, appName: e.target.value }))}
        />
      </Box>

      <Divider />

      {/* Imagen de fondo */}
      <Box>
        <Typography variant="h6" gutterBottom>Imagen de fondo</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          URL de la imagen (ej. /mi-fondo.jpg o https://...)
        </Typography>
        <TextField
          fullWidth
          label="URL de imagen de fondo"
          value={form.backgroundImage}
          onChange={(e) => setForm(f => ({ ...f, backgroundImage: e.target.value }))}
        />
        {form.backgroundImage && (
          <Box sx={{ mt: 1, height: 120, borderRadius: 1, overflow: 'hidden', backgroundImage: `url(${form.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
      </Box>

      <Divider />

      {/* Productos */}
      <Box>
        <Typography variant="h6" gutterBottom>Productos</Typography>
        <List disablePadding>
          {form.products.map((p) => (
            <ListItem key={p.id} disablePadding sx={{ gap: 1, mb: 1 }}>
              <TextField
                size="small"
                label="Nombre"
                value={p.name}
                onChange={(e) => updateProduct(p.id, 'name', e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                label="Precio"
                type="number"
                value={p.price}
                onChange={(e) => updateProduct(p.id, 'price', e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton color="error" onClick={() => removeProduct(p.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField size="small" label="Nuevo producto" value={newProduct.name} onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))} sx={{ flex: 2 }} />
          <TextField size="small" label="Precio" type="number" value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} sx={{ flex: 1 }} />
          <Button variant="outlined" onClick={addProduct} startIcon={<AddIcon />}>Agregar</Button>
        </Box>
      </Box>

      <Divider />

      {/* Categorías de compras */}
      <Box>
        <Typography variant="h6" gutterBottom>Categorías de compras</Typography>
        <List disablePadding>
          {form.categories.map((cat) => (
            <ListItem key={cat} disablePadding sx={{ mb: 0.5 }}>
              <ListItemText primary={cat} sx={{ textTransform: 'capitalize' }} />
              <IconButton color="error" onClick={() => removeCategory(cat)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField size="small" fullWidth label="Nueva categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
          <Button variant="outlined" onClick={addCategory} startIcon={<AddIcon />}>Agregar</Button>
        </Box>
      </Box>

      <Divider />

      <Button variant="contained" size="large" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </Button>

      <Divider />

      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ¿Te está siendo útil Cuadre?
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<FavoriteIcon />}
          href="https://paypal.me/fantactico"
          target="_blank"
          rel="noopener noreferrer"
        >
          Invítame un café
        </Button>
      </Box>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback(f => ({ ...f, open: false }))}>
        <Alert severity={feedback.severity}>{feedback.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsPage;
