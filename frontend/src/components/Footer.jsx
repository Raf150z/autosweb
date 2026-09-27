import { Link } from 'react-router-dom';

const socials = ['f', 'x', 'in', 'ig'];

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-10 sm:pt-12 pb-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="text-xl font-bold text-cyanbright mb-3">AutosWeb</h3>
          <p className="text-sm text-graylight">
            Tu concesionaria de confianza para encontrar el auto ideal al mejor precio.
          </p>
          <div className="flex gap-3 mt-4">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-xs font-semibold hover:bg-cyan hover:text-navy transition"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cyan">Compañía</h4>
          <ul className="space-y-2 text-sm text-graylight">
            <li><Link to="/" className="hover:text-cyanbright transition">Inicio</Link></li>
            <li><Link to="/catalog" className="hover:text-cyanbright transition">Catálogo</Link></li>
            <li><Link to="/financing" className="hover:text-cyanbright transition">Financiamiento</Link></li>
            <li><Link to="/login" className="hover:text-cyanbright transition">Iniciar sesión</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cyan">Ayuda</h4>
          <ul className="space-y-2 text-sm text-graylight">
            <li><a href="#" className="hover:text-cyanbright transition">Preguntas frecuentes</a></li>
            <li><a href="#" className="hover:text-cyanbright transition">Términos y condiciones</a></li>
            <li><a href="#" className="hover:text-cyanbright transition">Aviso de privacidad</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-cyan">Contacto</h4>
          <ul className="space-y-2 text-sm text-graylight break-words">
            <li>contacto@autosweb.com</li>
            <li>+52 33 1234 5678</li>
            <li>Lagos de Moreno, Jalisco</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 sm:mt-10 pt-6 border-t border-white/10 text-center text-xs text-graylight">
        © {new Date().getFullYear()} AutosWeb. Todos los derechos reservados.
      </div>
    </footer>
  );
}