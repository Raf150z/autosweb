export default function CategoryFilter({ categories, activeId, onChange }) {
  return (
    <div className="mb-6 -mx-4 px-4 overflow-x-auto sm:overflow-visible sm:mx-0 sm:px-0">
      <div className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap pb-2 sm:pb-0">
        <button
          onClick={() => onChange('')}
          className={`shrink-0 px-4 py-2 rounded-full transition font-medium text-sm ${
            !activeId
              ? 'bg-navy text-white'
              : 'bg-white text-navy border border-graylight hover:bg-graylight'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const active = String(activeId) === String(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`shrink-0 relative overflow-hidden px-4 py-2 rounded-full transition font-medium text-sm ${
                active
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy border border-graylight hover:bg-graylight'
              }`}
            >
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover ${
                    active ? 'opacity-25' : 'opacity-10'
                  }`}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}