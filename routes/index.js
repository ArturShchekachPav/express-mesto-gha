const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./card');
const {createUser, login} = require('../controllers/users')
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');

router.use('/sign-in', login);
router.use('/signup', createUser);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'некорретный путь запроса' }));

module.exports = router;
