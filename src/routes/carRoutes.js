const router = require('express').Router();
const ctrl = require('../controllers/carController');
const { carRules } = require('../validators/carValidator');
const { validate } = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', verifyToken, isAdmin, carRules, validate, ctrl.create);
router.put('/:id', verifyToken, isAdmin, carRules, validate, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;