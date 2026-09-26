import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-sm mx-4 sm:mx-auto mt-6 sm:mt-12">
      <div className="mb-4">
        <BackButton label="Volver al inicio" fallback="/" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-navy">Iniciar sesión</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border border-graylight rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan"
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border border-graylight rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan"
        />

        <button className="w-full bg-navy text-white py-2 rounded hover:bg-teal transition">
          Entrar
        </button>

        <p className="text-sm text-center mt-4 text-navy">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-cyan hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}