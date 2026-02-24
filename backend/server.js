const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальные данные (10+ товаров)
let products = [
  { id: nanoid(6), name: 'Ноутбук Acer Aspire 5', category: 'Ноутбуки', description: '15.6" IPS, Intel Core i5, 8GB RAM, 512GB SSD', price: 54990, stock: 12, rating: 4.5, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Смартфон Xiaomi Redmi Note 11', category: 'Смартфоны', description: '6.43" AMOLED, 128GB, 4GB RAM', price: 19990, stock: 25, rating: 4.3, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Планшет Samsung Tab A8', category: 'Планшеты', description: '10.5" TFT, 64GB, 4GB RAM', price: 17990, stock: 8, rating: 4.2, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Наушники JBL Tune 510BT', category: 'Аксессуары', description: 'Bluetooth, беспроводные, микрофон', price: 3290, stock: 40, rating: 4.6, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Монитор LG 24MK600M', category: 'Мониторы', description: '24" IPS, FullHD, FreeSync', price: 13990, stock: 6, rating: 4.4, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Клавиатура Logitech K380', category: 'Аксессуары', description: 'Bluetooth, компактная, для планшетов', price: 3490, stock: 18, rating: 4.7, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Мышь Logitech MX Master 3', category: 'Аксессуары', description: 'беспроводная, сенсорная прокрутка', price: 7990, stock: 10, rating: 4.8, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Внешний диск WD 1TB', category: 'Хранение', description: 'USB 3.0, черный', price: 4990, stock: 22, rating: 4.5, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Роутер TP-Link Archer AX10', category: 'Сетевое оборудование', description: 'Wi-Fi 6, 4 порта', price: 3990, stock: 14, rating: 4.2, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Смарт-часы Huawei Watch GT 3', category: 'Гаджеты', description: '46mm, GPS, пульсометр', price: 14990, stock: 5, rating: 4.6, image: 'https://via.placeholder.com/150' },
  { id: nanoid(6), name: 'Игровая приставка Sony PS5', category: 'Игры', description: 'Digital Edition, 825GB', price: 49990, stock: 2, rating: 4.9, image: 'https://via.placeholder.com/150' }
];

// Начальные данные пользователей (для Swagger-примера)
let users = [
  { id: nanoid(6), name: 'Петр', age: 16 },
  { id: nanoid(6), name: 'Иван', age: 18 },
  { id: nanoid(6), name: 'Дарья', age: 20 },
];

// Middleware
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', req.body);
    }
  });
  next();
});

// CORS (разрешаем фронтенд на порту 3001)
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ----- Swagger (OpenAPI) -----

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ElectroShop API (products & users)',
      version: '1.0.0',
      description: 'REST API для товаров и пользователей, задокументированное через Swagger (OpenAPI)',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
  },
  // текущий файл как источник JSDoc-аннотаций
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Вспомогательная функция поиска товара по id
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

// Вспомогательная функция поиска пользователя по id
function findUserOr404(id, res) {
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return null;
  }
  return user;
}

// ---------- Маршруты ----------

// GET /api/products – список всех товаров
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id – один товар
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

// POST /api/products – создание нового товара
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  // Базовая проверка обязательных полей
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating !== undefined ? Number(rating) : null,
    image: image || null
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH /api/products/:id – обновление товара
app.patch('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  const { name, category, description, price, stock, rating, image } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = rating ? Number(rating) : null;
  if (image !== undefined) product.image = image;

  res.json(product);
});

// DELETE /api/products/:id – удаление товара
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: 'Product not found' });

  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *       example:
 *         id: "abc123"
 *         name: "Петр"
 *         age: 16
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создает нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;
  if (!name || age === undefined) {
    return res.status(400).json({ error: 'Name and age are required' });
  }

  const newUser = {
    id: nanoid(6),
    name: name.trim(),
    age: Number(age),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 */
app.get('/api/users/:id', (req, res) => {
  const user = findUserOr404(req.params.id, res);
  if (!user) return;
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет данные пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Обновленный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Пользователь не найден
 */
app.patch('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const user = findUserOr404(id, res);
  if (!user) return;

  if (req.body?.name === undefined && req.body?.age === undefined) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  const { name, age } = req.body;
  if (name !== undefined) user.name = name.trim();
  if (age !== undefined) user.age = Number(age);

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удален (нет тела ответа)
 *       404:
 *         description: Пользователь не найден
 */
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const exists = users.some(u => u.id === id);
  if (!exists) return res.status(404).json({ error: 'User not found' });

  users = users.filter(u => u.id !== id);
  res.status(204).send();
});

// 404 для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});