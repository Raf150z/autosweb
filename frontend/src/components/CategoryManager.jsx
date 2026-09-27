import { useEffect, useState } from 'react';
import { categoryService } from '../services/carService';

const EMPTY_FORM = { name: '', imageUrl: '' };

export default function CategoryManager({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    categoryService
      .getAll()
      .then((r) => setCategories(r.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditingId(null);
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, imageUrl: cat.imageUrl || '' });
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
        await categoryService.update(editingId, form);
      } else {
        await categoryService.create(form);
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
          : err.response?.data?.error || 'No se pudo guardar la categoría'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoryService.remove(id);
      load();
      onChange?.();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar. Puede tener vehículos asociados.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-navy">Categorías registradas</h2>
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
          {showForm ? 'Cerrar formulario' : '+ Agregar categoría'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 grid sm:grid-cols-2 gap-4"
        >
          <h3 className="sm:col-span-2 text-xl font-bold text-navy">
            {editingId ? 'Editar categoría' : 'Nueva categoría'}
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
              placeholder="Ej. SUV"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              URL de imagen (fondo del botón de categoría)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="https://ejemplo.com/auto-suv.png"
            />
            {form.imageUrl && (
              <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden bg-navy">
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover opacity-60"
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
              {submitting ? 'Guardando...' : editingId ? 'Actualizar categoría' : 'Guardar categoría'}
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
              <th className="p-3 text-left">Imagen</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Autos</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-teal">Cargando...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-teal">Sin categorías registradas.</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="w-14 h-10 object-cover rounded bg-navy" />
                    ) : (
                      <span className="w-14 h-10 flex items-center justify-center rounded bg-graylight text-teal text-xs">Sin img</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">{c.name}</td>
                  <td className="p-3">{c._count?.cars ?? 0}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="text-cyan hover:text-teal hover:underline font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
