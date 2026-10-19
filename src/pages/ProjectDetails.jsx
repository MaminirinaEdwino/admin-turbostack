import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderGit2, Calendar, Database, Cpu } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`http://localhost:8080/api/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProjectData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen text-sm">Chargement du projet...</div>;
  if (!projectData) return <div className="flex items-center justify-center h-screen text-sm text-rose-500">Projet introuvable.</div>;

  return (
    <div className="min-h-screen bg-couleur3 dark:bg-gray-950 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-couleur1 dark:text-couleur2 hover:underline cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour au Dashboard
        </button>

        {/* En-tête du Projet */}
        <div className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-couleur1 dark:text-gray-100 flex items-center gap-2">
              <FolderGit2 className="text-couleur2" /> {projectData.nom}
            </h1>
            <span className="text-xs uppercase px-3 py-1 bg-couleur1/10 text-couleur1 dark:text-couleur2 font-bold rounded-lg">
              {projectData.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{projectData.description || 'Aucune description.'}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-couleur1/5">
            <span className="flex items-center gap-1"><Calendar size={14} /> Créé le : {new Date(projectData.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Mis à jour : {new Date(projectData.updateAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Détails techniques : Base de données & Endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SGBD et Modèles */}
          <div className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-couleur1 dark:text-gray-100">
              <Database size={18} /> Modèles BDD ({projectData.bdd?.models?.length || 0})
            </h2>
            <div className="space-y-2">
              {projectData.bdd?.models?.map((m, idx) => (
                <div key={idx} className="p-3 bg-couleur1/5 rounded-xl border border-couleur1/5">
                  <p className="font-bold text-sm text-couleur1 dark:text-gray-200">{m.nom}</p>
                  <p className="text-xs text-gray-400 mt-1">{m.champs?.length || 0} champs configurés</p>
                </div>
              ))}
            </div>
          </div>

          {/* Endpoints Rest API */}
          <div className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2 text-couleur1 dark:text-gray-100">
              <Cpu size={18} /> Endpoints API ({projectData.rest_api?.endpoints?.length || 0})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projectData.rest_api?.endpoints?.map((ep, idx) => (
                <div key={idx} className="p-3 bg-couleur1/5 rounded-xl border border-couleur1/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white dark:bg-gray-800 rounded shadow-xs text-couleur1">
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate ml-2">{ep.uri}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}