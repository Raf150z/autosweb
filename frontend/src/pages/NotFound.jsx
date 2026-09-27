import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function NotFound() {
  return (
    <div className="text-center py-24 sm:py-32 px-4">
      <div className="flex justify-center mb-6">
        <BackButton label="Regresar" fallback="/" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold text-navy">404</h1>
      <p className="text-lg sm:text-xl mt-4 text-navy">Página no encontrada</p>
      <Link
        to="/"
        className="inline-block mt-6 bg-navy text-white px-6 py-2 rounded hover:bg-teal transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}