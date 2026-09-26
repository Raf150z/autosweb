const { body } = require('express-validator');

exports.brandRules = [
  body('name').trim().notEmpty().withMessage('Nombre obligatorio'),
  body('country').trim().notEmpty().withMessage('País obligatorio'),
  body('logoUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('La URL del logo no es válida'),
];