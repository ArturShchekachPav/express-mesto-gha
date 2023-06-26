const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./card');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;