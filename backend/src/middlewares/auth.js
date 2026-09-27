const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token no proporcionado' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Requiere rol admin' });
  next();
};

exports.isUser = (req, res, next) => {
  if (!['admin', 'user'].includes(req.user?.role))
    return res.status(403).json({ error: 'Requiere rol user o admin' });
  next();
};