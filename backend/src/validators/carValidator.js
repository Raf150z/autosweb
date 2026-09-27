const { body } = require('express-validator');

exports.carRules = [
  body('model').trim().notEmpty().withMessage('Modelo obligatorio'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Año inválido'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('imageUrl').isURL().withMessage('URL de imagen inválida'),
  body('description').trim().isLength({ min: 10, max: 500 }),
  body('brandId').isInt().withMessage('brandId requerido'),
  body('categoryId').isInt().withMessage('categoryId requerido'),
];