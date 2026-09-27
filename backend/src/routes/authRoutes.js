const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const { validate } = require('../middlewares/validate');
const { verifyToken } = require('../middlewares/auth');

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login', loginRules, validate, ctrl.login);
router.get('/me', verifyToken, ctrl.me);

module.exports = router;