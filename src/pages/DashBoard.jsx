import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FolderGit2, Trash2, ExternalLink, LogOut } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' ou 'users'
    const navigate = useNavigate();

    const token = localStorage.getItem('admin_token');



    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        const fetchData = async () => {
            try {
                setLoading(true);
                // Récupération de tous les projets
                const projRes = await fetch('http://localhost:8080/api/all/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (projRes.ok) {
                    const projData = await projRes.json();
                    setProjects(projData || []);
                }

                // Récupération de tous les utilisateurs
                const userRes = await fetch('http://localhost:8080/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(userRes)
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUsers(userData || []);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des données du dashboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteProject = async (projectName) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer le projet "${projectName}" ?`)) return;

        try {
            const res = await fetch(`http://localhost:8080/api/projects/${projectName}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setProjects(projects.filter(p => p.project.nom !== projectName));
            } else {
                alert('Erreur lors de la suppression du projet.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-couleur3 dark:bg-gray-950 overflow-hidden">
            {/* Sidebar de navigation Admin */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-couleur1/10 dark:border-white/10 flex flex-col justify-between p-4">
                <div>
                    <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-couleur1/10 dark:border-white/10">
                        <LayoutDashboard className="text-couleur1 dark:text-couleur2" size={24} />
                        <h1 className="font-bold text-base text-couleur1 dark:text-gray-100">Admin Panel</h1>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'projects'
                                    ? 'bg-couleur1 text-white shadow-md'
                                    : 'text-couleur1/70 dark:text-gray-400 hover:bg-couleur1/5'
                                }`}
                        >
                            <FolderGit2 size={18} /> Projets globaux ({projects.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'users'
                                    ? 'bg-couleur1 text-white shadow-md'
                                    : 'text-couleur1/70 dark:text-gray-400 hover:bg-couleur1/5'
                                }`}
                        >
                            <Users size={18} /> Utilisateurs ({users.length})
                        </button>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                    <LogOut size={16} /> Déconnexion
                </button>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-sm text-couleur1/50">Chargement des données...</div>
                    ) : (
                        <>
                            {/* SECTION PROJETS */}
                            {activeTab === 'projects' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-couleur1 dark:text-gray-100">Liste de tous les Projets</h2>
                                        <span className="text-xs bg-couleur1/10 px-3 py-1 rounded-full text-couleur1 font-bold">{projects.length} projets</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {projects.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-base text-couleur1 dark:text-gray-100 truncate">{item.project.nom}</h3>
                                                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-couleur1/5 text-couleur1 dark:text-couleur2 rounded-md font-semibold">
                                                            {item.project.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                                        {item.project.description || 'Aucune description disponible.'}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-couleur1/5 dark:border-white/5">
                                                    <button
                                                        onClick={() => navigate(`/projects/${item.id}`)}
                                                        className="flex items-center gap-1.5 text-xs font-semibold text-couleur1 dark:text-couleur2 hover:underline cursor-pointer"
                                                    >
                                                        <ExternalLink size={14} /> Examiner
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProject(item.project.nom)}
                                                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                                                        title="Supprimer le projet"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION UTILISATEURS */}
                            {activeTab === 'users' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-couleur1 dark:text-gray-100">Liste des Utilisateurs</h2>
                                        <span className="text-xs bg-couleur1/10 px-3 py-1 rounded-full text-couleur1 font-bold">{users.length} utilisateurs</span>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 border border-couleur1/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-couleur1/10 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-couleur1/60 dark:text-gray-400 bg-couleur1/5">
                                                    <th className="p-4">ID</th>
                                                    <th className="p-4">Nom d'utilisateur</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-couleur1/5 dark:divide-white/5 text-sm">
                                                {users.map((usr) => (
                                                    <tr key={usr.id} className="hover:bg-couleur1/5 transition-colors">
                                                        <td className="p-4 font-mono text-xs opacity-60">#{usr.id}</td>
                                                        <td className="p-4 font-semibold text-couleur1 dark:text-gray-200">{usr.username}</td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => navigate(`/users/${usr.id}`)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-couleur1/10 text-couleur1 dark:text-couleur2 rounded-lg hover:bg-couleur1 hover:text-white transition-all cursor-pointer"
                                                            >
                                                                <ExternalLink size={14} /> Voir détails
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}