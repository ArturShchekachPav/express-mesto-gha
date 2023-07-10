const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getMyProfileData
} = require('../controllers/users');
const {Joi, celebrate} = require('celebrate');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().id(),
  }),
}), getUserById);
router.get('/me', getMyProfileData)
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
