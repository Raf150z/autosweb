import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'user' };

export default function UserManager({ onChange }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    userService
      .getAll()
      .then((r) => setUsers(r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditingId(null);
  };

  const handleEditClick = (u) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
    });
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await userService.update(editingId, payload);
      } else {
        await userService.create(form);
      }
      resetForm();
      setShowForm(false);
      load();
      onChange?.();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(
        apiErrors
          ? apiErrors.map((er) => er.msg).join(', ')
          : err.response?.data?.error || 'No se pudo guardar el usuario'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await userService.remove(id);
      load();
      onChange?.();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar');
    }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (u.id === currentUser?.id && newRole !== 'admin') {
      alert('No puedes quitarte el rol admin a ti mismo.');
      return;
    }
    if (!confirm(`¿Cambiar el rol de ${u.name} a "${newRole}"?`)) return;
    try {
      await userService.changeRole(u.id, newRole);
      load();
      onChange?.();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo cambiar el rol');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-navy">
          Usuarios registrados
        </h2>
        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="bg-cyan text-navy font-semibold px-4 py-2 rounded-lg hover:bg-cyanbright transition w-full sm:w-auto text-sm"
        >
          {showForm ? 'Cerrar formulario' : '+ Agregar usuario'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 grid sm:grid-cols-2 gap-4"
        >
          <h3 className="sm:col-span-2 text-lg sm:text-xl font-bold text-navy">
            {editingId ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>

          {error && (
            <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Correo</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="juan@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              {editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            </label>
            <input
              type="password"
              required={!editingId}
              minLength={editingId ? 0 : 6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder={editingId ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full p-2 border border-graylight rounded focus:outline-none focus:ring-2 focus:ring-cyan"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-teal transition disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : editingId ? 'Actualizar usuario' : 'Crear usuario'}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-6 py-2 rounded-lg border border-graylight text-navy hover:bg-graylight transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg -mx-4 sm:mx-0">
        <table className="w-full text-xs sm:text-sm min-w-[640px]">
          <thead className="bg-graylight">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Registro</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-teal">Cargando...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-teal">Sin usuarios.</td></tr>
            ) : (
              users.map((u) => {
                const isMe = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-t">
                    <td className="p-3 whitespace-nowrap">
                      {u.name}
                      {isMe && (
                        <span className="ml-2 text-[10px] font-semibold text-cyan bg-cyan/10 px-2 py-0.5 rounded-full">
                          TÚ
                        </span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">{u.email}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleRole(u)}
                        disabled={isMe}
                        title={isMe ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                        className={`text-xs font-semibold px-2 py-1 rounded-full transition ${
                          u.role === 'admin'
                            ? 'bg-navy text-white hover:bg-teal'
                            : 'bg-cyan/20 text-navy hover:bg-cyan/40'
                        } ${isMe ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap text-teal">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('es-MX')
                        : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-cyan hover:text-teal hover:underline font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={isMe}
                          className={`font-medium ${
                            isMe
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:underline'
                          }`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}