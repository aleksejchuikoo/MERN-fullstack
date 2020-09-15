const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  // схема по которой будет работать наша модель
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  links: [
    {
      // так как мы делаем приложение для ссылок
      type: Types.ObjectId, // будет Id, который определен в MongoDB
      ref: 'Link', // к какой коллекции мы привязываемся. Link - это модель
    },
  ],
});

module.exports = model('User', schema);
