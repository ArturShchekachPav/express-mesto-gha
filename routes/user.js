const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getMyProfileData
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getMyProfileData)
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
