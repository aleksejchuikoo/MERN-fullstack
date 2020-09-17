const express = require('express');
const config = require('config'); // нужен для того, чтобы оттуда брать наши константы
const path = require('path');
const mongoose = require('mongoose');

const app = express(); // app является результатом работы функции express(), это наш будущий сервер

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

// добавляем в самом конце
if (process.env.NODE_ENV === 'production') {
  // если идет запрос на корень нашего приложения, тогда добавляем express middleware static, чтобы указать нашу статическую папку
  // path необходимо сформировать с помощью метода join от текущей директории в папку client и в папку build
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  // любой get запрос
  app.get('*', (req, res) => {
    // будем отправлять файлом, который находится у нас до index.html
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    //тем самым, у нас будет работать фронт и бэк одновременно
  });
}

const PORT = config.get('port') || 5000;
const mongoUri = config.get('mongoUri'); // Uri адрес, по которому будем добавлять БД

async function start() {
  try {
    // если всё хорошо, то подключаемся
    await mongoose.connect(mongoUri, {
      // вторым параметром передаем набор опций
      // эти параметры нужны, чтобы наш коннект работал корректно
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log('App has been started')); // запускаем сервер на порте 5000
  } catch (error) {
    console.log(error.message);
    process.exit(1); // завершим наш процесс (выйдем из nodeJS) в случае, если что-то пойдет не так
  }
}

start();
