const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

// Listar todos
exports.getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
};

// Crear usuario (solo admin)
exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ error: 'Rol inválido' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hash, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (err) { next(err); }
};

// Editar usuario (nombre, email, password opcional, role)
exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    // Evitar que un admin se quite a sí mismo el rol admin
    if (req.user.id === id && role && role !== 'admin') {
      return res.status(400).json({
        error: 'No puedes quitarte el rol admin a ti mismo',
      });
    }

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password && password.length >= 6) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      if (!['admin', 'user'].includes(role))
        return res.status(400).json({ error: 'Rol inválido' });
      data.role = role;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (err) { next(err); }
};

// Cambiar solo el rol (atajo)
exports.changeRole = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ error: 'Rol inválido' });

    if (req.user.id === id && role !== 'admin') {
      return res.status(400).json({
        error: 'No puedes quitarte el rol admin a ti mismo',
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) { next(err); }
};

// Eliminar
exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (req.user.id === id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) { next(err); }
};