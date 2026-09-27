import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/carService';
import { formatPrice } from '../utils/formatPrice';
import BackButton from '../components/BackButton';

export default function Financing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    carService
      .getAll({ limit: 100 })
      .then((r) => setCars(r.data.data ?? r.data))
      .catch(() => setError('No se pudieron cargar los vehículos disponibles.'))
      .finally(() => setLoading(false));
  }, []);

  const carsByBrand = useMemo(() => {
    const groups = {};
    cars.forEach((car) => {
      const brandName = car.brand?.name ?? 'Sin marca';
      if (!groups[brandName]) groups[brandName] = [];
      groups[brandName].push(car);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [cars]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-4">
        <BackButton label="Volver al inicio" fallback="/" />
      </div>

      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3">
          Cotiza tu vehículo
        </h1>
        <p className="text-teal max-w-2xl mx-auto text-sm sm:text-base">
          Elige el vehículo que te interesa y te llevaremos a la calculadora de
          financiamiento con su precio ya cargado.
        </p>
      </div>

      {loading && <p className="text-center text-teal py-8">Cargando vehículos...</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {!loading && !error && carsByBrand.length > 0 && (
        <div className="space-y-8 sm:space-y-10">
          {carsByBrand.map(([brandName, brandCars]) => (
            <section key={brandName}>
              <h2 className="text-base sm:text-lg font-bold text-navy mb-4 border-b border-graylight pb-2">
                {brandName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {brandCars.map((car) => (
                  <Link
                    key={car.id}
                    to={`/cars/${car.id}`}
                    className="group relative block text-left rounded-xl overflow-hidden border-2 border-graylight hover:border-cyan transition bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="h-32 sm:h-36 bg-navy overflow-hidden">
                      <img
                        src={car.imageUrl || 'https://via.placeholder.com/400x300?text=Auto'}
                        alt={car.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { e.target.style.opacity = 0; }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-navy text-sm">
                        {car.brand?.name} {car.model}
                      </p>
                      <p className="text-xs text-teal mt-0.5">
                        {car.year} · {car.category?.name}
                      </p>
                      <p className="text-base font-bold text-navy mt-2">
                        {formatPrice(car.price)}
                      </p>
                      <span className="inline-block mt-2 text-xs font-medium text-cyan group-hover:text-teal transition">
                        Cotizar este auto →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!loading && !error && carsByBrand.length === 0 && (
        <div className="text-center py-12 bg-graylight/40 rounded-2xl">
          <p className="text-teal mb-4">No hay vehículos disponibles por el momento.</p>
          <Link
            to="/catalog"
            className="inline-block bg-cyan text-navy px-6 py-2 rounded-full font-semibold hover:bg-cyanbright transition"
          >
            Ver catálogo
          </Link>
        </div>
      )}
    </div>
  );
}