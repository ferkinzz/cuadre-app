# 🌮 Chilaquiles App

App gratuita para registrar ventas, compras y llevar el balance de tu negocio. Diseñada para ser simple y rápida de usar desde el celular.

---

## ¿Qué hace?

- Registrar ventas por producto y método de pago (efectivo / transferencia)
- Registrar compras y gastos por categoría
- Ver el resumen del día: ventas, gastos y ganancia estimada
- Analizar datos históricos con gráficas por día, semana, mes o año
- **Todo configurable:** nombre de la app, imagen de fondo, productos, precios y categorías desde la pantalla de Configuración — sin tocar código

---

## Próximamente

**Versión Android (APK)** — disponible próximamente en Google Play Store.
Almacenamiento local sin necesidad de cuenta, con opción de exportar tus datos en JSON.

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

Crea un archivo `.env` dentro de `chilaquiles-app/` con estos valores (los encuentras en la configuración de tu proyecto Firebase):

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

Si esta app te ayuda con tu negocio, puedes invitarme un café:
**[paypal.me/fantactico](https://paypal.me/fantactico)**

---

Hecho con amor y chilaquiles 🤙
