export default function LoadMoreButton({ onClick, loading }) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="bg-navy text-white px-6 py-2.5 rounded-lg hover:bg-teal transition disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? 'Cargando...' : 'Cargar más'}
      </button>
    </div>
  );
}