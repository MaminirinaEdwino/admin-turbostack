import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // L'API renvoie un tableau d'utilisateurs ou un objet selon le format
          const user = Array.isArray(data) ? data[0] : data;
          setUserData(user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen text-sm">Chargement de l'utilisateur...</div>;
  if (!userData) return <div className="flex items-center justify-center h-screen text-sm text-rose-500">Utilisateur introuvable.</div>;

  return (
    <div className="min-h-screen bg-couleur3 dark:bg-gray-950 p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-couleur1 dark:text-couleur2 hover:underline cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour au Dashboard
        </button>

        <div className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-couleur1/10 text-couleur1 dark:text-couleur2 rounded-2xl">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-couleur1 dark:text-gray-100">{userData.username}</h1>
              <p className="text-xs text-gray-400 font-mono">ID Utilisateur : #{userData.id}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-couleur1/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Rôle du compte :</span>
              <span className="font-bold text-couleur1 dark:text-couleur2 flex items-center gap-1">
                <ShieldCheck size={14} /> Standard User
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}