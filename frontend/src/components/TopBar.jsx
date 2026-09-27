import { Link } from 'react-router-dom';

const HIGHLIGHTS = [
  'Envío a todo el país',
  'Garantía incluida',
  'Financiamiento a tu medida',
  'Asesoría personalizada',
];

export default function TopBar() {
  return (
    <div className="bg-graylight/70 border-b border-graylight">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        <Link
          to="/financing"
          className="inline-block bg-navy text-white px-4 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-teal transition whitespace-nowrap"
        >
          Cotizar un vehículo
        </Link>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8">
          {HIGHLIGHTS.map((text) => (
            <span
              key={text}
              className="text-[11px] sm:text-xs md:text-sm font-medium text-navy whitespace-nowrap"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}