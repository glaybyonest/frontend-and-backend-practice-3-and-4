# ElectroShop – frontend + backend
  
Стек: **Node.js + Express** на бэкенде и **React (Create React App)** на фронтенде.

## Структура проекта

- **backend**
  - `server.js` – REST API для товаров (список, создание, обновление, удаление).
  - Адрес сервера: `http://localhost:3000`, все маршруты начинаются с `/api/...`.
- **frontend/frontend**
  - CRA‑приложение React.
  - `src/api/index.js` – клиент `axios` с базовым URL `http://localhost:3000/api`.
  - `src/components` – UI‑компоненты (`ProductsList`, `ProductItem`, `ProductModal`).
  - `src/pages/ProductsPage` – страница с таблицей товаров и модалкой.
  - `src/App.js` – рендерит `ProductsPage`.


## Как запустить

### Backend

```bash
cd backend
npm install   # один раз
npm start     # http://localhost:3000
```

Основные эндпоинты:

- `GET  /api/products`
- `GET  /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

### Frontend

```bash
cd frontend/frontend
npm install   # один раз
npm start     # http://localhost:3001
```

Фронтенд отправляет запросы на `http://localhost:3000/api` (см. `src/api/index.js`),  
поэтому **сначала** запустите backend, **потом** frontend.
"http://localhost:3000/api-docs"

## Практика 3 отображена в pdf файле postaman_test.pdf
