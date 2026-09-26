const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { categoryRules } = require('../validators/categoryValidator');
const { validate } = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', ctrl.getAll);
router.post('/', verifyToken, isAdmin, categoryRules, validate, ctrl.create);
router.put('/:id', verifyToken, isAdmin, categoryRules, validate, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;