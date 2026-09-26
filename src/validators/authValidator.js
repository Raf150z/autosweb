const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Nombre obligatorio').isLength({ min: 3 }),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Rol inválido'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Password obligatorio'),
];