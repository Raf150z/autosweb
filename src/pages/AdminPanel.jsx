import { useEffect, useState } from 'react';
import { carService, brandService, categoryService } from '../services/carService';
import { formatPrice } from '../utils/formatPrice';
import BrandManager from '../components/BrandManager';
import CategoryManager from '../components/CategoryManager';
import BackButton from '../components/BackButton';
import UserManager from '../components/UserManager';


const EMPTY_FORM = {
  model: '',
  year: new Date().getFullYear(),
  price: '',
  imageUrl: '',
  description: '',
  brandId: '',
  categoryId: '',
};

const TABS = [
  { id: 'cars', label: 'Vehículos' },
  { id: 'brands', label: 'Marcas' },
  { id: 'categories', label: 'Categorías' },
  { id: 'users', label: 'Usuarios' },
];

export default function AdminPanel() {
  const [tab, setTab] = useState('cars');

  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const loadCars = () => {
    setLoading(true);
    carService
      .getAll({ limit: 100 })
      .then((r) => setCars(r.data.data ?? r.data))
      .finally(() => setLoading(false));
  };

  const loadBrands = () => {
    brandService.getAll().then((r) => setBrands(r.data)).catch(() => setBrands([]));
  };

  const loadCategories = () => {
    categoryService.getAll().then((r) => setCategories(r.data)).catch(() => setCategories([]));
  };

  useEffect(() => {
    loadCars();
    loadBrands();
    loadCategories();
  }, []);

  const handleDeleteCar = async (id) => {
    if (!confirm('¿Eliminar este auto?')) return;
    try {
      await carService.remove(id);
      loadCars();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleEditClick = (car) => {
    setEditingId(car.id);
    setForm({
      model: car.model,
      year: car.year,
      price: car.price,
      imageUrl: car.imageUrl,
      description: car.description,
      brandId: car.brandId ?? car.brand?.id ?? '',
      categoryId: car.categoryId ?? car.category?.id ?? '',
    });
    setFormErrors([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitting(true);
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
    };
    try {
      if (editingId) {
        await carService.update(editingId, payload);
      } else {
        await carService.create(payload);
      }
      resetForm();
      setShowForm(false);
      loadCars();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setFormErrors(apiErrors.map((er) => er.msg));
      } else {
        setFormErrors([err.response?.data?.error || 'No se pudo guardar el vehículo']);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy mb-5 sm:mb-6">
        Panel de Administración
      </h1>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
              tab === t.id
                ? 'bg-navy text-white'
                : 'bg-white text-navy border border-graylight hover:bg-graylight'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* VEHÍCULOS */}
      {tab === 'cars' && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-navy">
              Vehículos registrados
            </h2>
            <button
              onClick={() => {
                if (showForm) {
                  resetForm();
                  setShowForm(false);
                } else {
                  setShowForm(true);
                }
              }}
              className="bg-cyan text-navy font-semibold px-4 py-2 rounded-lg hover:bg-cyanbright transition w-full sm:w-auto text-sm"
            >
              {showForm ? 'Cerrar formulario' : '+ Agregar vehículo'}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 grid sm:grid-cols-2 gap-4"
            >
              <h3 className="sm:col-span-2 text-lg sm:text-xl font-bold text-navy">
                {editingId ? 'Editar vehículo' : 'Nuevo vehículo'}
              </h3>

              {formErrors.length > 0 && (
                <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                  <ul className="list-disc list-inside">
                    {formErrors.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                </div>
              )}

              {brands.length === 0 || categories.length === 0 ? (
                <p className="sm:col-span-2 text-sm text-teal bg-graylight/60 rounded-lg p-3">
                  Necesitas al menos una marca y una categoría antes de crear un vehículo.
                  Ve a las pestañas <strong>Marcas</strong> y <strong>Categorías</strong> para crearlas.
                </p>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Modelo</label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={handleChange('model')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                  placeholder="Ej. Corolla"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Año</label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={handleChange('year')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Precio (MXN)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={handleChange('price')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                  placeholder="Ej. 350000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">URL de imagen</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={handleChange('imageUrl')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Marca</label>
                <select
                  required
                  value={form.brandId}
                  onChange={handleChange('brandId')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                >
                  <option value="">Selecciona una marca</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Categoría</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy mb-1">Descripción</label>
                <textarea
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={handleChange('description')}
                  className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
                  placeholder="Describe el vehículo (mínimo 10 caracteres)"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-teal transition disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingId ? 'Actualizar vehículo' : 'Guardar vehículo'}
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

          {loading ? (
            <p className="text-teal">Cargando autos...</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded-lg -mx-4 sm:mx-0">
              <table className="w-full text-xs sm:text-sm min-w-[600px]">
                <thead className="bg-graylight">
                  <tr>
                    <th className="p-3 text-left">Modelo</th>
                    <th className="p-3 text-left">Marca</th>
                    <th className="p-3 text-left">Categoría</th>
                    <th className="p-3 text-left">Precio</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-t">
                      <td className="p-3 whitespace-nowrap">{car.model}</td>
                      <td className="p-3 whitespace-nowrap">{car.brand?.name}</td>
                      <td className="p-3 whitespace-nowrap">{car.category?.name}</td>
                      <td className="p-3 whitespace-nowrap">{formatPrice(car.price)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditClick(car)}
                            className="text-cyan hover:text-teal hover:underline font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-teal">
                        No hay autos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'brands' && <BrandManager onChange={loadBrands} />}
      {tab === 'categories' && <CategoryManager onChange={loadCategories} />}
      {tab === 'users' && <UserManager />}
    </div>
  );
}