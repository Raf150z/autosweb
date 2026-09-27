import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carService } from '../services/carService';
import { formatPrice } from '../utils/formatPrice';
import FinancingCalculator from '../components/FinancingCalculator';
import BackButton from '../components/BackButton';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    carService
      .getById(id)
      .then((r) => setCar(r.data))
      .catch(() => setError('No se pudo cargar la información de este vehículo.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center py-24 text-teal">Cargando...</p>;
  }

  if (error || !car) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-teal mb-4">{error || 'Vehículo no encontrado.'}</p>
        <BackButton label="Volver al catálogo" fallback="/catalog" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-4">
        <BackButton label="Regresar" fallback="/catalog" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 mt-2">
        <div className="bg-navy rounded-2xl overflow-hidden">
          <img
            src={car.imageUrl || 'https://via.placeholder.com/600x400?text=Auto'}
            alt={car.model}
            className="w-full h-60 sm:h-72 md:h-96 object-cover"
          />
        </div>

        <div>
          {car.category?.name && (
            <span className="inline-block bg-graylight text-navy text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {car.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">
            {car.brand?.name} {car.model}
          </h1>
          <p className="text-teal mt-1">{car.year}</p>
          <p className="text-2xl sm:text-3xl font-bold text-navy mt-4">
            {formatPrice(car.price)}
          </p>
          <p className="text-navy/80 mt-4 leading-relaxed text-sm sm:text-base">
            {car.description}
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mt-14">
        <h2 className="text-xl sm:text-2xl font-bold text-navy mb-2">
          Simula tu financiamiento
        </h2>
        <p className="text-teal text-sm mb-6">
          Ajusta el enganche, el plazo y el plan para ver un estimado de tu pago mensual.
        </p>
        <FinancingCalculator price={car.price} />
      </div>
    </div>
  );
}