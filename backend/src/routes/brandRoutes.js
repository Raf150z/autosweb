const router = require('express').Router();
const ctrl = require('../controllers/brandController');
const { brandRules } = require('../validators/brandValidator');
const { validate } = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', verifyToken, isAdmin, brandRules, validate, ctrl.create);
router.put('/:id', verifyToken, isAdmin, brandRules, validate, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;