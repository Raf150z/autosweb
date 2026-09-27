import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import BackButton from '../components/BackButton';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones locales
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'user',
      });

      setSuccess('¡Cuenta creada! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(
        apiErrors
          ? apiErrors.map((er) => er.msg).join(', ')
          : err.response?.data?.error || 'No se pudo crear la cuenta'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-4 sm:mx-auto mt-6 sm:mt-12">
      <div className="mb-4">
        <BackButton label="Volver al inicio" fallback="/" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-2 text-navy">Crear cuenta</h2>
        <p className="text-sm text-teal mb-5">
          Regístrate para guardar tus autos favoritos y cotizaciones.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
            {success}
          </div>
        )}

        <label className="block text-sm font-medium text-navy mb-1">Nombre completo</label>
        <input
          type="text"
          placeholder="Ej. Juan Pérez"
          required
          value={form.name}
          onChange={handleChange('name')}
          className="w-full p-2 border border-graylight rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan"
        />

        <label className="block text-sm font-medium text-navy mb-1">Correo</label>
        <input
          type="email"
          placeholder="tucorreo@ejemplo.com"
          required
          value={form.email}
          onChange={handleChange('email')}
          className="w-full p-2 border border-graylight rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan"
        />

        <label className="block text-sm font-medium text-navy mb-1">Contraseña</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange('password')}
          className="w-full p-2 border border-graylight rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan"
        />

        <label className="block text-sm font-medium text-navy mb-1">Confirmar contraseña</label>
        <input
          type="password"
          placeholder="Repite tu contraseña"
          required
          minLength={6}
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full p-2 border border-graylight rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy text-white py-2 rounded hover:bg-teal transition disabled:opacity-50"
        >
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-sm text-center mt-4 text-navy">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-cyan hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}