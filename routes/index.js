const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const userRoutes = require('./user');
const cardRoutes = require('./card');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/),
  }).unknown(true),
}), createUser);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('*', (req, res) => res.status(500).send({ message: 'некорретный путь запроса' }));

module.exports = router;
