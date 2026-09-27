const prisma = require('../config/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { cars: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(category);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
};