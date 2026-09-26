module.exports = (err, req, res, next) => {
  console.error('❌', err.message);
  // Errores específicos de Prisma
  if (err.code === 'P2002')
    return res.status(409).json({ error: 'Registro duplicado', campo: err.meta?.target });
  if (err.code === 'P2025')
    return res.status(404).json({ error: 'Registro no encontrado' });

  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
};