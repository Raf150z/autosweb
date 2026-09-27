const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { userCreateRules, userUpdateRules } = require('../validators/userValidator');
const { validate } = require('../middlewares/validate');

router.get('/', verifyToken, isAdmin, ctrl.getAll);
router.post('/', verifyToken, isAdmin, userCreateRules, validate, ctrl.create);
router.put('/:id', verifyToken, isAdmin, userUpdateRules, validate, ctrl.update);
router.put('/:id/role', verifyToken, isAdmin, ctrl.changeRole);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;