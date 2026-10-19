import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User } from 'lucide-react';

export default function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects ou accès non autorisé.');
      }

      const data = await response.json();
      // Enregistrement du token JWT dans le localStorage
      localStorage.setItem('admin_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-couleur3 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-couleur1/10 text-couleur1 dark:text-couleur2 rounded-2xl mb-3">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-couleur1 dark:text-gray-100">TurboStack Admin</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connectez-vous pour accéder au panneau de contrôle</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-couleur1/70 dark:text-gray-400 mb-1">
              Nom d'administrateur
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-couleur1/20 dark:border-white/20 focus:border-couleur1 dark:focus:border-white rounded-xl outline-none text-sm transition-colors text-couleur1 dark:text-gray-100"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-couleur1/70 dark:text-gray-400 mb-1">
              Mot de passe
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-couleur1/20 dark:border-white/20 focus:border-couleur1 dark:focus:border-white rounded-xl outline-none text-sm transition-colors text-couleur1 dark:text-gray-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-couleur1 hover:bg-couleur1/90 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}