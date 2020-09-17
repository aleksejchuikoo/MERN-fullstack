// middleware - это обычная функция, которая позволяет перехватывать определенные данные и делать логику
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // next помогает продолжить выполнение запроса
  if (req.method === 'OPTIONS') {
    // это спец. метод, который присутствует в Rest API, который просто проверяет доступность сервера
    return next(); // продолжаем делать запрос, если это OPTIONS
  }

  // если обычный запрос, аля POST, GET
  try {
    const token = req.headers.authorization.split(' ')[1]; // authoriz - это строка, которую мы будем передавать с фронта. Нам нужно распарсить, чтобы получить сам token

    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' });
    }
    // если токен есть, то нужно его раскодировать
    // чтобы раскодировать, нужно подключить библиотеку jsonwebtoken
    const decoded = jwt.verify(token, config.get('jwtSecret')); // вторым пар-ом - секретный ключ, который мы придумали
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Нет авторизации' });
  }
};
