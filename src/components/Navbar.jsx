import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = 'hover:text-cyan transition py-1';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-base sm:text-lg font-bold"
          onClick={closeMenu}
        >
          <span className="bg-cyan text-navy w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-extrabold">
            A
          </span>
          <span className="text-cyanbright">AutosWeb</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          <Link to="/" className={linkClass}>Inicio</Link>
          <Link to="/catalog" className={linkClass}>Catálogo</Link>
          <Link to="/financing" className={linkClass}>Financiamiento</Link>
          {isAdmin && <Link to="/admin" className={linkClass}>Admin</Link>}

          {user ? (
            <>
              <span className="text-sm text-graylight">Hola, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-cyan text-navy px-4 py-1 rounded font-semibold hover:bg-cyanbright transition text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg hover:bg-white/5 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 pt-2 border-t border-white/10 flex flex-col gap-3">
          <Link to="/" className={linkClass} onClick={closeMenu}>Inicio</Link>
          <Link to="/catalog" className={linkClass} onClick={closeMenu}>Catálogo</Link>
          <Link to="/financing" className={linkClass} onClick={closeMenu}>Financiamiento</Link>
          {isAdmin && <Link to="/admin" className={linkClass} onClick={closeMenu}>Admin</Link>}

          {user ? (
            <>
              <span className="text-sm text-graylight">Hola, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-left"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="bg-cyan text-navy px-4 py-2 rounded font-semibold hover:bg-cyanbright transition text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}