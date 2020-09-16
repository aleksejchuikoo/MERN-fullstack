const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

const router = Router();

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        });
      }

      const { email, password } = req.body; // это то, что нам будет приходить с front-end

      const candidate = await User.findOne({ email }); // модель пользователя будет искать человека по email

      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 12); // вторым пар-ром указываем некоторый соут, что позволяет ещё больше зашифровать пароль
      const user = new User({ email, password: hashedPassword });

      await user.save(); // ждем, пока пользователь сохранится
      res.status(201).json({ message: 'Пользователь создан' });
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' });
    }
  },
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль длинной не менее 6 символов').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему',
        });
      }

      const { email, password } = req.body; // получаем поля из req.body

      const user = await User.findOne({ email }); // если нет такого пользователя по email, то login не можем сделать
      if (!user) {
        return res.status(400).json({ message: 'Нет такого пользователя' });
      }

      const isMatch = await bcrypt.compare(password, user.password); // сравниваем пароли: который пришел с front-end и который в базе

      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
      }

      const token = jwt.sign(
        // создаем токен
        { userId: user.id }, //первый пар-р - это объект, где нам небходимо указать те данные, которые будут зашифрованы в данном jwt token
        config.get('jwtSecret'), // передаем некоторый секретный ключ
        { expiresIn: '1h' }, // через сколько данный JWT закончит своё существование
      );

      res.json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так' });
    }
  },
);

module.exports = router;
