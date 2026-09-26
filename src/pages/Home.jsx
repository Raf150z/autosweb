import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService, categoryService, brandService } from '../services/carService';
import CarCard from '../components/CarCard';
import SectionHeading from '../components/SectionHeading';
import TopBar from '../components/TopBar';

const VALUES = [
  {
    icon: '🚗',
    title: 'Amplio catálogo',
    desc: 'Cientos de modelos disponibles',
    size: 'w-20 h-20 text-2xl',
  },
  {
    icon: '🛡️',
    title: 'Garantía incluida',
    desc: 'Compra con total confianza',
    size: 'w-24 h-24 sm:w-28 sm:h-28 text-3xl',
  },
  {
    icon: '💳',
    title: 'Financiamiento',
    desc: 'Planes de pago a tu medida',
    size: 'w-20 h-20 text-2xl',
  },
];

const CATS_VISIBLE = 3;
const BRANDS_VISIBLE = 4;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catIndex, setCatIndex] = useState(0);
  const [brandIndex, setBrandIndex] = useState(0);

  useEffect(() => {
    carService
      .getAll({ limit: 6 })
      .then((r) => setFeatured(r.data.data ?? r.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));

    categoryService
      .getAll()
      .then((r) => setCategories(r.data))
      .catch(() => setCategories([]));

    brandService
      .getAll()
      .then((r) => setBrands(r.data))
      .catch(() => setBrands([]));
  }, []);

  // ---- Categorías ----
  const totalCats = categories.length;
  const maxCatIndex = Math.max(0, totalCats - CATS_VISIBLE);
  const prevCat = () => setCatIndex((i) => Math.max(0, i - 1));
  const nextCat = () => setCatIndex((i) => Math.min(maxCatIndex, i + 1));
  const visibleCats = categories.slice(catIndex, catIndex + CATS_VISIBLE);

  // ---- Marcas ----
  const totalBrands = brands.length;
  const maxBrandIndex = Math.max(0, totalBrands - BRANDS_VISIBLE);
  const prevBrand = () => setBrandIndex((i) => Math.max(0, i - 1));
  const nextBrand = () => setBrandIndex((i) => Math.min(maxBrandIndex, i + 1));
  const visibleBrands = brands.slice(brandIndex, brandIndex + BRANDS_VISIBLE);

  return (
    <div>
      <TopBar />

      {/* HERO */}
      <section className="relative bg-navy text-white pt-12 sm:pt-14 px-4 sm:px-8 pb-28 sm:pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Encuentra tu auto ideal
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-graylight">
            Los mejores modelos al mejor precio
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-cyan text-navy px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-cyanbright transition text-sm sm:text-base"
          >
            Ver catálogo
          </Link>
        </div>

        {/* CARRUSEL DE CATEGORÍAS */}
        {totalCats > 0 && (
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-full max-w-3xl px-4">
            <div className="relative flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={prevCat}
                disabled={catIndex === 0}
                aria-label="Categorías anteriores"
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-navy shadow-lg flex items-center justify-center font-bold hover:bg-cyan hover:text-navy transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                ←
              </button>

              <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 overflow-hidden">
                {visibleCats.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalog?categoryId=${cat.id}`}
                    className="group relative overflow-hidden bg-cyan text-navy rounded-xl font-semibold hover:bg-cyanbright transition aspect-[4/3] flex items-end justify-center shadow-xl"
                  >
                    {cat.imageUrl && (
                      <img
                        src={cat.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-85 transition"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="relative z-10 text-xs sm:text-sm md:text-base leading-tight text-center">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={nextCat}
                disabled={catIndex >= maxCatIndex}
                aria-label="Siguientes categorías"
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-navy shadow-lg flex items-center justify-center font-bold hover:bg-cyan hover:text-navy transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                →
              </button>
            </div>

            {totalCats > CATS_VISIBLE && (
              <div className="flex justify-center gap-1.5 mt-3">
                {Array.from({ length: maxCatIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCatIndex(i)}
                    aria-label={`Ir a la posición ${i + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition ${
                      i === catIndex ? 'bg-cyan w-4' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* AUTOS DESTACADOS */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading>Autos destacados</SectionHeading>
          {loading ? (
            <p className="text-teal text-center">Cargando...</p>
          ) : featured.length === 0 ? (
            <p className="text-teal text-center">Aún no hay autos registrados.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {featured.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MARCAS DESTACADAS — CARRUSEL */}
      {totalBrands > 0 && (
        <section className="bg-white py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading>Marcas destacadas</SectionHeading>

            <div className="relative flex items-center gap-2 sm:gap-3">
              {/* Flecha izquierda */}
              <button
                type="button"
                onClick={prevBrand}
                disabled={brandIndex === 0}
                aria-label="Marcas anteriores"
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white shadow-lg flex items-center justify-center font-bold hover:bg-teal transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-navy"
              >
                ←
              </button>

              {/* Ventana de 4 marcas */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 overflow-hidden">
                {visibleBrands.map((brand, i) => (
                  <Link
                    key={brand.id}
                    to={`/catalog?brandId=${brand.id}`}
                    title={`Ver autos ${brand.name}`}
                    className={`group aspect-square rounded-xl flex flex-col items-center justify-center gap-2 text-white font-semibold text-sm sm:text-lg text-center px-2 py-4 bg-teal hover:bg-navy transition ${
                      (brandIndex + i) % 2 === 1 ? 'hatch-pattern' : ''
                    }`}
                  >
                    {brand.logoUrl ? (
                      <span className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm overflow-hidden">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none';
                          }}
                        />
                      </span>
                    ) : null}
                    <span>{brand.name}</span>
                  </Link>
                ))}
              </div>

              {/* Flecha derecha */}
              <button
                type="button"
                onClick={nextBrand}
                disabled={brandIndex >= maxBrandIndex}
                aria-label="Siguientes marcas"
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white shadow-lg flex items-center justify-center font-bold hover:bg-teal transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-navy"
              >
                →
              </button>
            </div>

            {/* Dots */}
            {totalBrands > BRANDS_VISIBLE && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: maxBrandIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBrandIndex(i)}
                    aria-label={`Ir a la posición ${i + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition ${
                      i === brandIndex ? 'bg-navy w-4' : 'bg-navy/30 hover:bg-navy/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <SectionHeading>¿Por qué elegirnos?</SectionHeading>
        <div className="flex flex-wrap justify-center items-end gap-6 sm:gap-10">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center text-center max-w-[160px] sm:max-w-[180px]"
            >
              <div
                className={`${v.size} rounded-full bg-navy text-white flex items-center justify-center mb-4`}
              >
                {v.icon}
              </div>
              <h3 className="font-semibold text-navy text-sm sm:text-base">{v.title}</h3>
              <p className="text-xs sm:text-sm text-teal mt-1">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}