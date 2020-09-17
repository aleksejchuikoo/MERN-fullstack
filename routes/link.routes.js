// данный роут будет отвечать за генерацию ссылок, которые мы будем сокращать в приложении
const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');

const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    // на данный момент сервер находится на localhost:5000, но когда мы будем
    // заливать приложение в настоящий хостинг и прикручивать домен,
    // то нам потрбуется там изменить базовый url
    // базовый url также буду хранить в config
    const baseUrl = config.get('baseUrl');

    // с фронта мы будем получать объект from, то есть тот путь, откуда мы делаем данную сылку
    const { from } = req.body;

    // теперь нам необходимо сформировать тот короткий код,
    // который позволит нашей ссылке быть короткой, то есть придумать уникальный ключ
    // для этого будем использовать другую библиотеку, называется "shortid"
    const code = shortid.generate();

    // проверяем: если ли в базе уже такая ссылка from
    const existing = await Link.findOne({ from });

    if (existing) {
      // если такая ссылка есть, тоэто означает, что все данные по ней мы уже сформировали
      // и нет смысла это заново делать
      return res.json({ link: existing }); // res по умолчанию отправляет статус 200
    }

    const to = baseUrl + '/t/' + code;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();
    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

router.get('/', auth, async (req, res) => {
  // требуется get запрос для получения всех ссылок
  try {
    // req.user.userId получаем из нашего middleware "auth"
    const links = await Link.find({ owner: req.user.userId }); // чтобы получить данные пользователя с фронта, сделаем это по jwt
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

router.get('/:id', auth, async (req, res) => {
  // и потребуется get запрос для получения всех ссылок по id
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

module.exports = router;
