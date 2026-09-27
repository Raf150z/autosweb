import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carService, categoryService, brandService } from '../services/carService';
import CarCard from '../components/CarCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadMoreButton from '../components/LoadMoreButton';
import BackButton from '../components/BackButton';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [brandId, setBrandId] = useState(searchParams.get('brandId') || '');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(r.data)).catch(() => setCategories([]));
    brandService.getAll().then((r) => setBrands(r.data)).catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    carService
      .getAll({ page, limit: 6, categoryId, brandId })
      .then((r) => {
        const data = r.data.data ?? r.data;
        setCars((prev) => (page === 1 ? data : [...prev, ...data]));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, categoryId, brandId]);

  const handleCategory = (id) => {
    setCategoryId(id);
    setPage(1);
    setSearchParams(
      id
        ? { categoryId: id, ...(brandId ? { brandId } : {}) }
        : brandId ? { brandId } : {}
    );
  };

  const clearBrand = () => {
    setBrandId('');
    setPage(1);
    setSearchParams(categoryId ? { categoryId } : {});
  };

  const activeBrand = brands.find((b) => String(b.id) === String(brandId));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4">
        <BackButton label="Volver al inicio" fallback="/" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-navy">Catálogo</h1>

      {activeBrand && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 bg-navy text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full">
            Marca: {activeBrand.name}
            <button
              onClick={clearBrand}
              aria-label="Quitar filtro de marca"
              className="hover:text-cyan transition"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      <CategoryFilter categories={categories} activeId={categoryId} onChange={handleCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {cars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>

      {cars.length > 0 && (
        <LoadMoreButton onClick={() => setPage((p) => p + 1)} loading={loading} />
      )}

      {!loading && cars.length === 0 && (
        <p className="text-teal text-center mt-8">No se encontraron autos con ese filtro.</p>
      )}
    </div>
  );
}