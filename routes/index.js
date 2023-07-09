const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./card');
const {createUser, login} = require('../controllers/users')
const { NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const auth = require('../middlewares/auth')

router.use('/sign-in', login);
router.use('/signup', createUser);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'некорретный путь запроса' }));

module.exports = router;
