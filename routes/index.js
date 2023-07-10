const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./card');
const {createUser, login} = require('../controllers/users')
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const auth = require('../middlewares/auth');
const {Joi, celebrate} = require('celebrate');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('*', (req, res) => res.status(500).send({ message: 'некорретный путь запроса' }));

module.exports = router;
