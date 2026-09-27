import { useEffect, useState } from 'react';
import { brandService } from '../services/carService';

const EMPTY_FORM = { name: '', country: '', logoUrl: '' };

export default function BrandManager({ onChange }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    brandService
      .getAll()
      .then((r) => setBrands(r.data))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditingId(null);
  };

  const handleEditClick = (brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name, country: brand.country, logoUrl: brand.logoUrl || '' });
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await brandService.update(editingId, form);
      } else {
        await brandService.create(form);
      }
      resetForm();
      setShowForm(false);
      load();
      onChange?.();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(
        apiErrors
          ? apiErrors.map((er) => er.msg).join(', ')
          : err.response?.data?.error || 'No se pudo guardar la marca'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta marca?')) return;
    try {
      await brandService.remove(id);
      load();
      onChange?.();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar. Puede tener vehículos asociados.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-navy">Marcas registradas</h2>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="bg-cyan text-navy font-semibold px-4 py-2 rounded-lg hover:bg-cyanbright transition w-full sm:w-auto"
        >
          {showForm ? 'Cerrar formulario' : '+ Agregar marca'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 grid sm:grid-cols-2 gap-4"
        >
          <h3 className="sm:col-span-2 text-xl font-bold text-navy">
            {editingId ? 'Editar marca' : 'Nueva marca'}
          </h3>

          {error && (
            <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="Ej. Toyota"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">País</label>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="Ej. Japón"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-navy mb-1">URL del logo</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="https://ejemplo.com/logo-marca.png"
            />
            {form.logoUrl && (
              <div className="mt-2 w-16 h-16 rounded-lg bg-graylight flex items-center justify-center overflow-hidden">
                <img
                  src={form.logoUrl}
                  alt="Vista previa"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { e.target.style.opacity = 0; }}
                />
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-teal transition disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : editingId ? 'Actualizar marca' : 'Guardar marca'}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-6 py-2 rounded-lg border border-graylight text-navy hover:bg-graylight transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-graylight">
            <tr>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">País</th>
              <th className="p-3 text-left">Autos</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-teal">Cargando...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-teal">Sin marcas registradas.</td></tr>
            ) : (
              brands.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt={b.name} className="w-10 h-10 object-contain rounded bg-graylight" />
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center rounded bg-graylight text-teal text-xs">
                        {b.name?.[0] ?? '?'}
                      </span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">{b.name}</td>
                  <td className="p-3 whitespace-nowrap">{b.country}</td>
                  <td className="p-3">{b._count?.cars ?? 0}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(b)}
                        className="text-cyan hover:text-teal hover:underline font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
