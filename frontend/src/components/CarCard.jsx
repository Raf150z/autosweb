import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

export default function CarCard({ car }) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
      <div className="bg-navy h-44 sm:h-48 overflow-hidden">
        <img
          src={car.imageUrl || 'https://via.placeholder.com/400x300?text=Auto'}
          alt={car.model}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold text-navy">
          {car.brand?.name} {car.model}
        </h3>
        <p className="text-xs sm:text-sm text-teal">{car.year} · {car.category?.name}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg sm:text-xl font-semibold text-navy">{formatPrice(car.price)}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            <span className="w-1.5 h-1.5 rounded-full bg-navy" />
          </div>
        </div>
        <Link
          to={`/cars/${car.id}`}
          className="inline-block mt-3 text-sm font-medium text-cyan hover:text-teal transition"
        >
          Ver más →
        </Link>
      </div>
    </article>
  );
}