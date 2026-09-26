const prisma = require('../config/prisma');

exports.getAll = async (req, res, next) => {
  try {
    const { categoryId, brandId, search, limit = 6, page = 1 } = req.query;
    const where = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (brandId) where.brandId = Number(brandId);
    if (search) where.model = { contains: search, mode: 'insensitive' };

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { brand: true, category: true },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where }),
    ]);

    res.json({
      data: cars,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(req.params.id) },
      include: { brand: true, category: true },
    });
    if (!car) return res.status(404).json({ error: 'Auto no encontrado' });
    res.json(car);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const car = await prisma.car.create({
      data: {
        ...req.body,
        year: Number(req.body.year),
        price: Number(req.body.price),
        brandId: Number(req.body.brandId),
        categoryId: Number(req.body.categoryId),
      },
      include: { brand: true, category: true },
    });
    res.status(201).json(car);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const car = await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { brand: true, category: true },
    });
    res.json(car);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.car.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) { next(err); }
};