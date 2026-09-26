const { body } = require('express-validator');

exports.userCreateRules = [
  body('name').trim().notEmpty().withMessage('Nombre obligatorio').isLength({ min: 3 }),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Rol inválido'),
];

exports.userUpdateRules = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Nombre muy corto'),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Mínimo 6 caracteres'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Rol inválido'),
];