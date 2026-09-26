import { useNavigate, useLocation, Link } from 'react-router-dom';
export default function BackButton({ fallback = '/', label = 'Regresar' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key === 'default') {
      navigate(fallback);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-navy transition group"
    >
      <span
        aria-hidden="true"
        className="w-7 h-7 rounded-full bg-white border border-graylight flex items-center justify-center group-hover:bg-navy group-hover:text-white group-hover:border-navy transition"
      >
        ←
      </span>
      <span>{label}</span>
    </button>
  );
}