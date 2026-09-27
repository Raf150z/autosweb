const prisma = require('../config/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { cars: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(brands);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(req.params.id) },
      include: { cars: true },
    });
    if (!brand) return res.status(404).json({ error: 'Marca no encontrada' });
    res.json(brand);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const brand = await prisma.brand.create({ data: req.body });
    res.status(201).json(brand);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(brand);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.brand.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
};