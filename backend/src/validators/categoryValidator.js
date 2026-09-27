const { body } = require('express-validator');

exports.categoryRules = [
  body('name').trim().notEmpty().withMessage('Nombre obligatorio'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('La URL de la imagen no es válida'),
];