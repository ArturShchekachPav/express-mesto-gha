const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers, updateProfile, updateAvatar, getMyProfileData,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyProfileData);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;
