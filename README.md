# Cuadre

App gratuita para llevar las cuentas de tu negocio. Registra ventas, gastos y mira tu ganancia del día — desde el celular, sin complicaciones.

Funciona para cualquier negocio: puesto de comida, tiendita, servicio, lo que sea. Tú defines los productos, los precios y las categorías desde la app.

---

## ¿Qué hace?

- Registrar ventas por producto y método de pago (efectivo / transferencia)
- Registrar compras y gastos por categoría
- Ver el resumen del día: ventas, gastos y ganancia estimada
- Analizar datos históricos con gráficas por día, semana, mes o año
- Configurar todo desde la app: nombre del negocio, imagen de fondo, productos, precios y categorías — sin tocar código

---

## Próximamente

**Versión Android** — en camino a Google Play Store.
Sin cuenta, sin Firebase: todo guardado en el celular, con opción de exportar tus datos en JSON.

---

## Correrlo localmente

```bash
cd chilaquiles-app
npm install
npm run dev
```

---

## Desplegarlo (Cloudflare Pages u otro hosting)

Esta app usa **Firebase** como base de datos y autenticación. Necesitas crear un proyecto en [Firebase Console](https://console.firebase.google.com) y configurar las variables de entorno.

### Variables de entorno requeridas

Crea un archivo `.env` dentro de `chilaquiles-app/` con los valores de tu proyecto Firebase:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Si usas **Cloudflare Pages**, agrégalas en:
`Settings → Environment variables`

### Configuración de compilación

| Campo | Valor |
|---|---|
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |
| Directorio raíz | `chilaquiles-app` |

---

## Stack

- React 19 + Vite
- Material UI (tema oscuro)
- Firebase (Firestore + Auth)
- Recharts

---

## ¿Te fue útil?

Si Cuadre le ayuda a tu negocio, puedes apoyar el proyecto:
**[paypal.me/fantactico](https://paypal.me/fantactico)**

---

Hecho con ganas de que los negocios chidos cuadren 🤙
